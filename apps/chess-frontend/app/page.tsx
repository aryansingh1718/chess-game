"use client";
import AuthRedirect from "./components/authRedirect";
import CenterPart from "./components/firstPage/centerpart";
import ChallengeBot from "./components/firstPage/challengeBot";
import Footer from "./components/firstPage/footer";
import SidebarListener from "./components/firstPage/sideBarListener";
import Solvepuzzle from "./components/firstPage/solvePuzzle";
import StartLesson from "./components/firstPage/startLesson";
import WatchChess from "./components/firstPage/watchChess";
import Link from "next/link";

export default function Home() {

  
  return (
    <div className="min-h-screen bg-[#302e2b] flex">
      <AuthRedirect></AuthRedirect>
      <SidebarListener showSignin = {true} showSignup = {true} showJoinRoom = {false} setShowJoinRoom={() => {}}></SidebarListener>
      <div className="md:ml-80 ml-20 mr-20 mt-20 flex flex-col gap-y-12">
        <CenterPart></CenterPart>
        <div className="flex flex-col justify-between items-center">
          <StartLesson></StartLesson>
          <ChallengeBot></ChallengeBot>
          <Solvepuzzle></Solvepuzzle>
          <WatchChess></WatchChess>
          <div className="flex flex-col gap-y-10 items-center mb-20">
              <h1 className="font-extrabold text-3xl md:text-5xl max-w-180">Learn, Play, and Have Fun!</h1>
              <Link href = "/signin" className="bg-[#70a94a] px-20 py-3 md:px-32 md:py-5 rounded-md cursor-pointer hover:bg-[#7fb857] md:font-extrabold md:text-xl font-bold text-lg shadow-lg shadow-black/30 max-w-120">
                Get Started
            </Link>
          </div>
          <Footer></Footer>
        </div>
      </div>
    </div>
  );
}
