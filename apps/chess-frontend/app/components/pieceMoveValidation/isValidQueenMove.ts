import { isValidRookMove } from "./isValidRookMove";
import { isValidBishopMove } from "./isValisBishopMove";
import { Square, Board } from "../game/game";

export function validateQueenMove(from: Square, to: Square,board:Board): boolean {
    return (
        isValidRookMove(from, to,board) ||
        isValidBishopMove(from, to,board)
    );
}