import Image from "next/image"

export default function ChallengeBot(){
    return <div className="flex flex-col gap-y-2 md:flex-row md:flex-wrap gap-x-16 items-center">
        <Image src = "/challengeBot.png" alt="center pic" width={400} height={400}></Image>
        <div className="flex flex-col gap-y-6 py-40 items-center text-center max-w-130 ml-5">
            <h1 className="font-bold text-3xl md:text-5xl max-w-160">           
                Play Chess Bots
            </h1>
            <h2 className="font-normal text-xl max-w-80">
                Play against unique chess personalities ranging in skill and playstyle.
            </h2>
            <button  className="bg-[#373634] rounded-md cursor-pointer hover:bg-[#444341] px-20 py-3 md:px-20 md:py-5 md:font-extrabold md:text-xl font-bold text-lg shadow-lg shadow-black/40">
                Challenge a Bot
            </button>
        </div>
    </div>
}