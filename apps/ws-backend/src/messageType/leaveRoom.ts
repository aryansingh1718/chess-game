import { roomPayload } from "../interface/roomInterface";
import WebSocket from "ws";
import { users } from "../userManager";
import { prismaClient } from "@repo/db/client";

export default async function leaveRoom(ws: WebSocket) {
    const user = users.find(x => x.socket === ws);
    if (!user) return;

    if (!user.room) {
        ws.send(JSON.stringify({
            type: "error",
            message: "You are not in any room"
        }));
        return;
    }

    const roomId = user.room;

    // Start disconnect timer
    user.leaveTimeout = setTimeout(async () => {

        const room = await prismaClient.room.findUnique({
            where: { id: roomId },
            include: { players: true }
        });

        if (!room || !room.active) return;

        const opponent = room.players.find(x => x.id !== user.userId);
        const opponentUser = users.find(x => x.userId === opponent?.id);

        await prismaClient.room.update({
            where: { id: roomId },
            data: {
                active: false,
                winnerId: opponent?.id,
                players: {
                    disconnect: { id: user.userId }
                }
            }
        });

        // NOW remove from memory
        user.room = null;
        user.leaveTimeout = undefined;

        opponentUser?.socket.send(JSON.stringify({
            type: "game-over",
            message: "Opponent left the room",
            winner: opponent?.id
        }));

    }, 30000);
}