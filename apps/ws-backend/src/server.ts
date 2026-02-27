import { WebSocket } from "ws";
import { checkUser } from "./auth";
import { users } from "./userManager";
import {IncomingMessage} from "http";

export default function server(ws:WebSocket,request:IncomingMessage){
     const url = request.url;
        if(!url) 
            return;
    
        const queryParams = new URLSearchParams(url.split("?")[1] || "");
        const token = queryParams.get("token") || "";
        const userId = checkUser(token);
    
        if(userId == null){
            ws.send(JSON.stringify({
                type:"error",
                message:"No token was given"
            }));
            ws.close();
            return;
        }
        
        const existingUser = users.find(x => x.userId === userId);
        if(existingUser){
            existingUser.socket = ws;
            return userId;
        }
        
        users.push({
            userId,
            socket:ws,
            room:null
        });
    
        ws.on("error",console.error);
    
        ws.on("close", async() => {
            const index = users.findIndex(x => x.socket === ws);
            if(index !== -1){
                users.splice(index,1);
            }
        });
        return userId;
}