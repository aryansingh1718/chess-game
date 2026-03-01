import { prismaClient } from "@repo/db/client";
import {Chess} from "chess.js";
import { games } from "./gameManager";
import { users } from "./userManager";

export async function gameStart(roomId:number) {
    
    const room = await prismaClient.room.findUnique({
        where:{
            id:roomId
        },
        include:{
            black:true,
            white:true
        }
    });

    if(!room) return;
    if(!room.active) return;
    if(room.available) return;
    if(!room.whiteId || !room.blackId) return;
    if(games.has(roomId)) return;

    const whiteUser = users.find(x => x.userId === room.whiteId);
    const blackUser = users.find(x => x.userId === room.blackId);
    if(!whiteUser || !blackUser) return;

    const chess = new Chess();
    
    games.set(roomId,{
        chess,
        whiteId:room.whiteId,
        blackId:room.blackId,
        whiteTime:600,
        blackTime:600,
        lastMoveTimeStamp:Date.now()
    })


    whiteUser.socket.send(JSON.stringify({
        type:"game-start",
        payload:{
            color:"white",
            fen:chess.fen(),
            turn:chess.turn()
        }
    }));

    blackUser.socket.send(JSON.stringify({
        type:"game-start",
        payload:{
            color:"black",
            fen:chess.fen(),
            turn:chess.turn()
        }
    }));

}