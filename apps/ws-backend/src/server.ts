import { WebSocket } from "ws";
import { checkUser } from "./auth";
import { users } from "./userManager";
import {IncomingMessage} from "http";
import { prismaClient } from "@repo/db/client";

export default async function server(ws:WebSocket,request:IncomingMessage){       //authorize the user using jwt token

     const url = request.url;                                               //extracts url from request object
        if(!url) 
            return;
    
        const queryParams = new URLSearchParams(url.split("?")[1] || "");
        const token = queryParams.get("token") || "";                     //extracting token from the complete url
        const userId = checkUser(token);                                  //extracting the userId from the token using checkUser fn
    
        if(userId == null){                                               //if userId doesn't exist
            ws.send(JSON.stringify({
                type:"error",
                message:"No token was given"
            }));
            ws.close();
            return;
        }

        const userName = await prismaClient.user.findUnique({
            where:{
                id:userId
            }
        });
        if(!userName) return;
        
        const existingUser = users.find(x => x.userId === userId);  //check if the same user is already in the users array.If yes, then assign this new socket to it
        if(existingUser){
            existingUser.socket = ws;
            return userId;
        }

        users.push({                                                    //adding the user to users array
            userId,
            socket:ws,
            room:null,
            userName:userName?.username
        });
    
        ws.on("error",console.error);
        return userId;
}