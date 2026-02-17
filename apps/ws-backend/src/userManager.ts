import WebSocket from "ws"
interface User {
    socket:WebSocket,
    room:number | null,
    userId:string
}

export const users:User[] = [];