import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { NextFunction,Request,Response } from "express";

export function authMiddleware(req:Request,res:Response,next:NextFunction) {
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({
            error:"Token missing"
        });
    }

    try{
        const decoded = jwt.verify(token,JWT_SECRET)  as any;
        
        if(!decoded){
            return res.status(403).json({
                error:"Unauthorized"
            })
        }

        req.userId = decoded.userId;
        next();
    }catch(e){
        return res.status(401).json({
            error:"Invalid or expired token"
        })
    }
}