import { WebSocketServer,WebSocket } from "ws";
import server from "./server";
import createRoom from "./messageType/createRoom";
import joinRoom from "./messageType/joinRoom";
import leaveRoom from "./messageType/leaveRoom";
import handleMakeMove from "./messageType/makeMove";
import { disconnectHandler } from "./disconnectHandler";
import http from "http";

const PORT = Number(process.env.PORT) || 8080;
const httpServer = http.createServer((req, res) => {
    res.writeHead(200);
        res.end("OK");
    });

const wss = new WebSocketServer({ server: httpServer });          //declaring a new ws server
httpServer.listen(PORT, "0.0.0.0", () => console.log(`Listening on ${PORT}`));

wss.on("connection",(ws:WebSocket,request) => {

    const userId = server(ws,request);                  //getting userId from server
    if(!userId) {
        return
    }

    ws.on("message", async (data) => {          //message handler
        
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

    ws.on("close", async() => {             //disconnect handler
        await disconnectHandler(ws);
    })
})

process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});