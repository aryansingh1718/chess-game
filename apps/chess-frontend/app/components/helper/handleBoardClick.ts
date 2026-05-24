import { Dispatch,SetStateAction } from "react";
import { Game } from "../game/game";
import { getSquare } from "./getSquare";
import { Renderer } from "../game/renderer";

function toAlgebraic(square: { row: number; col: number }): string {
    const files = "abcdefgh";
    return files[square.col] + (8 - square.row);
}


export function handleBoardClick(x:number,y:number,playerColor:"w" | "b" | null,socket:WebSocket | null,selected:{row:number,col:number} | null,  setSelected: Dispatch<SetStateAction<{ row: number; col: number } | null>>,game:Game | null,renderer:Renderer | null){
        console.log("handleBoardClick called");
    console.log("selected before:", selected);
    if(!socket || !game) {
         console.log("socket:", socket);
console.log("game:", game);
         return
        };

    const square = getSquare(x,y,playerColor);
        console.log("clicked square:", square);
    if(!selected){
        console.log("first click -> selecting");
        setSelected(square);
        return;
    }
     console.log("second click -> attempting move");

    const move = {
        from:selected,
        to:square
    };

    const isValid = game.makeMove(move.from, move.to);
    console.log("isValid:", isValid);
    console.log("current turn:", game.getTurn());
    if(!isValid){
        setSelected(null);
        return;
    }

    if(isValid){
        renderer?.draw(game.getBoard(), playerColor);
        console.log("socket:", socket);
        console.log("socket readyState:", socket?.readyState);
        console.log("roomId from localStorage:", localStorage.getItem("roomId"));
        socket.send(JSON.stringify({
            type:"make-move",
            roomId: Number(localStorage.getItem("roomId")),
            from: toAlgebraic(move.from),
            to: toAlgebraic(move.to)
        }));
    }
    setSelected(null);
}