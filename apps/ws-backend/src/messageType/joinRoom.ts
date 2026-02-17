import { prismaClient } from "@repo/db/client";
import { users } from "../userManager";
import WebSocket from "ws";
import { roomPayload } from "../interface/roomInterface";

export default async function joinRoom(ws:WebSocket,parsedData:roomPayload){

    const user = users.find(x => x.socket === ws);
            if(!user) return;

            if(user?.room !== null){
                ws.send(JSON.stringify({
                    type:"error",
                    message:"You cannot join another room while being in another room"
                }));
                return;
            }

            const roomId = parsedData.roomId;
            if(!roomId){
                ws.send(JSON.stringify({
                    type:"error",
                    message:"Room Id is required"
                }));
                return;
            }

            const room = await prismaClient.room.findFirst({
                where:{
                    id:roomId,
                    active:true
                },
                include:{
                    players:true
                }
            });
            if(!room){
                ws.send(JSON.stringify({
                    type:"error",
                    message:"Room with this Id doesn't exist"
                }));
                return;
            }

            if (user.leaveTimeout) {
                clearTimeout(user.leaveTimeout);
                user.leaveTimeout = undefined;
            }

            if(room.players.length >= 2){
                ws.send(JSON.stringify({
                    type:"error",
                    message:"The room already has two players"
                }));
                return;
            }

            await prismaClient.room.update({
                where:{
                    id:roomId
                },
                data:{
                    available:false,
                    players:{
                        connect:{
                            id:user.userId
                        }
                    }
                }
            })
            const roomName = room.name
            user.room = roomId;

            ws.send(JSON.stringify({
                type:"success",
                message:"Joined the room successfully",
                roomId,
                roomName
            }))
}