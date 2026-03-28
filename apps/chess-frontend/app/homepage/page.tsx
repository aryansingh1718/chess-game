"use client"
import { useEffect, useRef, useState } from "react"
import SidebarListener from "../components/firstPage/sideBarListener";
import { handleWsMsg } from "../components/helper/handleWsMsg";
import ShowRoomInput from "./showRoomInput";
import { initSocket } from "../components/helper/socket";
import { Square } from "../components/game/game";

export default function HomePage(){

    const socketRef = useRef<WebSocket | null>(null);
    const [connected,setConnected] = useState(false);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [roomName, setRoomName] = useState("");
    const [fen, setFen] = useState("");
    const [turn, setTurn] = useState<"w" | "b" | null>(null);
    const [lastMove, setLastMove] = useState<{from:Square,to:Square} | null>(null);
    const [promotion, setPromotion] = useState<{from:string,to:string} | null>(null);
    const [winner, setWinner] = useState<string | null>(null);
    const [successMsg, setsuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [showJoinRoom, setShowJoinRoom] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [playerColor, setPlayerColor] = useState<"w" | "b">("w");
    const [whitePlayer,setWhitePlayer] = useState("");
    const [blackPlayer,setBlackPlayer] = useState("");

    useEffect(() => {
        const t = localStorage.getItem("token");
        setToken(t);
    }, []);

    useEffect(() => {
        if(!token) return;

        const ws = initSocket(token);
        socketRef.current = ws;

        ws.onopen = () => {
            console.log("websocket connected");
            console.log("HomePage socket created:", ws);
console.log("socket readyState:", ws.readyState);
            setConnected(true);
        }

        ws.onclose = () => {
            console.log("websocket closed");
            socketRef.current = null;
            setConnected(false);
        }

        ws.onerror = (e) => {
            console.log("websocket error", e)
        }

        ws.onmessage = (event) => {
            handleWsMsg(
                event,
                setRoomId,
                setRoomName,
                setFen,
                setTurn,
                setLastMove,
                setPromotion,
                setWinner,
                setsuccessMsg,
                setErrorMsg,
                setPlayerColor,
                setWhitePlayer,
                setBlackPlayer
            )
        }
    },[token])

    if(!connected){
        return <div>
            connecting to server....
        </div>
    }

    return <div className="min-h-screen bg-[#302e2b] flex">
        <SidebarListener showSignin = {false} showSignup = {false} showJoinRoom={showJoinRoom} setShowJoinRoom={setShowJoinRoom}></SidebarListener>
        <div className=" mt-10 flex">
            <ShowRoomInput showJoinRoom={showJoinRoom} socket={socketRef} successMsg={successMsg} errorMsg={errorMsg} setSuccessMsg={setsuccessMsg} setErrorMsg={setErrorMsg} roomId = {roomId} setRoomId = {setRoomId} playerColor={playerColor} setPlayerColor={setPlayerColor} whitePlayer={whitePlayer} blackPlayer={blackPlayer}></ShowRoomInput>  
        </div>
    </div>
}