"use client";
import { sidebarProps } from "./sidebar";
import SidebarOpen from "./icons/sidebarOpen";
import SidebarClose from "./icons/sidebarClose";
import Link from "next/link";
import Image from "next/image";
import { logout } from "./helper/logout";
import { useRouter } from "next/navigation";

export default function Topbar({sidebarOpen,setSidebarOpen, showSignin, showSignup, showJoinRoom,setShowJoinRoom}:sidebarProps){
    const router = useRouter();
    return <div>
        <div className="fixed top-0 py-3 left-0 w-full flex justify-between items-center z-50 bg-[#262522]">    
                    {!sidebarOpen ? <div className = "cursor-pointer ml-4 flex gap-x-5" onClick={() => {
                        setSidebarOpen(!sidebarOpen);
                    }}>
                        <SidebarOpen></SidebarOpen>
                        <Image src= "/logo.png" alt="logo" width={100} height={50}></Image>
                    </div> : <div className = "cursor-pointer ml-4 flex gap-x-5" onClick={() => {
                        setSidebarOpen(!sidebarOpen);
                    }}>
                        <SidebarClose></SidebarClose>
                        <Image src= "/logo.png" alt="logo" width={100} height={50}></Image>
                        </div>}
                    <div className="flex gap-x-3 mr-3">
                        {showSignup ?<Link href= "/signup" className="bg-[#70a94a] px-3 py-1 rounded-sm cursor-pointer hover:bg-[#7fb857] shadow-lg shadow-black/30">Sign Up</Link> :<button className="bg-[#70a94a] px-3 py-1 rounded-sm cursor-pointer hover:bg-[#7fb857] shadow-lg shadow-black/30" onClick={() => {
                            setShowJoinRoom(!showJoinRoom);
                            console.log(showJoinRoom);
                        }}>{showJoinRoom ? "Create Room" : "Join Room"}</button>}
                        {showSignin ? <Link href = "/signin" className="bg-[#373634] px-3 py-1 rounded-sm cursor-pointer hover:bg-[#444341] shadow-lg shadow-black/40">Log In</Link> : <button className="bg-[#373634] px-3 py-1 rounded-sm cursor-pointer hover:bg-[#444341] shadow-lg shadow-black/40" 
                        onClick={() => logout(router)}>Log Out</button>}   
                    </div>
            </div>
    </div>
}