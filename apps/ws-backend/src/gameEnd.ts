import { prismaClient } from "@repo/db/client";
import { games } from "./gameManager";
import { users } from "./userManager";

interface endGameParams {
    roomId:number;
    winnerId?:string;
    reason:"checkmate" | "timeout" | "draw";
    winnerName?:string
}

export default async function gameEnd({roomId,winnerId,reason,winnerName}:endGameParams) {

    const game = games.get(roomId);
    if(!game) return;

    if (reason !== "draw" && !winnerId) {                       //if the game is not a draw yet there is no winner id passed as a parameter
    throw new Error("winnerId required for non-draw end");
    }

    const {whiteId,blackId} = game;
    const whiteUser = users.find(x => x.userId === whiteId);
    const blackUser = users.find(x => x.userId === blackId);
    if(!whiteUser || !blackUser) return;

    await prismaClient.room.update({                            //updating the room with winner Id and result
        where:{
            id:roomId
        },data:{
            active:false,
            winnerId: reason === "draw" ? null : winnerId,
            draw: reason === "draw" ? true : false
        }
    })

    if (game?.moveTimeout) {                            //clearing timeout
    clearTimeout(game.moveTimeout);
    }
    whiteUser.room = null;                              //making user.room = null for both users
    blackUser.room = null;
    games.delete(roomId);                                       //deleting the game from games map

    const payload =                                             
        reason === "draw" ? {
            result:"draw"
        } : {
            result:"win", winnerId
        }
    
    //sending the result message to both the sockets
    whiteUser?.socket.send(JSON.stringify({
        type:"game-end",
        payload
    }));
    blackUser?.socket.send(JSON.stringify({
        type:"game-end",
        payload
    }));
}