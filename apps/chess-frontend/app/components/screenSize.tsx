"use client"
import { useEffect, useState } from "react"

export const useMediaQuery = (query:string) => {
    const [matches,setMatches] = useState(true);

    useEffect(() => {
        const media = window.matchMedia(query);
        const listener = () => setMatches(media.matches);
        media.addEventListener("change",listener);
        return () => media.removeEventListener("change",listener);
    },[matches,query])
    return matches;
}