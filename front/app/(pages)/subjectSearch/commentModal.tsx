import { motion } from "framer-motion";
import { Comment } from "./comment";

export default function CommentModal(prop: any) {
    const commentData = prop.comment;
    return (
        <>
            <div className="justify-center flex overflow-x-hidden overflow-y-scroll fixed inset-0 z-[10200] outline-none">
                <div className="relative w-full md:w-4/5 lg:w-2/4 xl:w-2/5 m-auto">
                    <motion.div
                        className="w-full h-screen md:h-fit grid grid-cols-1 gap-2 p-5 pr-0 border-0 rounded-lg shadow-lg relative bg-white outline-none focus:outline-none"
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
                                onClick={() => prop.setShowComment(!prop.showComment)}
                            >
                                X
                            </button>
                            <p className="w-full font-bold text-lg border-b border-solid">ความคิดเห็นต่อรายวิชา</p>
                        </div>
                        <div className="flex flex-col max-h-screen md:max-h-[70vh] overflow-y-auto pr-3">
                            {console.log(commentData)}
                            {commentData.map((comment: any) => {
                                console.log(comment.parentId)
                                if (comment.parentId == null) {
                                    return <Comment data={[comment, commentData]} />;
                                }
                            })}
                        </div>
                        <div className="flex pr-5">
                            <div className="w-8 h-8 rounded-full bg-slate-500"></div>
                            <form className="flex flex-col w-full bg-slate-200 border-2 border-solid rounded-2xl mx-2">
                                <textarea
                                    className="w-full h-full text-sm border-none outline-none resize-none bg-transparent rounded-2xl px-3 py-1"
                                    placeholder="เเสดงความคิดเห็นในชื่อ xxxxxxxxx"
                                ></textarea>
                                <div className="flex justify-end">
                                    <button className="flex w-fit px-3 py-1 text-gray-500 hover:text-blue-800">
                                        <p className="mx-1 my-auto text-md">ส่ง</p>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-[10100] bg-black"></div>
        </>
    );
}
