"use client";
import { useEffect, useRef, useState } from "react";
import { Game } from "../components/game/game";
import { Renderer } from "../components/game/renderer";
import { handleWsMsg } from "../components/helper/handleWsMsg";
import { getSocket } from "../components/helper/socket";

export default function GameRoom(){

    const canvasRef = useRef<HTMLCanvasElement | null>(null);   
    const rendererRef = useRef<Renderer | null>(null);
    const gameRef = useRef<Game | null>(null);
    const [playerColor, setPlayerColor] = useState<"w" | "b" | null>(null);
    const [whitePlayer,setWhitePlayer] = useState("");
    const [blackPlayer,setBlackPlayer] = useState("");
    const bottomPlayer = playerColor === "w" ? whitePlayer : blackPlayer;
    const topPlayer = playerColor === "w" ? blackPlayer : whitePlayer;

    useEffect(() => {
        const color = localStorage.getItem("playerColor") as "w" | "b";
        if (color) setPlayerColor(color);
        const whitePlayer = localStorage.getItem("whitePlayer");
        const blackPlayer = localStorage.getItem("blackPlayer");
        if (whitePlayer) setWhitePlayer(whitePlayer);
        if (blackPlayer) setBlackPlayer(blackPlayer);
    }, []);

        useEffect(() => {
        gameRef.current = new Game();
    }, []);

    //Subscribe to WebSocket
    useEffect(() => {
        const ws = getSocket();
        if (!ws) return;

        const handler = (event: MessageEvent) => {
            console.log("GameRoom WS:", event.data); 
            handleWsMsg(
                event,
                () => {}, // roomId (not needed here)
                () => {}, // roomName
                () => {}, // fen
                () => {}, // turn
                () => {}, // lastMove
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
        gameRef.current = new Game();
    },[])
    
    useEffect(() => {
        if(!playerColor) return;
        if(!canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        if(!ctx || !gameRef.current) return;
        rendererRef.current = new Renderer(ctx);
        if(!rendererRef.current) return;
        (async () => {
            await rendererRef.current.init();   // wait for images
            rendererRef.current.draw(gameRef.current.getBoard(),playerColor); // now draw
        })();
    }, [playerColor]);

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