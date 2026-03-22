import { prismaClient } from "@repo/db/client";
import { users } from "../userManager";
import WebSocket from "ws";
import { JoinRoomPayload } from "../interface/roomInterface";
import { gameStart } from "../gameStart";
import { games } from "../gameManager";

export default async function joinRoom(ws:WebSocket,parsedData:JoinRoomPayload){

    const user = users.find(x => x.socket === ws);
            if(!user) return;

            const userName = user.userName;

            if(user?.room !== null){                        //if the user trying to join is already in a room currently
                ws.send(JSON.stringify({
                    type:"join-room-error",
                    payload:{
                        message:"You cannot join another room while being in another room"
                    }
                }));
                return;
            }

            const roomId = parsedData.roomId;
            if(!roomId){                                    //if no roomId is provided
                ws.send(JSON.stringify({
                    type:"join-room-error",
                    payload:{
                        message:"Room Id is required"
                    }
                }));
                return;
            }

            const room = await prismaClient.room.findFirst({
                where:{                                    
                    id:roomId,
                    active:false
                },
                include:{
                    players:true
                }
            });

            if(!room){
                ws.send(JSON.stringify({                // if no active room with given id axists
                    type:"join-room-error",
                    payload:{
                        message:"Room with this Id doesn't exist"
                    }
                }));
                return;
            }

            if (user.leaveTimeout) {                    // if user was previously a part of this room and was trying to reconnect before timeout finishes
                clearTimeout(user.leaveTimeout);
                user.leaveTimeout = undefined;
            }

            const game = games.get(roomId);             // since the user has rejoin, so finding the game state from the games map.

            if (game) {                               
                ws.send(JSON.stringify({                //sending the user the current game state, so that its frontend can make a sync with it.
                    type: "game-state",
                    payload: {
                        fen: game.chess.fen(),
                        turn: game.chess.turn()
                    }
                }));
            }

                if(room.players.length === 2){            //if the game already has 2 players
                    ws.send(JSON.stringify({               
                        type:"join-room-error",
                        payload:{
                            message:"The room already has two players"
                        }
                    }));
                    return;
                }

                await prismaClient.room.update({          //add the user to the room and assign him black 
                    where:{
                        id:roomId
                    },
                    data:{
                        available:false,
                        active:true,
                        players:{
                            connect:{
                                id:user.userId
                            }
                        },
                        blackId:user.userId
                    }
                });

                const updatedRoom = await prismaClient.room.findUnique({
                    where:{ id: roomId },
                    include:{ players:true }
                });

                if(updatedRoom?.players.length === 2){    // doing a final check of 2 players and starting the game
                    gameStart(updatedRoom.id);
                }
                const opponent = updatedRoom?.players.find(x => x.id !== user.userId);
                const opponentUser = users.find(x => x.userId === opponent?.id);
                const opponentName = opponent?.username;

                 if(!opponentName){
                    return;
                 }                       // if opponent name exists, then send the opponent name to the user who just joined, so that it can be displayed in the frontend.

            if(!updatedRoom) return;
            const roomName = updatedRoom.name;
            user.room = roomId;

            ws.send(JSON.stringify({                    //sending success msg to the user
                type:"join-room-success",
                payload:{
                    message:"Joined the room successfully",
                    roomId,
                    roomName,
                    userName:userName,
                    opponentName:opponentName,
                    color:"b"
                }
            }));

            opponentUser?.socket.send(JSON.stringify({     //sending the msg to the opponent that a new user has joined
                type:"opponent-joined",
                payload:{
                    message:"Your opponent has joined the room",
                    opponentName:userName,
                    userName:opponentName
                }
            }));

}