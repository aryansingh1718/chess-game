import { authMiddleware } from "./authMiddleware";
import { Router } from "express";
import { gameRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import { Request,Response } from "express";

const router:Router = Router();

router.post("/create",authMiddleware,async(req:Request,res:Response) => {

    const adminId = req.userId;

    if(!adminId){
        return res.status(401).json({
            message:"Not authenticated"
        });
    }

    const parsedData = gameRoomSchema.safeParse(req.body);
    if(!parsedData.success){
        return res.status(411).json({
            error:"Enter valid room name"
        });
    }

    const {name} = parsedData.data;

    try{
        const roomExists = await prismaClient.room.findFirst({
        where:{
            name
        }
        })
        if(roomExists){
            return res.status(403).json({
                message:"Room with this name already exists!"
            });
        }

        const room = await prismaClient.room.create({
            data:{
                name,
                adminId
            }
        })
        if(!room){
            return res.status(500).json({
                error:"Room cannot be created!"
            })
        }
        res.json({
            message:room
        })
    }catch(e){
        return res.status(500).json({
            error:"Internal server error"
        });
    }
});

router.get("/:slug",async (req:Request,res:Response) => {
    const id = Number(req.params.slug);
    if (isNaN(id)) {
        return res.status(400).json({
            error: "Invalid room id"
        });
    }

    const room = await prismaClient.room.findUnique({
        where:{
            id
        }
    });
    if(!room){
        res.status(404).json({
            error:"Room not found!"
        })
    }
    res.json({
        room
    })
})

export default router;