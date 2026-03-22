import { prismaClient } from "@repo/db/client";
import { users } from "../userManager";
import {WebSocket} from "ws";
import { CreateRoomPayload } from "../interface/roomInterface";

export default async function createRoom(ws:WebSocket,parsedData:CreateRoomPayload){
    const user = users.find(x => x.socket === ws);

                if(!user) return;                   //if the user doesn't exist
                const userId = user.userId;
                const userName = user.userName;

                if(user?.room !== null){            //if user is already in a room
                    ws.send(JSON.stringify({
                        type:"create-room-error",
                        payload:{
                            message:"You cannot create another room while being in another room"         
                        }
                    }));
                    return;
                }
    
                const roomName = parsedData.roomName;
                if(!roomName){                      //if user hasn't given the roomId
                    ws.send(JSON.stringify({
                        type:"create-room-error",
                        payload:{
                            message:"Room ID is required"
                        }
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
                    ws.send(JSON.stringify({        //if an active room with the given name already exists.
                        type:"create-room-error",
                        payload:{
                            message:"Room with this name already exists"
                        }
                    }));
                    return;
                }
                const newRoom = await prismaClient.room.create({
                    data:{                          //create the room with given name
                        name:roomName,
                        active:false,
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
    
                ws.send(JSON.stringify({            //sending success message to the user socket
                    type:"create-room-success",
                    payload:{
                        message:"Created the game room. Enjoy!",
                        room:roomId,
                        name:roomName,
                        userName:userName,
                        color:"w"
                    }
                }));
}