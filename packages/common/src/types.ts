import {z} from "zod";

export const userSignupSchema = z.object({
    name:z.string().min(1,"Name cannot be empty!"),
    username: z.string().email("Invalid email address"),
    password: z.string().min(1,"password cannot be empty!")
})

export const userSigninSchema = z.object({
    username: z.string().email("Invalid email address"),
    password:z.string().min(1,"password cannot be empty!")
})

export const gameRoomSchema = z.object({
    name:z.string().min(1,"Name cannot be empty!"),
})