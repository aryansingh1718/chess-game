import WebSocket from "ws"
interface User {
    socket:WebSocket,
    room:number | null,
    userId:string,
    leaveTimeout?:NodeJS.Timeout
}

export const users:User[] = [];