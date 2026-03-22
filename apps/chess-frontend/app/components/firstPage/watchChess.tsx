import Image from "next/image"

export default function WatchChess(){
    return <div className="flex flex-col gap-y-2 md:flex-row md:flex-wrap gap-x-16 items-center">
        <Image src = "/watchChess.png" alt="center pic" width={500} height={500}></Image>
        <div className="flex flex-col gap-y-6 py-40 items-center text-center max-w-130 ml-5">
            <h1 className="font-bold text-3xl md:text-5xl max-w-160">           
                Watch the Best in the World Competes
            </h1>
            <h2 className="font-normal text-xl max-w-80">
                Tune into live events, and follow top players move-by-move with real-time analysis.
            </h2>
            <button  className="bg-[#373634] rounded-md cursor-pointer hover:bg-[#444341] px-20 py-3 md:px-20 md:py-5 md:font-extrabold md:text-xl font-bold text-lg shadow-lg shadow-black/40">
                Watch Chess
            </button>
        </div>
    </div>
}