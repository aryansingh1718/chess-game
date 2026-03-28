"use client";
import { useEffect, useRef, useState } from "react";
import { Game, Square } from "../components/game/game";
import { Renderer } from "../components/game/renderer";
import { handleWsMsg } from "../components/helper/handleWsMsg";
import { getSocket, initSocket } from "../components/helper/socket";
import { handleBoardClick } from "../components/helper/handleBoardClick";

export default function GameRoom() {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rendererRef = useRef<Renderer | null>(null);
    const gameRef = useRef<Game | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    const [playerColor, setPlayerColor] = useState<"w" | "b" | null>(null);
    const [whitePlayer, setWhitePlayer] = useState("");
    const [blackPlayer, setBlackPlayer] = useState("");
    const [selected,setSelected] = useState<{row:number,col:number} | null>(null);

    const bottomPlayer = playerColor === "w" ? whitePlayer : blackPlayer;
    const topPlayer = playerColor === "w" ? blackPlayer : whitePlayer;

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

    // Subscribe to WebSocket
    useEffect(() => {
        let ws = getSocket();
            console.log("GameRoom getSocket:", ws);
    console.log("readyState:", ws?.readyState);
           if (!ws) {
        const token = localStorage.getItem("token");

        if (!token) {
            console.log("token missing");
            return;
        }

        console.log("socket missing, initializing in GameRoom");
        ws = initSocket(token);
    }
    
        socketRef.current = ws;
            console.log("socket set:", ws);
        const handler = (event: MessageEvent) => {
            console.log("RAW WS event:", event.data);

            handleWsMsg(
                event,
                () => {}, // roomId
                () => {}, // roomName
                () => {}, // fen
                () => {}, // turn
                (lastMove) => {
                    console.log("WS lastMove received:", lastMove);

                    gameRef.current?.makeMove(lastMove.from, lastMove.to);

                    console.log("turn after sync:", gameRef.current?.getTurn());

                    rendererRef.current?.draw(
                        gameRef.current!.getBoard(),
                        playerColor!
                    );
                },
                () => {}, // promotion
                () => {}, // winner
                () => {}, // successMsg
                () => {}, // errorMsg
                setPlayerColor,
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
        if(!canvas) return;

        const handleClick = (e:MouseEvent) => {
            console.log("canvas clicked");
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            handleBoardClick(x,y,playerColor,socketRef.current,selected,setSelected,gameRef.current,rendererRef.current);
        };
        canvas.addEventListener("click",handleClick);
        console.log("listener attached");
        return () => {
            canvas.removeEventListener("click", handleClick);
        };
    },[playerColor,selected]);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="relative">

                {/* Top Player */}
                <div className="absolute -top-8 left-0 text-lg font-semibold">
                    {topPlayer}
                </div>

                {/* Canvas */}
                <canvas
                    ref={canvasRef}
                    width={700}
                    height={700}
                    
                />

                {/* Bottom Player */}
                <div className="absolute -bottom-8 right-0 text-lg font-semibold">
                    {bottomPlayer}
                </div>

            </div>
        </div>
    );
}