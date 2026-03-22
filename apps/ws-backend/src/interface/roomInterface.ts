
export interface CreateRoomPayload {
  roomName: string
}

export interface JoinRoomPayload {
  roomId: number
}

export interface MovePayload {
  roomId: number
  from: string
  to: string
  promotion?: "q" | "r" | "b" | "n"
}