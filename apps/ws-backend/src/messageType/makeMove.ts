import { games } from "../gameManager";
import { roomPayload } from "../interface/roomInterface";
import WebSocket from "ws";
import { users } from "../userManager";
import { prismaClient } from "@repo/db/client";

export default async function handleMakeMove(ws:WebSocket,parsedData:roomPayload){

    const roomId = parsedData.roomId;
    const {from,to} = parsedData;
    if(!to || !from) return;

    const user = users.find(x => x.socket === ws);
    if(!user) return;
    const userId = user.userId;
    const game = games.get(roomId);
    if(!game) return;

    const whiteId = game.whiteId;
    const blackId = game.blackId;
    if(userId !== whiteId && userId !== blackId) return;

    const playerColor = userId === whiteId ? "w" : "b";
    if(game.chess.turn() !== playerColor) return;       // not your turn

    const result = game.chess.move({
        from,
        to,
        promotion:"q"
    });

    if(!result) return;     //illegal move

    const fen = game.chess.fen();
    const turn = game.chess.turn();

    await prismaClient.move.create({
        data:{
            move:result.san,
            fen,
            userId,
            roomId
        }
    })

    const whiteUser = users.find(x => x.userId === whiteId);
    const blackUser = users.find(x => x.userId === blackId);

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

    if(game.chess.isCheckmate()){
        await prismaClient.room.update({
            where:{
                id:roomId
            },data:{
                active:false,
                winnerId:userId
            }
        });

        games.delete(roomId);

        whiteUser?.socket.send(JSON.stringify({
        type:"game-end",
        payload:{
            result:"win",
            winnerId:userId
        }
    }));

    blackUser?.socket.send(JSON.stringify({
        type:"game-end",
        payload:{
            result:"win",
            winnerId:userId
        }
    }));
    }

    else if(game.chess.isDraw()){
        await prismaClient.room.update({
            where:{
                id:roomId
            },data:{
                active:false,
                draw:true
            }
        });

        games.delete(roomId);

        whiteUser?.socket.send(JSON.stringify({
            type: "game-end",
            payload: {
                result: "draw"
            }
        }));

        blackUser?.socket.send(JSON.stringify({
            type: "game-end",
            payload: {
                result: "draw"
            }
        }));
    }
}