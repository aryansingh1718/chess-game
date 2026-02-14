import {prismaClient} from "@repo/db/client";
import {JWT_SECRET} from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { Router } from "express";
import { Request,Response } from "express";
import {userSignupSchema,userSigninSchema} from "@repo/common/types";
import { authMiddleware } from "./authMiddleware";

const router:Router = Router();

router.post("/signup",async (req:Request,res:Response) => {
    const parsedData = userSignupSchema.safeParse(req.body);
    if(!parsedData.success){
        return res.status(411).json({
            error:"Enter correct inputs!"
        })
    }

    const {name,username,password} = parsedData.data;

    try{
        const existingUser =await prismaClient.user.findUnique({
            where:{
                username
            }
        });

        if(existingUser){
            return res.status(411).json({
                message:"User with this username already exists!"
            })
        }
        
        const user = await prismaClient.user.create({
            data:{
                name,
                username,
                password
            }
        });
        const token = jwt.sign({
            userId: user.id
        },JWT_SECRET)

        res.json({
            message:"User created with the given username!",
            user,
            token
        })
        
    }catch(e){
        res.status(500).json({
            error:"Internal server error"
        })
    }
});

router.post("/signin",async (req:Request,res:Response) => {
    const parsedData = userSigninSchema.safeParse(req.body);
    if(!parsedData.success){
        return res.status(411).json({
            error:"Enter correct inputs!"
        });
    }

    const {username,password} = parsedData.data;

    try{
        const userExists = await prismaClient.user.findFirst({
            where:{
                username
            }
        })

        if(!userExists){
            return res.status(411).json({
                message:"This username doesn't exist!"
            })
        }

        const user = userExists;
        const token = jwt.sign({
            userId:user.id
        },JWT_SECRET);

        res.json({
            message:"User signed in",
            user,
            token
        })

    }catch(e){
        res.status(500).json({
            error:"Internal server error!"
        })
    }
});

router.get("/:slug",authMiddleware,async(req:Request,res:Response) => {
    const id = String(req.params.slug);
    if(!id){
        return res.status(403).json({
            error:"Enter valid User Name"
        })
    }

    const user = await prismaClient.user.findUnique({
        where:{
            id
        }
    });
    if(!user){
        return res.status(404).json({
            error:"No such user exists."
        });
    }

    res.json({
        user
    })
    
});

export default router;