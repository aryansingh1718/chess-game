import { Square, Piece ,Board} from "../game/game";

export function isValidPawnMove(from:Square,to:Square,piece:Piece,board:Board):boolean{

    const dir = piece.color === "w" ? -1 : 1;
    const startRow = piece.color === "w" ? 6 : 1;
    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;

    const target = board[to.row][to.col];

    if(colDiff === 0 && rowDiff === dir && !target){
        return true;
    }
    
    if(colDiff === 0 && rowDiff === 2 * dir && from.row === startRow){
        const intermediateRow = from.row + dir;
        if(!board[intermediateRow][from.col] && !target){
            return true;
        }
    }

    if(Math.abs(colDiff) === 1 && rowDiff === dir){
        if(target && target.color !== piece.color){
            return true;
        }
    }

    return false;
}