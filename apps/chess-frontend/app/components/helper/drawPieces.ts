import { Board } from "../game/game";

export function drawPieces(board:Board, ctx:CanvasRenderingContext2D, tileSize:number,images:Record<string,HTMLImageElement>,playerColor:"w" | "b" | null){

    const isBlack = playerColor === "b";
    
    for(let i = 0;i<8;i++){
        for(let j=0;j<8;j++){
            const piece = board[i][j];
            if(!piece) continue;

            const drawRow = isBlack ? 7 - i : i;
            const drawCol = isBlack ? 7 - j : j;

            const key = `${piece.color}${piece.type}`
            const img = images[key];
            if(!img) continue;

            const x = drawCol * tileSize;
            const y = drawRow * tileSize;

            ctx.drawImage(img,x,y,tileSize,tileSize);
        }
    }
}