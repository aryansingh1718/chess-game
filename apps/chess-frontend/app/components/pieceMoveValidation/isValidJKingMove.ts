import { Square,Board } from "../game/game";

export function isValidKingMove(from: Square, to: Square,board:Board): boolean {
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);

    if(rowDiff > 1 || colDiff > 1) return false;

    const target = board[to.row][to.col];
    if(!target) return true;

    if(target.color !== board[from.row][from.col]?.color) return true;
    return false;
}