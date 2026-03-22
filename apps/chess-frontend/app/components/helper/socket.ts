import { WS_URL } from "@/config";

let socket: WebSocket | null = null;

export function initSocket(token: string) {
    if (!socket) {
        socket = new WebSocket(`${WS_URL}?token=${token}`);
    }
    return socket;
}

export function getSocket() {
    return socket;
}