import { WebSocketServer,WebSocket } from "ws";
import server from "./server";
import createRoom from "./messageType/createRoom";
import joinRoom from "./messageType/joinRoom";
import leaveRoom from "./messageType/leaveRoom";
import handleMakeMove from "./messageType/makeMove";
import { disconnectHandler } from "./disconnectHandler";

const wss = new WebSocketServer({port:8080});

wss.on("connection",(ws:WebSocket,request) => {

    const userId = server(ws,request);
    if(!userId) {
        return
    }

    ws.on("message", async (data) => {
        
        const parsedData = JSON.parse(data.toString());

        if(parsedData.type === "create-room"){
            await createRoom(ws,parsedData);
        }

        if(parsedData.type === "join-room"){
            await joinRoom(ws,parsedData);
        }

        if(parsedData.type === "leave-room"){
            await leaveRoom(ws);
        }

        if(parsedData.type === "make-move"){
            await handleMakeMove(ws,parsedData);
        }
    });

    ws.on("close", async(data) => {

        const parsedData = JSON.parse(data.toString());
        await disconnectHandler(ws,parsedData)
    })
})