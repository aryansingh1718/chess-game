import Jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export function checkUser(token:string){                    //a function that verifies jwt token and extracts userId from it and returns it
    try{
        const decoded = Jwt.verify(token,JWT_SECRET);

        if(typeof decoded === "string")
            return null;
    
        if(!decoded || !decoded.userId)
            return null;

        return decoded.userId;
    }catch(e){
        return null;
    }   
}