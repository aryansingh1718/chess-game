import WebSocket from "ws";
import { users } from "../userManager";
import { prismaClient } from "@repo/db/client";

export default async function leaveRoom(ws: WebSocket) {
    const user = users.find(x => x.socket === ws);
    if (!user) return;

    if (!user.room) {                                   //if user is not a part of any room
        ws.send(JSON.stringify({
            type: "leave-room-error",
            payload:{
                message: "You are not in any room"
            }
        }));
        return;
    }

    const roomId = user.room;

    // Start disconnect timer
    user.leaveTimeout = setTimeout(async () => {          // setting a timer so that if the user tries to rejoin the room before 30 sec, it can do it.

        const room = await prismaClient.room.findUnique({
            where: { id: roomId },
            include: { players: true }
        });

        if (!room || !room.active) return;

        const opponent = room.players.find(x => x.id !== user.userId);
        const opponentUser = users.find(x => x.userId === opponent?.id);      //finding the opponent id to declare him winner

        await prismaClient.room.update({                   //declaring the opponent as winner
            where: { id: roomId },
            data: {
                active: false,
                available:false,
                winnerId: opponent?.id,
                players: {
                    disconnect: { id: user.userId }
                }
            }
        });

        user.room = null;                               // NOW remove from memory
        user.leaveTimeout = undefined;

        opponentUser?.socket.send(JSON.stringify({      //sending the success msg to the room
            type: "game-over",
            payload:{
                message: "Opponent left the room",
                winner: opponent?.username
            }
        }));

    }, 30000);
}