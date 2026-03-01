export interface roomPayload {
    roomName:string,
    roomId:number,
    from?:string,
    to?: string,
    promotion?: "q" | "r" | "b" | "n"
}