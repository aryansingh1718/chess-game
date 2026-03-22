import { prismaClient } from "@repo/db/client";
import {Chess} from "chess.js";
import { games } from "./gameManager";
import { users } from "./userManager";
import startMoveTimer from "./startMoveTimer";

export async function gameStart(roomId:number) {                //function execting in the beginning of the game doing initial things
    
    const room = await prismaClient.room.findUnique({           //finding if the room with given roomId exists actively and has both players.
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
    if(games.has(roomId)) return;                           //check if a game is already going on in this room

    const whiteUser = users.find(x => x.userId === room.whiteId);
    const blackUser = users.find(x => x.userId === room.blackId);
    if(!whiteUser || !blackUser) return;

    const chess = new Chess();                              //initializing a new chess instance for this room
    
    games.set(roomId,{                                      //putting a new game instance in games map
        chess,
        whiteId:room.whiteId,
        blackId:room.blackId,
        whiteTime:600000,
        blackTime:600000,
        lastMoveTimeStamp:Date.now()
    });

    startMoveTimer(roomId);                       //setting the move timer          

    //sending both users the success msg and their fen and turn
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