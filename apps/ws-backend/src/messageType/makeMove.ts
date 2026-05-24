import { games } from "../gameManager";
import { MovePayload } from "../interface/roomInterface";
import WebSocket from "ws";
import { users } from "../userManager";
import { prismaClient } from "@repo/db/client";
import { Square,Move } from "chess.js";
import gameEnd from "../gameEnd";
import startMoveTimer from "../startMoveTimer";

export default async function handleMakeMove(ws:WebSocket,parsedData:MovePayload){

    console.log("makeMove called with:", parsedData);

    const roomId = parsedData.roomId;
    const {from,to} = parsedData;

    console.log("roomId:", roomId);
    console.log("from:", from, "to:", to);

    if(!to || !from){
        console.log("missing from/to — returning");
        return;
    }

    const user = users.find(x => x.socket === ws);
    console.log("user found:", !!user);
    if(!user) return;

    const userId = user.userId;
    const userName = user.userName;
    const game = games.get(roomId);

    console.log("game found:", !!game);
    console.log("all game keys:", [...games.keys()]);

    if(!game) return;

    const whiteId = game.whiteId;
    const blackId = game.blackId;

    console.log("whiteId:", whiteId, "blackId:", blackId, "userId:", userId);

    if(userId !== whiteId && userId !== blackId){
        console.log("user is not a player in this game — returning");
        return;
    }

    const whiteUserName = users.find(x => x.userId === whiteId)?.userName;
    const blackUserName = users.find(x => x.userId === blackId)?.userName;

    const playerColor = userId === whiteId ? "w" : "b";

    console.log("playerColor:", playerColor, "chess turn:", game.chess.turn());

    if(game.chess.turn() !== playerColor){
        console.log("not your turn — returning");
        return;
    }

    const possibleMoves:Move[] = game.chess.moves({
        square: from as Square,
        verbose: true
    });

    console.log("possibleMoves count:", possibleMoves.length);

    const moveObj = possibleMoves.find(m => m.to === to);
    console.log("moveObj found:", !!moveObj);
    if (!moveObj) return;

    if (moveObj.isPromotion() && !parsedData.promotion) {
        user.socket.send(JSON.stringify({
            type: "promotion-required",
            payload:{ from, to }
        }));
        return;
    }
    
    const now = Date.now();
    const elapsed = now - game.lastMoveTimeStamp;
    const active = game.chess.turn();

    const whiteUser = users.find(x => x.userId === whiteId);
    const blackUser = users.find(x => x.userId === blackId);

    console.log("whiteUser found:", !!whiteUser, "blackUser found:", !!blackUser);

    if(active === "b"){
        game.blackTime -= elapsed;
        if(game.blackTime <= 0){
            await gameEnd({ roomId, winnerId:whiteId, winnerName:whiteUserName, reason:"timeout" });
            return; 
        }
    }
    else if(active === "w"){
        game.whiteTime -= elapsed;
        if(game.whiteTime <= 0){
            await gameEnd({ roomId, winnerId:blackId, winnerName:blackUserName, reason:"timeout" });
            return; 
        }
    }

    const result = game.chess.move({
        from,
        to,
        promotion: parsedData.promotion || "q"
    });

    console.log("move result:", result);

    if(!result){
        console.log("illegal move — returning");
        return;
    }

    game.lastMoveTimeStamp = now;
    startMoveTimer(roomId);

    const fen = game.chess.fen();
    const turn = game.chess.turn();

    await prismaClient.move.create({
        data:{ move:result.san, fen, userId, roomId }
    });

    console.log("sending move-made to whiteUser and blackUser");

    whiteUser?.socket.send(JSON.stringify({
        type:"move-made",
        payload:{ move:{from,to}, fen, turn }
    }));

    blackUser?.socket.send(JSON.stringify({
        type:"move-made",
        payload:{ move:{from,to}, fen, turn }
    }));

    if(game.chess.isCheckmate()){
        return await gameEnd({ roomId, winnerId:userId, winnerName:userName, reason:"checkmate" });
    }
    else if(game.chess.isDraw()){
        return await gameEnd({ roomId, reason:"draw" });
    }
}