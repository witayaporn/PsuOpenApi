import WarningAnimation from "@/public/svg-animation/warning-animation.json";
import { Player } from "@lottiefiles/react-lottie-player";
import { motion } from "framer-motion";

export default function AlertModal(prop: any) {
    return (
        <>
            <div className="justify-center flex overflow-x-hidden overflow-y-scroll fixed inset-0 z-[10600] outline-none">
                <div className="relative w-3/4 lg:w-1/4 m-auto">
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
                        <div className="flex overflow-hidden p-2 md:pb-6 md:px-12 border-b border-solid rounded-lg">
                            <div className="grid grid-cols-1 gap-y-3 p-2 m-auto text-center">
                                <Player style={{ width: "10rem" }} src={WarningAnimation} keepLastFrame autoplay />
                                <p className="text-lg font-bold">ต้องการดำเนินการต่อหรือไม่?</p>
                                <div className="flex items-center justify-center gap-3 mt-2">
                                    <button onClick={prop.onDeny} className="p-2 border rounded-lg hover:bg-gray-200 transition-all duration-200">
                                        ยกเลิก
                                    </button>
                                    <button
                                        onClick={prop.onConfirm}
                                        className="p-2 border rounded-lg bg-blue-900 text-white hover:bg-blue-500 transition-all duration-200"
                                    >
                                        ยืนยัน
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-[10500] bg-black"></div>
        </>
    );
}
