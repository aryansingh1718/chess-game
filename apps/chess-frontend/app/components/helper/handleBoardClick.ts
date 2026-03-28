import { Dispatch,SetStateAction } from "react";
import { Game } from "../game/game";
import { getSquare } from "./getSquare";
import { Renderer } from "../game/renderer";


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
    console.log("current turn:", game.getTurn());
    if(!isValid){
        setSelected(null);
        return;
    }

    if(isValid){
        renderer?.draw(game.getBoard(), playerColor);

        socket.send(JSON.stringify({type:"make-move",data:{
            roomId: localStorage.getItem("roomId"),
            from: move.from,
            to: move.to
        }}));
    }
    setSelected(null);
}