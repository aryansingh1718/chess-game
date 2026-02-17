import { WebSocketServer,WebSocket } from "ws";
import server from "./server";
import createRoom from "./messageType/createRoom";
import joinRoom from "./messageType/joinRoom";
import leaveRoom from "./messageType/leaveRoom";
import { gameStart } from "./messageType/gameStart";
const wss = new WebSocketServer({port:8080});

wss.on("connection",(ws:WebSocket,request) => {

    const userId = server(ws,request);

    ws.on("message", async (data) => {
        
        const parsedData = JSON.parse(data.toString());

        if(parsedData.type === "create-room"){
            createRoom(ws,parsedData);
        }

        if(parsedData.type === "join-room"){
            joinRoom(ws,parsedData);
        }

        if(parsedData.type === "leave-room"){
            leaveRoom(ws,parsedData);
        }

        if(parsedData.type === "game-start"){
            gameStart(ws,parsedData);
        }
    })
})