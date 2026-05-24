import { createInitialBoard } from "../helper/createInitialBoard";
import { isValidKingMove } from "../pieceMoveValidation/isValidJKingMove";
import { isValidKnighMove } from "../pieceMoveValidation/isValidKnightMove";
import { isValidPawnMove } from "../pieceMoveValidation/isValidPawnMove";
import { validateQueenMove } from "../pieceMoveValidation/isValidQueenMove";
import { isValidRookMove } from "../pieceMoveValidation/isValidRookMove";
import { isValidBishopMove } from "../pieceMoveValidation/isValisBishopMove";

export type Piece = {
    type:"p" | "r" | "k" | "q" | "b" | "n";
    color:"w" | "b";
}

export type Square = {
    row:number;
    col:number;
}

export type Board = (Piece | null)[][];

export class Game {
    private board: Board;
    private turn: "w" | "b";

    constructor(){
        this.board = createInitialBoard();
        this.turn = "w";
    }

    getBoard():Board{
        return this.board;
    }

    getTurn(): "w" | "b" {
        return this.turn;
    }

    makeMove(from:Square, to:Square):boolean{
        const piece = this.board[from.row][from.col];
        if(!piece) return false;

        if(!this.isValidMove(piece, from, to)) return false;

        this.board[to.row][to.col] = piece;
        this.board[from.row][from.col] = null;
        this.turn = this.turn === "w" ? "b" : "w";
        return true;
    }

    isValidMove(piece:Piece, from:Square, to:Square):boolean{
        if(to.row < 0 || to.row > 7 || to.col < 0 || to.col > 7) return false;

        const targetPiece = this.board[to.row][to.col];
        if(targetPiece && targetPiece.color === piece.color) return false;  

        switch(piece.type){
            case "p":
                if(isValidPawnMove(from, to, piece,this.board))
                    return true;
                return false;
            case "r":
                if(isValidRookMove(from, to,this.board))
                    return true;
                return false;
            case "b":
                if(isValidBishopMove(from, to,this.board))
                    return true;
                return false;
            case "q":
                if(validateQueenMove(from, to,this.board))
                    return true;  
                return false; 
            case "n":
                if(isValidKnighMove(from, to,this.board))
                    return true;
                return false;
            case "k":
                if(isValidKingMove(from,to,this.board))
                    return true;
                return false;
            default:
                return false;
        }
    }
}