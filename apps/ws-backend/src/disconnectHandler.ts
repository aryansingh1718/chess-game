import WebSocket from "ws";
import { roomPayload } from "./interface/roomInterface";
import { users } from "./userManager";
import { prismaClient } from "@repo/db/client";
import { games } from "./gameManager";

export async function disconnectHandler(ws:WebSocket,parsedData:roomPayload) {
    
    const user = users.find(x => x.socket === ws);
    if(!user) return;

    const roomId = user.room;
    const userId = user.userId;
    if(!roomId) return;

    user.leaveTimeout = setTimeout( async () => {
        
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

        await prismaClient.room.update({
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

        const index = users.findIndex(u => u.userId === user.userId);
        if (index !== -1) {
            users.splice(index, 1);
        }

        user.leaveTimeout = undefined;
        games.delete(roomId);

        if (opponentUser?.socket && opponentUser.socket.readyState === WebSocket.OPEN) {
                opponentUser?.socket.send(JSON.stringify({
                type: "game-over",
                message: "Opponent left the room",
                winner: opponent?.id
            }));
        }

    }, 30000);

}