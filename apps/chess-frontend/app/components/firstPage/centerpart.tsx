import Image from "next/image"
import Link from "next/link"

export default function CenterPart(){
    return <div className="flex flex-col gap-y-2 md:flex-row md:flex-wrap gap-x-10 justify-center items-center">
        <Image src = "/centerBoardPic.png" alt="center pic" width={500} height={500}></Image>
        <div className="flex flex-col gap-y-6 py-40 items-center text-center max-w-118 ml-20">
            <h1 className="font-extrabold text-3xl md:text-5xl max-w-120">
                Play Chess Online on the #1 Site!
            </h1>
            <h2 className="font-normal text-xl max-w-80">
                Join 250+ million players in the world's largest chess community
            </h2>
            <Link href = "/signin" className="bg-[#70a94a] px-20 py-3 md:px-32 md:py-5 rounded-md cursor-pointer hover:bg-[#7fb857] md:font-extrabold md:text-xl font-bold text-lg shadow-lg shadow-black/30">
                Get Started
            </Link>
        </div>
    </div>
}