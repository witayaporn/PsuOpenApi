import SuccessAnimation from "@/public/svg-animation/success-animation.json";
import { Player } from "@lottiefiles/react-lottie-player";
import { motion } from "framer-motion";

export default function AlertModal(prop: any) {
    return (
        <>
            <div className="justify-center flex overflow-x-hidden overflow-y-scroll fixed inset-0 z-[10200] outline-none">
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
                            <div className="grid grid-cols-1 gap-y-3 m-auto text-center">
                                <Player style={{ width: "10rem" }} src={SuccessAnimation} keepLastFrame autoplay />
                                <p className="text-xl font-bold">ดำเนินการสำเร็จ</p>
                                <div className="flex items-center justify-center gap-3 mt-2">
                                    <button
                                        onClick={() => {
                                            prop.handleClose();
                                            prop.setShowAlert(!prop.showAlert);
                                        }}
                                        className="p-2 border rounded-lg hover:bg-gray-200 transition-all duration-200"
                                    >
                                        ปิด
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-[10100] bg-black"></div>
        </>
    );
}
