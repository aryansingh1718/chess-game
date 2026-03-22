import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function logout(router:AppRouterInstance){
    const token = localStorage.getItem("token");
    if(!token) return;
    localStorage.removeItem("token");
    router.replace("/");
}