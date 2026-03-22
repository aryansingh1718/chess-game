import { drawBoard } from "../helper/drawBoard";
import { drawPieces } from "../helper/drawPieces";
import { Board } from "./game";
import { loadImages } from "../helper/loadImages";

export class Renderer {
    private ctx: CanvasRenderingContext2D;
    private tileSize: number;
    private images: Record<string, HTMLImageElement> = {};

    constructor(ctx: CanvasRenderingContext2D){
        this.ctx = ctx;
        this.tileSize = ctx.canvas.width / 8; 
    }

    draw(board:Board, playerColor: "w" | "b" | null){
        drawBoard(this.ctx, this.tileSize,playerColor);
        drawPieces(board, this.ctx, this.tileSize,this.images,playerColor);
    }

    async init() {
        await loadImages(this.images);
    }
}