"use client";

import { Player } from "@lottiefiles/react-lottie-player";
import planningAnimation from "@/public/svg-animation/planning.json";
import { signIn } from "next-auth/react";
export default function LoginPage() {
    return (
        <div className="md:px-24 xl:px-72 md:py-80 xl:py-20 w-full h-screen">
            <div className="relative grid grid-cols-1 md:grid-rows-1 md:grid-cols-7 w-full h-full rounded-lg border bg-white">
                <div className="m-auto md:col-span-4 rounded-l-lg py-2 px-4">
                    <img
                        src="/logo/psu-guide-logo-ex.svg"
                        className="h-[6rem] m-auto mb-4"
                        alt="PSU GUIDE Logo"
                    />
                    <Player src={planningAnimation} loop autoplay />
                </div>
                <div className="grid md:grid-cols-1 col-span-3 py-28 rounded-r-lg border bg-blue-100">
                    <div className="grid grid-cols-1 gap-4 m-auto text-center p-12">
                        <p className="font-bold text-4xl">สวัสดี!</p>
                        <p className="text-xl">
                            ลงชื่อเข้าใช้ผ่าน PSU Passport เพื่อเริ่มต้นใช้งาน
                        </p>
                    </div>
                    <button
                        type="button"
                        className="p-4 m-auto bg-blue-900 text-white rounded-lg shadow hover:shadow-lg hover:scale-110 transition-all w-full max-w-96"
                        onClick={() =>
                            signIn("authentik", {
                                callbackUrl: "http://localhost:3000/",
                            })
                        }
                    >
                        <img src="/logo/PSUOauth.svg" alt="test" /> 
                    </button>
                </div>
            </div>
        </div>
    );
}
