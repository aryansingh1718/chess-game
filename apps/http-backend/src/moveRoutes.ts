import { prismaClient } from "@repo/db/client";
import { Router } from "express";
import { Request,Response } from "express";

const router:Router = Router();

router.get("/:slug",async(req:Request,res:Response) => {
    const roomId = Number(req.params.slug);
    if (isNaN(roomId)) {
    return res.status(400).json({
        error: "Invalid room id"
    });
    }

    if(!roomId){
        return res.status(400).json({
            error:"Please enter room for which you want the moves."
        });
    }

    const room = await prismaClient.room.findUnique({
        where:{
            id:roomId
        }
    });
    if(!room){
        return res.status(404).json({
            error:"This room does not exist"
        })
    }

    if (room.active == true) {
    return res.status(400).json({
        error: "Game not finished yet"
    });
    }

    const moves = await prismaClient.move.findMany({
        where:{
            roomId
        },
        orderBy:{
            id:"asc"
        }
    })
    res.json({
        moves
    })
});

export default router;