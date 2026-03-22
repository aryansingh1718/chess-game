import React from "react";
import Topbar from "./topbar";
import Link from "next/link";

export interface sidebarProps {
    sidebarOpen:boolean;
    setSidebarOpen:React.Dispatch<React.SetStateAction<boolean>>
    showSignup:boolean;
    showSignin:boolean;
    showJoinRoom:boolean;
    setShowJoinRoom: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({sidebarOpen,setSidebarOpen,showSignup,showSignin,showJoinRoom,setShowJoinRoom}:sidebarProps){

    if(!sidebarOpen){
        return <div>
            <Topbar sidebarOpen = {sidebarOpen} setSidebarOpen={setSidebarOpen} showSignin = {showSignin} showSignup = {showSignup} showJoinRoom = {showJoinRoom} setShowJoinRoom={setShowJoinRoom}></Topbar>
        </div>
    }
    
    else{
        return <div>
            <Topbar sidebarOpen = {sidebarOpen} setSidebarOpen={setSidebarOpen} showSignin = {showSignin} showSignup = {showSignup} showJoinRoom = {showJoinRoom} setShowJoinRoom={setShowJoinRoom}></Topbar>
            <div className="fixed w-40 h-[calc(100vh-40px)] top-10 left-0 z-50 bg-[#262522] shadow-lg flex flex-col justify-between text-[#d3d3d2] items-center pt-8">
                <div>
                    <h1 className="px-10 py-3 cursor-pointer hover:bg-gray-900 hover:rounded-3xl">Play</h1>
                    <h1 className="px-10 py-3 cursor-pointer hover:bg-gray-900 hover:rounded-3xl">Puzzles</h1>
                    <h1 className="px-10 py-3 cursor-pointer hover:bg-gray-900 hover:rounded-3xl">Learn</h1>
                    <h1 className="px-10 py-3 cursor-pointer hover:bg-gray-900 hover:rounded-3xl">Train</h1>
                    <h1 className="px-10 py-3 cursor-pointer hover:bg-gray-900 hover:rounded-3xl">Watch</h1>
                    <h1 className="px-10 py-3 cursor-pointer hover:bg-gray-900 hover:rounded-3xl">Community</h1>
                    <h1 className="px-10 py-3 cursor-pointer hover:bg-gray-900 hover:rounded-3xl">Others</h1>
                </div>
                <div className="flex flex-col mb-10 gap-y-4 font-semibold max-w-36">
                    <div className="relative">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                            />
                        </svg>

                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full pl-9 pr-3 py-1 rounded-md hover:bg-[#373634] text-white outline-none"
                        />
                    </div>
                    {showSignup ? <Link href = "/signup" className="bg-[#70a94a] px-10 py-2 rounded-md cursor-pointer hover:bg-[#7fb857] shadow-lg shadow-black/30">Sign Up</Link> : null}
                    {showSignin ? <Link href = "/signin" className="bg-[#373634] px-10 py-2 rounded-md cursor-pointer hover:bg-[#444341] shadow-lg shadow-black/40">Log In</Link> : null}
                </div>
            </div>
        </div>
    }
}