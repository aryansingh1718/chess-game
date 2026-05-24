"use client";
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useState , useEffect} from "react";

export default function ShowRoomInput({showJoinRoom,socket,successMsg,errorMsg,setSuccessMsg,setErrorMsg,roomId,setRoomId,playerColor,setPlayerColor,whitePlayer,blackPlayer}:{showJoinRoom:boolean,socket:React.RefObject<WebSocket | null>,successMsg:string | null,errorMsg:string | null,setSuccessMsg:(msg: string) => void,setErrorMsg:(msg: string) => void,roomId:string | null,setRoomId:(id: string) => void,playerColor:"w" | "b",setPlayerColor:(color: "w" | "b") => void,whitePlayer:string,blackPlayer:string}){

    const router = useRouter();
    const [sendRoomName,setSendRoomName] = useState("");
    const [sendRoomId,setSendRoomId] = useState("");
    const [action,setAction] = useState<"create" | "join" | null>(null);

    useEffect(() => {
        if(!errorMsg) return;

        const timer = setTimeout(() => {
            setErrorMsg("");
        }, 1500);

        return () => clearTimeout(timer);
    }, [errorMsg]);

    useEffect(() => {
        if(successMsg){
            const timer = setTimeout(() => {
                localStorage.setItem("playerColor", playerColor);
                localStorage.setItem("whitePlayer", whitePlayer);
                localStorage.setItem("blackPlayer", blackPlayer);
                if(roomId) localStorage.setItem("roomId", roomId);
                router.push("/gameRoom");
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [successMsg, playerColor]);

    useEffect(() => {
        if(roomId){
            if(action === "create"){
                console.log("Room created:", roomId);
            }
            else if(action === "join"){
                console.log("Joined room:", roomId);
            }
        }
    }, [roomId, action]);

    function createRoom(){
        setSuccessMsg("");
        setErrorMsg("");
        setAction("create");

        if(!socket.current || socket.current.readyState !== WebSocket.OPEN){
            setErrorMsg("Connection not ready yet");
            return;
        }
        socket.current.send(JSON.stringify({
            type:"create-room",
            roomName: sendRoomName
        }));
    }

    function joinRoom(){
        setSuccessMsg("");
        setErrorMsg("");  
        setAction("join"); 

        if(!socket.current || socket.current.readyState !== WebSocket.OPEN){
            setErrorMsg("Connection not ready yet");
            return;
        }
        socket.current.send(JSON.stringify({
            type:"join-room",
            roomId: Number(sendRoomId)
        }));
    }
        
    return <div className="w-screen h-screen bg-[#302e2b] flex flex-col gap-y-20 items-center pt-5">
        <Image src= "/logo2.png" alt="logo" width={300} height={300}></Image>
        <div className="bg-[#262421] flex flex-col gap-y-5 py-10 px-10">
            {!showJoinRoom ? <div className="flex flex-col gap-y-3">
                    <input type="text" placeholder="Enter game room name" value={sendRoomName} className="bg-[#373532] w-sm pl-9 pr-3 py-1 rounded-md text-[#9b9a98] font-normal border border-transparent hover:border-[#7f7e7c]" 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSendRoomName(e.target.value)}></input>
                    <button className="bg-[#70a94a] px-3 py-1 rounded-sm cursor-pointer hover:bg-[#7fb857]" onClick={createRoom}>Create Room</button>
                </div>:<div className="flex flex-col gap-y-3">
                    <input type="text" placeholder="Enter game room Id" value={sendRoomId} className="bg-[#373532] w-sm pl-9 pr-3 py-1 rounded-md text-[#9b9a98] font-normal border border-transparent hover:border-[#7f7e7c]" 
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSendRoomId(e.target.value)}></input>
                    <button className="bg-[#70a94a] px-3 py-1 rounded-sm cursor-pointer hover:bg-[#7fb857]" onClick={joinRoom}>Join Room</button>
                </div>}
                {successMsg && <div className="text-xs text-center">
                {successMsg}<br></br>
                room id: {roomId}
                </div>}
                {errorMsg && <div className="text-xs text-center">
                    {errorMsg}
                </div>}
        </div>
    </div>
}