import { games } from "./gameManager";
import handleTimeout from "./handleTimeout";

export default async function startMoveTimer(roomId:number) {        //this fn puts a 90 second timer after every move made by either player. If they don't play any move in 90 sec, they lose
    
    const game = games.get(roomId);
    if(!game) return;

    if(game.moveTimeout)
        clearTimeout(game.moveTimeout);                             //clears old timeout after the user makes move

    game.moveTimeout = setTimeout(() => {                          //puts new timer of 90 sec after user makes the move
        handleTimeout(roomId)
    }, 90 * 1000);
}