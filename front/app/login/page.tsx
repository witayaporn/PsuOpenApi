'use client'

import { Player } from "@lottiefiles/react-lottie-player";
import planningAnimation from "@/public/planning.json"



export default function LoginPage() {
  return (
    <div className="md:px-72 py-20 w-full h-screen">
      <div className="relative grid grid-rows-1 grid-cols-7 w-full h-full rounded-lg border bg-white">
        <div className="m-auto col-span-4 rounded-l-lg p-12">
          <Player src={planningAnimation} loop autoplay />
        </div>
        <div className="grid grid-cols-1 col-span-3 py-24 rounded-r-lg border bg-blue-100">
          <div className="grid grid-cols-1 gap-4 m-auto text-center p-12">
            <p className="font-bold text-4xl">สวัสดี!</p>
            <p className="text-xl">ลงชื่อเข้าใช้ผ่าน PSU Passport เพื่อเริ่มต้นใช้งาน</p>
          </div>
          <button type="button" className="p-4 m-auto bg-blue-900 text-white rounded-lg shadow hover:shadow-lg hover:scale-110 transition-all">
            Log-in with PSU
          </button>
        </div>
      </div>
    </div>
  );
}