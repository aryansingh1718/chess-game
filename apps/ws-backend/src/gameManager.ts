import { Chess } from "chess.js"

export const games = new Map<number,{
    chess:Chess,
    whiteId:string,
    blackId:string
}>();