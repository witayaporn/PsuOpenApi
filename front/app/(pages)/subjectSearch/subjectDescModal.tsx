

import { motion } from "framer-motion";

export default function SubjectDescModal() {
    return (
        <>
            <div className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[10100] outline-none overscroll-auto">
                <div className="w-2/4 m-auto">
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
                           
                        </div>
                    </motion.div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-[10000] bg-black"></div>
        </>
    );
}