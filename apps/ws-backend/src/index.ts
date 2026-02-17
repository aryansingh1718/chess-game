import { WebSocketServer,WebSocket } from "ws";
import server from "./server";
import createRoom from "./messageType/createRoom";
import joinRoom from "./messageType/joinRoom";
const wss = new WebSocketServer({port:8080});

wss.on("connection",(ws:WebSocket,request) => {
   
    const userId = server(ws,request);

    ws.on("message", async (data) => {
        
        const parsedData = JSON.parse(data.toString());

        if(parsedData.type === "create-room"){
            createRoom(ws,parsedData,userId);
        }

        if(parsedData.type === "join-room"){
            joinRoom(ws,parsedData);
        }
    })
})