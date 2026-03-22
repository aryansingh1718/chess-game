import { games } from "../gameManager";
import { MovePayload } from "../interface/roomInterface";
import WebSocket from "ws";
import { users } from "../userManager";
import { prismaClient } from "@repo/db/client";
import { Square,Move } from "chess.js";
import gameEnd from "../gameEnd";
import startMoveTimer from "../startMoveTimer";

export default async function handleMakeMove(ws:WebSocket,parsedData:MovePayload){        //a fn to make a move 

    const roomId = parsedData.roomId;
    const {from,to} = parsedData;
    if(!to || !from) return;

    const user = users.find(x => x.socket === ws);
    if(!user) return;
    const userId = user.userId;
    const userName = user.userName;
    const game = games.get(roomId);
    if(!game) return;

    const whiteId = game.whiteId;
    const blackId = game.blackId;
    if(userId !== whiteId && userId !== blackId) return;        // to check if the player to move is one of the black or white.

    const whiteUserName = users.find(x => x.userId === whiteId)?.userName;
    const blackUserName = users.find(x => x.userId === blackId)?.userName;

    const playerColor = userId === whiteId ? "w" : "b";
    if(game.chess.turn() !== playerColor) return;       // not your turn

    const possibleMoves:Move[] = game.chess.moves({     //stores all the possible moves in detail for a particular square along with the details on each move whether any move is having promotion or something.
        square: from as Square,
        verbose: true
    });

    const moveObj = possibleMoves.find(m => m.to === to);       //to see if the user is making a valid move
    if (!moveObj) return;

    if (moveObj.isPromotion() && !parsedData.promotion) {      //if frontend hasn't specified the piece to which the user wants to promote
        user.socket.send(JSON.stringify({
            type: "promotion-required",
            payload:{
                from,
                to
            }
        }));
        return;
    }
    
    const now = Date.now();
    const elapsed = now - game.lastMoveTimeStamp;               //calculating time taken to make the move
    const active = game.chess.turn();                           //checking whose turn it is

    const whiteUser = users.find(x => x.userId === whiteId);
    const blackUser = users.find(x => x.userId === blackId);

    if(active === "b"){      //calculate the time remaining for the user and checking if there is a timeout
        game.blackTime -= elapsed;

        if(game.blackTime <= 0){
            
            await gameEnd({
                roomId,
                winnerId:whiteId,
                winnerName:whiteUserName,
                reason:"timeout"
            })
            return; 
        }
    }
    else if(active === "w"){
        game.whiteTime -= elapsed;

        if(game.whiteTime <= 0){
            
            await gameEnd({
                roomId,
                winnerId:blackId,
                winnerName:blackUserName,
                reason:"timeout"
            })
            return; 
        }
    }

    const result = game.chess.move({            //making a move
        from,
        to,
        promotion: parsedData.promotion || "q"
    });

    if(!result) return;                         //illegal move
    game.lastMoveTimeStamp = now;
    startMoveTimer(roomId);                     //setting a move timer

    const fen = game.chess.fen();
    const turn = game.chess.turn();
    

    await prismaClient.move.create({                //create a move in move db
        data:{
            move:result.san,
            fen,
            userId,
            roomId
        }
    })

    //sending success msg to both the sockets so that UI of both users can be updated accordingly
    whiteUser?.socket.send(JSON.stringify({
        type:"move-made",
        payload:{
            move:result.san,
            fen,
            turn,
        }
    }));

    blackUser?.socket.send(JSON.stringify({
        type:"move-made",
        payload:{
            move:result.san,
            fen,
            turn
        }
    }));

    if(game.chess.isCheckmate()){               //if the move is a checkmate
        
        return await gameEnd({
                roomId,
                winnerId:userId,
                winnerName:userName,
                reason:"checkmate"
            })
    }

    else if(game.chess.isDraw()){               //if the game is a draw
        
        return await gameEnd({
                roomId,
                reason:"draw"
            })
    }
}