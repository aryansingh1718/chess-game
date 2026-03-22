"use client"
import { useState } from "react"
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { Eye,EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Auth({isSignin}:{isSignin:boolean} ){

    const router = useRouter();
    const [name,setName] = useState("");
    const [password,setPassword] = useState("");
    const [username,setUsername] = useState("");
    const [successMsg,setSuccessMsg] = useState("");
    const [errorMsg,setErrorMsg] = useState("");
    const [showPassword,setShowPassword] = useState(false);

    useEffect(() => {
        if(!errorMsg) return;

        const timer = setTimeout(() => {
            setErrorMsg("");
        }, 1500);

        return () => clearTimeout(timer);
    }, [errorMsg]);

    async function signin() { 

        setSuccessMsg("");
        setErrorMsg("");
        if(!username || !password){
            setErrorMsg("You cannot leave any field empty");
            return;
        }

        try{
            const res = await axios.post(`${HTTP_BACKEND}/auth/signin`,{
                    username,
                    password
                },{
                    headers:{
                        "Content-Type":"application/json"
                    }
                }
            );

            localStorage.setItem("token",res.data.token);
            setSuccessMsg("Login successful");
            setTimeout(() => {
                router.push("/homepage");                
            }, 1500);
            console.log("jwt stored:",res.data.token);
        }catch(e){
            let message = "Something went wrong";

            if(axios.isAxiosError(e)){
                message = e.response?.data.message || message;
            }
            setErrorMsg(message);
        }
    }

    async function signup() {
        setSuccessMsg("");
        setErrorMsg("");
        if(!name || !username || !password){
            setErrorMsg("You cannot leave any field empty");
            return;
        }

        try{
            const res = await axios.post(`${HTTP_BACKEND}/auth/signup`,{
                username,
                name,
                password
            },{
                headers:{
                    "Content-Type":"application/json"
                }
            });
            localStorage.setItem("token",res.data.token);
            console.log("jwt stored:",res.data.token);
            setSuccessMsg("Signup successful");
            setTimeout(() => {
                router.push("/homepage");                
            }, 1500);
        }catch(e){
            let message = "Something went wrong";

            if(axios.isAxiosError(e)){
                message = e.response?.data.message || message;
            }
            setErrorMsg(message);
            console.log(message);
        }
    }
    return <div className="w-screen h-screen bg-[#302e2b] flex flex-col gap-y-20 items-center pt-5">
        <Image src= "/logo2.png" alt="logo" width={300} height={300}></Image>
         <div className="bg-[#262421] flex flex-col gap-y-5 py-10 px-10">
            {!isSignin ? <div className="relative bg-[#373532]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 fill-[#9b9a98]">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                </svg>
                <input type="text" placeholder="Enter your name" value={name} className="w-sm pl-9 pr-3 py-1 rounded-md text-[#9b9a98] font-normal border border-transparent hover:border-[#7f7e7c]" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}></input>
            </div>:null}
            <div className="relative bg-[#373532]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 fill-[#9b9a98]">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                </svg>
                <input type="text" placeholder="Username or Email" value={username} className="w-sm pl-9 pr-3 py-1 rounded-md text-[#9b9a98] font-normal border border-transparent hover:border-[#7f7e7c]" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}></input>
            </div>
            <div className="relative bg-[#373532]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 fill-[#9b9a98]">
                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                </svg>
                <input type = {showPassword ? "text" : "password"} placeholder="Password" className="w-full pl-9 pr-3 py-1 rounded-md text-[#9b9a98] font-normal border border-transparent hover:border-[#7f7e7c]" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}></input>
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 fill-[#9b9a98] cursor-pointer">
                    {showPassword ? <EyeOff size={18} stroke="#9b9a98" /> : <Eye size={18} stroke="#9b9a98"/>}
                </button>
            </div>
            <div className="flex text-[#9b9a98] items-center justify-between">
                <div className="flex items-center gap-x-2 cursor-pointer">
                    <input type="checkbox" className="w-3 h-3 accent-[#737270] bg-[#373532] border-gray-600"></input>
                    <h1 className="text-sm">Remember me</h1>
                </div>
                <h1 className="underline text-xs cursor-pointer hover:text-[#7f7e7c]">Forgot Password?</h1>
            </div>
            {isSignin ? <button className="bg-[#70a94a] px-3 py-1 rounded-sm cursor-pointer hover:bg-[#7fb857]" onClick={signin}>Log In
            </button>:<button className="bg-[#70a94a] px-3 py-1 rounded-sm cursor-pointer hover:bg-[#7fb857]" onClick={signup}>Create Account</button>
            }
            
            {successMsg && <div className="text-xs text-center">
                {successMsg}
                </div>}
            {errorMsg && <div className="text-xs text-center">
                {errorMsg}
                </div>}
                <Link
                    href={isSignin ? "/signup" : "/signin"}
                    className="block w-full text-sm text-center font-normal mt-3 cursor-pointer underline hover:text-[#7f7e7c] text-[#9b9a98]"
                    >
                    {isSignin
                        ? "New? Sign up - and start playing chess!"
                        : "Already have an account"}
                </Link>
            <div>
            </div>    
        </div>
    </div>
}