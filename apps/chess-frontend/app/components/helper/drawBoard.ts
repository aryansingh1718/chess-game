
export function drawBoard(ctx: CanvasRenderingContext2D, tileSize: number,playerColor:"w" | "b" | null){

    const isBlack = playerColor === "b";
        for(let i=0;i<8;i++){
            for(let j=0;j<8;j++){

                    const drawRow = isBlack ? 7 - i : i;
                    const drawCol = isBlack ? 7 - j : j;
                if((i+j)%2 === 0){
                    // light tile
                    ctx.fillStyle = "#f0d9b5";
                } else {
                    // dark tile
                    ctx.fillStyle = "#b58863";
                }
                ctx.fillRect(drawCol*tileSize, drawRow*tileSize, tileSize, tileSize);
            }
    }
}