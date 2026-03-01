import { prismaClient } from "@repo/db/client";
import { users } from "../userManager";
import {WebSocket} from "ws";
import { roomPayload } from "../interface/roomInterface";

export default async function createRoom(ws:WebSocket,parsedData:roomPayload){
    const user = users.find(x => x.socket === ws);

                if(!user) return;
                const userId = user?.userId;

                if(user?.room !== null){            //if user is already in a room
                    ws.send(JSON.stringify({
                        type:"error",
                        message:"You cannot create another room while being in another room"         
                    }));
                    return;
                }
    
                const roomName = parsedData.roomName;
                if(!roomName){                      //if user hasn't given the roomId
                    ws.send(JSON.stringify({
                        type:"error",
                        message:"Room ID is required"
                    }));
                    return;
                }
    
                const room = await prismaClient.room.findFirst({
                    where:{
                        name:roomName,
                        active:true
                    }
                });
                if(room){
                    ws.send(JSON.stringify({
                        type:"error",
                        message:"Room with this name already exists"
                    }));
                    return;
                }
                const newRoom = await prismaClient.room.create({
                    data:{
                        name:roomName,
                        active:true,
                        adminId:userId,
                        whiteId:userId,
                        players:{
                            connect:{
                                id:user.userId
                            }
                        }
                    }
                })
                const roomId = newRoom.id;
                user.room = roomId;
    
                ws.send(JSON.stringify({
                    type:"success",
                    message:"Created the game room. Enjoy!",
                    room:roomId,
                    name:roomName
                }));
}