
const tileSize = 700/8;

export function getSquare(
    x: number,
    y: number,
    playerColor: "w" | "b" | null
) {
    const screenCol = Math.floor(x / tileSize);
    const screenRow = Math.floor(y / tileSize);

    if (playerColor === "w") {
        return {
            row: screenRow,
            col: screenCol
        };
    }

    return {
        row: 7 - screenRow,
        col: 7 - screenCol
    };
}