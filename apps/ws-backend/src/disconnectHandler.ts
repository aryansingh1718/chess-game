import WebSocket from "ws";
import { users } from "./userManager";
import { prismaClient } from "@repo/db/client";
import { games } from "./gameManager";

export async function disconnectHandler(ws:WebSocket) {             //fn to handle disconnection from ws server
    
    const user = users.find(x => x.socket === ws);
    if(!user) return;

    const roomId = user.room;
    const userId = user.userId;
    if(!roomId) return;                                             //nothing to handle if user is not in any room, simply disconnect 

    user.leaveTimeout = setTimeout( async () => {                 //setting a timer so that if the user tries to reconnect, it doesn't lose its game state immediately
        
        const room = await prismaClient.room.findUnique({
            where:{
                id:roomId,
            },include:{
                players:true
            }
        });
        if(!room || !room.active) return;

        const opponent = room.players.find(x => x.id !== userId);
        const opponentUser = users.find(x => x.userId === opponent?.id);

        await prismaClient.room.update({                        //declaring the opponent as the winner and making the room inactive
            where:{
                id:roomId
            },data:{
                active:false,
                winnerId:opponent?.id,
                players:{
                    disconnect:{
                        id:userId
                    }
                }
            }
        });

        const index = users.findIndex(u => u.userId === user.userId);       //removing the user from users 
        if (index !== -1) {
            users.splice(index, 1);
        }

        user.leaveTimeout = undefined;                          //killing the user's timeout
        games.delete(roomId);                                   //deleting the game with the given roomId

        if (opponentUser?.socket && opponentUser.socket.readyState === WebSocket.OPEN) {        //sending winner msg to the opponent's socket
                opponentUser?.socket.send(JSON.stringify({
                type: "game-over",
                message: "Opponent left the room, you won!",
                winner: opponent?.id
            }));
        }

    }, 30000);

}