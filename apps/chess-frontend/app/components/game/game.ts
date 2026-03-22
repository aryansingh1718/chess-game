import { createInitialBoard } from "../helper/createInitialBoard";

export type Piece = {
    type:"p" | "r" | "k" | "q" | "b" | "n";
    color:"w" | "b";
}

export type Board = (Piece | null)[][];

export class Game {
    private board: Board;

    constructor(){
        this.board = createInitialBoard();
    }

    getBoard():Board{
        return this.board;
    }
}