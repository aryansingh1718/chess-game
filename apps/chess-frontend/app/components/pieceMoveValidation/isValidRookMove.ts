import { Square,Board } from "../game/game";

export function isValidRookMove(from:Square,to:Square,board:Board):boolean{
    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;

    if(rowDiff !== 0 && colDiff !==0) return false;

    const rowStep = rowDiff === 0 ? 0 : rowDiff > 0 ? 1 : -1;
    const colStep = colDiff === 0 ? 0 : colDiff > 0 ? 1 : -1;

    let r = from.row + rowStep;
    let c = from.col + colStep;

    while( r !== to.row || c !== to.col ){
        if(board[r][c]) return false;
        r += rowStep;
        c += colStep;
    }
    const target = board[to.row][to.col];
    if(!target) return true;

    if(target.color !== board[from.row][from.col]?.color) return true;
    return false;
}