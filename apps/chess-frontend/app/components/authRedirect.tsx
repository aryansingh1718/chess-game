"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isTokenExpired } from "./helper/tokenCheck";

export default function AuthRedirect(){

    const router = useRouter();
    const [isChecking,setIsChecking] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(!token){
            setIsChecking(false);
            return;
        }

        if(isTokenExpired()){
            localStorage.removeItem("token");
            setIsChecking(false);
            return;
        }
        router.replace("/homepage");
    },[])

    if(isChecking) 
        return null;
    
    return null;
}