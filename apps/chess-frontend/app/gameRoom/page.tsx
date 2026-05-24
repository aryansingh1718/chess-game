"use client";
import { useEffect, useRef, useState } from "react";
import { Game } from "../components/game/game";
import { Renderer } from "../components/game/renderer";
import { handleWsMsg } from "../components/helper/handleWsMsg";
import { getSocket, initSocket } from "../components/helper/socket";
import { handleBoardClick } from "../components/helper/handleBoardClick";

function fromAlgebraic(sq: string): { row: number; col: number } {
    const files = "abcdefgh";
    return {
        col: files.indexOf(sq[0]),
        row: 8 - parseInt(sq[1])
    };
}

export default function GameRoom() {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rendererRef = useRef<Renderer | null>(null);
    const gameRef = useRef<Game | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const playerColorRef = useRef<"w" | "b" | null>(null);

    const [playerColor, setPlayerColor] = useState<"w" | "b" | null>(null);
    const [whitePlayer, setWhitePlayer] = useState("");
    const [blackPlayer, setBlackPlayer] = useState("");
    const [selected, setSelected] = useState<{row:number,col:number} | null>(null);

    const bottomPlayer = playerColor === "w" ? whitePlayer : blackPlayer;
    const topPlayer = playerColor === "w" ? blackPlayer : whitePlayer;

    useEffect(() => {
        playerColorRef.current = playerColor;
    }, [playerColor]);

    useEffect(() => {
        const color = localStorage.getItem("playerColor") as "w" | "b";
        if (color) setPlayerColor(color);

        const white = localStorage.getItem("whitePlayer");
        const black = localStorage.getItem("blackPlayer");

        if (white) setWhitePlayer(white);
        if (black) setBlackPlayer(black);
    }, []);

    useEffect(() => {
        gameRef.current = new Game();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        let ws = getSocket();
        if (!ws || ws.readyState === WebSocket.CLOSED) {
            ws = initSocket(token);
        }

        socketRef.current = ws;

        const handler = (event: MessageEvent) => {
            handleWsMsg(
                event,
                () => {},
                () => {},
                () => {},
                () => {},
                (lastMove) => {
                    gameRef.current?.makeMove(
                        fromAlgebraic(lastMove.from),
                        fromAlgebraic(lastMove.to)
                    );
                    rendererRef.current?.draw(
                        gameRef.current!.getBoard(),
                        playerColorRef.current!
                    );
                },
                () => {},
                () => {},
                () => {},
                () => {},
                (color) => {
                    setPlayerColor(color);
                    playerColorRef.current = color;
                },
                (name) => {
                    setWhitePlayer(name);
                    localStorage.setItem("whitePlayer", name);
                },
                (name) => {
                    setBlackPlayer(name);
                    localStorage.setItem("blackPlayer", name);
                }
            );
        };

        ws.addEventListener("message", handler);
        return () => {
            ws.removeEventListener("message", handler);
        };
    }, []);

    useEffect(() => {
        if (!playerColor) return;
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx || !gameRef.current) return;

        rendererRef.current = new Renderer(ctx);

        (async () => {
            await rendererRef.current!.init();
            rendererRef.current!.draw(gameRef.current!.getBoard(), playerColor);
        })();
    }, [playerColor]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleClick = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            handleBoardClick(x, y, playerColor, socketRef.current, selected, setSelected, gameRef.current, rendererRef.current);
        };

        canvas.addEventListener("click", handleClick);
        return () => {
            canvas.removeEventListener("click", handleClick);
        };
    }, [playerColor, selected]);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="relative">
                <div className="absolute -top-8 left-0 text-lg font-semibold">
                    {topPlayer}
                </div>
                <canvas
                    ref={canvasRef}
                    width={700}
                    height={700}
                />
                <div className="absolute -bottom-8 right-0 text-lg font-semibold">
                    {bottomPlayer}
                </div>
            </div>
        </div>
    );
}