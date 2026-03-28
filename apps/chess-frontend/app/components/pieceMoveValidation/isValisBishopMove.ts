import { Square,Board } from "../game/game";

export function isValidBishopMove(from:Square,to:Square,board:Board):boolean{
    
    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;
    if(Math.abs(rowDiff) !== Math.abs(colDiff)) return false;

    const rowStep = rowDiff > 0 ? 1 : -1;
    const colStep = colDiff > 0 ? 1 : -1;

    let r = from.row + rowStep;
    let c = from.col + colStep;

    while(r !== to.row && c !== to.col){
        if(board[r][c]) return false;
        r += rowStep;
        c += colStep;
    }

    const target = board[to.row][to.col];
    if(!target) return true;

    if(target.color !== board[from.row][from.col]?.color) return true;
    return false;
}