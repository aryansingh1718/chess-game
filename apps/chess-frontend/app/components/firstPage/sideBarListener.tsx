"use client"
import { useEffect, useState } from "react"
import Sidebar from "../sidebar";
import { useMediaQuery } from "../screenSize";

interface showProps {
    showSignup:boolean;
    showSignin:boolean;
    showJoinRoom:boolean;
    setShowJoinRoom: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SidebarListener({showSignup,showSignin,showJoinRoom,setShowJoinRoom}:showProps){

    const [sidebarOpen,setSidebarOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width:768px)");
    useEffect(() => {
        if(!isDesktop)
            setSidebarOpen(false);
        else
            setSidebarOpen(true);
    },[isDesktop])
    return <Sidebar sidebarOpen = {sidebarOpen} setSidebarOpen={setSidebarOpen} showSignup = {showSignup} showSignin = {showSignin} showJoinRoom={showJoinRoom} setShowJoinRoom={setShowJoinRoom}></Sidebar>
}