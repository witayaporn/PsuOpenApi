import { Player } from "@lottiefiles/react-lottie-player";
import WarningAnimation from "@/public/svg-animation/warning-animation.json";
import { motion } from "framer-motion";

export default function ProtectPageModel() {
    return (
        <>
            <div className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[10100] outline-none overscroll-auto">
                <div className="relative w-full m-auto max-w-3xl">
                    <motion.div
                        className="w-full h-fit grid grid-cols-1 gap-2 border-0 rounded-lg shadow-lg relative bg-white outline-none focus:outline-none"
                        initial={{ opacity: 0, scale: 0.75 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            transition: {
                                ease: "easeOut",
                                duration: 0.1,
                            },
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.75,
                            transition: {
                                ease: "easeIn",
                                duration: 0.1,
                            },
                        }}
                    >
                        <div className="flex overflow-hidden p-6 md:pb-12 md:px-36 border-b border-solid rounded-lg">
                            <div className="grid grid-cols-1 gap-y-3 m-auto text-center">
                                <Player style={{ width: "10rem" }} src={WarningAnimation} keepLastFrame autoplay />
                                <p className="text-xl font-bold">เข้าสู่ระบบเพื่อดำเนินการต่อ</p>
                                <p className="text-lg">คุณยังไม่ได้เข้าสู่ระบบ โปรดเข้าสู่ระบบเพื่อดำเนินการต่อหรือกลับสู่หน้าเเรก</p>
                                <div className="flex items-center justify-center gap-3 mt-2">
                                    <a href="/home" className="p-2 border rounded-lg hover:bg-gray-200 transition-all duration-200">
                                        กลับหน้าเเรก
                                    </a>
                                    <a
                                        href="/login"
                                        className="p-2 border rounded-lg bg-blue-900 text-white hover:bg-blue-100 hover:text-black transition-all duration-200"
                                    >
                                        ลงชื่อเข้าสู่ระบบ
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-[10000] bg-black"></div>
        </>
    );
}
