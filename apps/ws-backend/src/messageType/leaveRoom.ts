import { roomPayload } from "../interface/roomInterface";
import WebSocket from "ws";
import { users } from "../userManager";
import { prismaClient } from "@repo/db/client";

export default async function leaveRoom(ws:WebSocket,parsedData:roomPayload) {
    const user = users.find(x => x.socket === ws);
    if(!user) return;

    if(user.room === null){
        ws.send(JSON.stringify({
            type:"error",
            message:"You cannot leave this room as you are not a part of this room"
        }));
        return;
    }
    const roomId = user.room;
    user.room  = null;

    user.leaveTimeout = setTimeout(async () => {

        const room = await prismaClient.room.findUnique({
            where:{
                id:roomId
            },
            include:{
                players:true
            }
        });
        if(!room || !room.active) return;

        const opponent = room?.players.find(x => x.id !== user.userId);
        const opponentUser = users.find(x => x.userId === opponent?.id);

        await prismaClient.room.update({
            where:{
                id:roomId
            },
            data:{
                active:false,
                winnerId:opponent?.id,
                players:{
                    disconnect:{
                        id:user.userId
                    }
                }
            }
        });

        opponentUser?.socket.send(JSON.stringify({
            type:"success",
            message:"Oppnonent left the room",
            winner:opponent?.id
        }))
        user.leaveTimeout = undefined;
        
    },30000)
    
}