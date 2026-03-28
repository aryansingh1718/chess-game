import { Square,Board } from "../game/game";

export function isValidKnighMove(from: Square, to: Square,board:Board): boolean {
    const rowDiff = Math.abs(to.row - from.row);
    const colDiff = Math.abs(to.col - from.col);

    const isLShape = (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    if (!isLShape) return false;

    const target = board[to.row][to.col];
    if(!target) return true;

    if(target.color !== board[from.row][from.col]?.color) return true;
    return false;
}