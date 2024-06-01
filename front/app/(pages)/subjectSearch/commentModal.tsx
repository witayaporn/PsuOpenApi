import { motion } from "framer-motion";
import { Comment } from "./comment";

export default function CommentModal(prop: any) {
    return (
        <>
            <div className="justify-center flex overflow-x-hidden overflow-y-scroll fixed inset-0 z-[10200] outline-none">
                <div className="relative w-full md:w-2/4 m-auto">
                    <motion.div
                        className="w-full h-fit grid grid-cols-1 gap-2 p-5 pr-0 border-0 rounded-lg shadow-lg relative bg-white outline-none focus:outline-none"
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
                        <div className="flex pr-5">
                            <button
                                className="absolute top-1 right-0 px-2 text-gray-500 hover:bg-gray-300 hover:text-red-500 rounded-lg font-bold uppercase text-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={()=> prop.setShowComment(!prop.showComment)}
                            >
                                X
                            </button>
                            <p className="w-full font-bold text-lg border-b border-solid">ความคิดเห็นต่อรายวิชา</p>
                        </div>
                        <div className="flex flex-col max-h-screen md:max-h-[80vh] overflow-y-auto pr-3">
                            <Comment data={{}}/>
                            <Comment />
                            <Comment />
                        </div>
                    </motion.div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-[10100] bg-black"></div>
        </>
    );
}
