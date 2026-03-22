import WebSocket from "ws"
interface User {
    socket:WebSocket,
    room:number | null,
    userId:string,
    userName:string,
    leaveTimeout?:NodeJS.Timeout
}

export const users:User[] = [];