import gameEnd from "./gameEnd";
import { games } from "./gameManager";

export default async function handleTimeout(roomId:number) {        // fn to end the game when user doesn't play any move in 90 sec
    
    const game= games.get(roomId);
    if(!game) return;

    const winnerId = game.chess.turn() === "w" ? game.blackId : game.whiteId;

    gameEnd({
        roomId,
        winnerId,
        reason:"timeout"
    })
}