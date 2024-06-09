import { AnimatePresence, motion } from "framer-motion";
import { Comment } from "./comment";
import { useEffect, useState } from "react";
import config from "@/app/config";
import { useSession } from "next-auth/react";
import CommentSkeleton from "./commentSkeleton";
import { encryptStorage } from "@/app/utils/encryptStorage";
import AlertModal from "@/app/components/alertModal";

export default function CommentModal(prop: any) {
    // const commentData = prop.comment;
    const subjectId = prop.subjectId;
    const [userData, setUserData] = useState<any>({});
    const [tempName, setTempName] = useState<string>("");
    const [subjectComment, setSubjectComment] = useState<any[]>([]);
    const [hasComment, setHasComment] = useState<boolean>(prop.hasComment);
    const [studentVote, setStudentVote] = useState<any[]>([]);
    const [studentRegistInfo, setStudentRegistInfo] = useState<any>({});
    const [newComment, setNewComment] = useState<any>({});
    const [repliedComment, setRepliedComment] = useState<any>({});
    const [commentText, setCommentText] = useState<string>("");
    const [selectedCommentId, setSelectedCommentId] = useState<string>("");
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const { data: session, status } = useSession();

    const handleCommentTextChange = (e: any) => {
        setCommentText(e.target.value);
    };

    const handleCommentSubmit = (e: any) => {
        e.preventDefault();
        // const userData = JSON.parse(encryptStorage.getItem("userData") || "{}");
        if (Object.keys(userData).length && status == "authenticated") {
            const body = {
                content: commentText,
                parentId: Object.keys(repliedComment).length ? repliedComment._id : "",
                studentId: userData.studentId,
                studentInfoTH: userData.titleNameThai + userData.studNameThai + " " + userData.studSnameThai,
                studentInfoEN: userData.studNameEng + " " + userData.studSnameEng,
                extraInfo: Object.keys(studentRegistInfo).length ? `${studentRegistInfo.eduTerm}/${studentRegistInfo.eduYear}` : "",
                subjectId: subjectId,
            };
            try {
                fetch(`${config.apiUrlPrefix}/comment/`, {
                    method: "POST",
                    body: JSON.stringify(body),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data) {
                            setNewComment(data);
                            setCommentText("");
                            setRepliedComment({});
                            setSubjectComment([]);
                        }
                    });
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleEditCommentSubmit = (e: any) => {
        e.preventDefault();
        try {
            fetch(`${config.apiUrlPrefix}/comment/update/${repliedComment._id}`, {
                method: "POST",
                body: JSON.stringify({
                    content: commentText,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data) {
                        setNewComment(data);
                        setCommentText("");
                        setRepliedComment({});
                        setSubjectComment([]);
                    }
                });
        } catch (e) {
            console.error(e);
        }
    };

    const handleDeleteCommentSubmit = (e: any) => {
        e.preventDefault();
        try {
            fetch(`${config.apiUrlPrefix}/comment/delete/${selectedCommentId}`, {
                method: "POST",
            }).then((res) => {
                if (res.status == 204) {
                    // console.log(data);
                    setNewComment({});
                    setCommentText("");
                    setRepliedComment({});
                    setSubjectComment([]);
                }
            });
        } catch (e) {
            console.error(e);
        }
    };

    const handleReplyComment = (repliedCommentData: any) => {
        if (Object.keys(userData).length && status == "authenticated") {
            setIsEdit(false);
            setRepliedComment(repliedCommentData);
            setCommentText("");
        }
    };

    const handleEditComment = (editedComment: any) => {
        if (Object.keys(userData).length && status == "authenticated") {
            setIsEdit(true);
            setRepliedComment(editedComment);
            setCommentText(editedComment.content);
        }
    };

    const handleDeleteComment = (commentId: string) => {
        if (Object.keys(userData).length && status == "authenticated") {
            setShowAlert(true);
            setSelectedCommentId(commentId);
        }
    };

    const fetchSubjectComment = () => {
        try {
            fetch(`${config.apiUrlPrefix}/comment/${subjectId}`, {
                method: "GET",
                headers: {
                    accept: "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.length) {
                        data.sort((commA: any, commB: any) => {
                            if (commA.vote > commB.vote) {
                                return -1;
                            } else if (commA.vote < commB.vote) {
                                return 1;
                            } else {
                                if (commA.created > commB.created) {
                                    return -1;
                                } else {
                                    return 1;
                                }
                            }
                        });

                        setSubjectComment(data);
                        setHasComment(true);
                    }
                });
        } catch (e) {
            console.error(e);
        }
    };

    const fetchStudentVote = (userData: any) => {
        try {
            fetch(`${config.apiUrlPrefix}/vote/user/${userData.studentId}?subjectId=${subjectId}`, {
                method: "GET",
                headers: {
                    accept: "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    setStudentVote(data);
                });
        } catch (e) {
            console.error(e);
        }
    };

    const fetchAllStudentRegist = () => {
        try {
            fetch("https://api-gateway.psu.ac.th/Test/regist/level2/RegistDataCampus/01/token?eduTerm=*&eduYear=*&offset=0&limit=100", {
                method: "GET",
                cache: "force-cache",
                headers: {
                    credential: process.env.NEXT_PUBLIC_API_KEY,
                    token: session?.accessToken,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    // console.log(data)
                    const pastRegisted = data.data.filter((subjectRegisted: any) => subjectRegisted.subjectId == subjectId);
                    setStudentRegistInfo(pastRegisted[0] || {});
                    // console.log(pastRegisted);
                });
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        const user = JSON.parse(encryptStorage.getItem("userData") || "{}");
        if (Object.keys(user).length && status == "authenticated") {
            setTempName(user.studNameEng.split(" ")[1][0] + user.studSnameEng.split(" ")[1][0]);
            setUserData(user);
            fetchStudentVote(user);
            fetchAllStudentRegist();
        }
        fetchSubjectComment();
    }, [newComment]);
    return (
        <>
            <div className="justify-center flex overflow-x-hidden overflow-y-scroll fixed inset-0 z-[10200] outline-none">
                <div className="relative w-full md:w-4/5 lg:w-2/4 xl:w-2/5 m-auto">
                    <motion.div
                        className="flex flex-col w-full h-screen md:h-[70vh] lg:h-[90vh] md:max-h-[70vh] lg:max-h-[90vh] pt-5 pr-0 border-0 rounded-lg shadow-lg relative bg-white outline-none focus:outline-none"
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
                        <div className="flex h-fit px-5 pb-2 border-b-2 border-solid">
                            <button
                                className="absolute top-1 right-0 px-2 text-gray-500 hover:bg-gray-300 hover:text-red-500 rounded-lg font-bold uppercase text-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => prop.setShowComment(!prop.showComment)}
                            >
                                X
                            </button>
                            <p className="w-full font-bold text-lg ">ความคิดเห็นต่อรายวิชา</p>
                        </div>
                        <div className="flex flex-col h-full overflow-y-auto px-3">
                            {hasComment ? (
                                subjectComment.length ? (
                                    subjectComment.map((comment: any) => {
                                        if (comment.parentId == null) {
                                            return (
                                                <Comment
                                                    key={comment._id}
                                                    data={comment}
                                                    comments={subjectComment}
                                                    votes={studentVote}
                                                    onReply={handleReplyComment}
                                                    onEdit={handleEditComment}
                                                    onDelete={handleDeleteComment}
                                                />
                                            );
                                        }
                                    })
                                ) : (
                                    <>
                                        <CommentSkeleton />
                                        <CommentSkeleton />
                                        <CommentSkeleton />
                                    </>
                                )
                            ) : (
                                <p className="w-full text-gray-500 text-center p-2">ไม่มีความคิดเห็นต่อรายวิชา</p>
                            )}
                        </div>
                        <div className="flex flex-col h-fit px-3 pb-5 bg-gray-100 rounded-b-lg border-t-2 border-solid border-gray-300">
                            <div>
                                {Object.keys(repliedComment).length ? (
                                    <div>
                                        <button
                                            className="absolute ml-auto w-fit right-0 px-2 mt-1 mr-1 border-2 border-slate-200 text-gray-500 text-sm hover:bg-gray-200 hover:border-gray-200 rounded-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => {
                                                setIsEdit(false);
                                                setRepliedComment({});
                                                setCommentText("");
                                            }}
                                        >
                                            <p className="hidden md:flex">ยกเลิก</p>
                                            <p className="md:hidden">X</p>
                                        </button>
                                        <Comment data={repliedComment} votes={studentVote} state={isEdit ? "edit" : "reply"} />
                                    </div>
                                ) : null}
                            </div>
                            <div className="mt-2 md:mt-2">
                                {Object.keys(userData).length && status == "authenticated" ? (
                                    <div className="flex w-full">
                                        <div
                                            className="flex min-w-8 h-8 rounded-full"
                                            style={{ backgroundColor: `#${userData?.studentId.slice(0, 6)}` }}
                                        >
                                            <p className="w-full my-auto text-center text-lg text-white">{tempName}</p>
                                        </div>
                                        <form
                                            onSubmit={isEdit ? handleEditCommentSubmit : handleCommentSubmit}
                                            className="flex flex-col w-full bg-slate-200 border-2 border-solid rounded-2xl mx-2"
                                        >
                                            <textarea
                                                value={commentText}
                                                className="w-full h-full text-sm border-none outline-none resize-none bg-transparent rounded-2xl px-3 py-1"
                                                placeholder={
                                                    Object.keys(studentRegistInfo).length ? "คุณเคยลงทะเบียนวิชานี้" : "คุณไม่เคยลงทะเบียนวิชานี้"
                                                }
                                                onChange={handleCommentTextChange}
                                            ></textarea>
                                            <div className="flex justify-end">
                                                <button type="submit" className="flex w-fit px-3 py-1 text-gray-600 hover:text-blue-800">
                                                    <p className="mx-1 my-auto text-md">{isEdit ? "เเก้ไข" : "ส่ง"}</p>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        className="size-6"
                                                    >
                                                        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="flex w-full">
                                        <a
                                            href="/login"
                                            className="m-auto p-2 border rounded-lg bg-blue-900 text-white hover:bg-blue-500 transition-all duration-200"
                                        >
                                            ลงชื่อเข้าสู่ระบบ
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-[10100] bg-black"></div>
            <AnimatePresence>
                {showAlert && (
                    <AlertModal
                        onConfirm={(e: any) => {
                            setShowAlert(false);
                            handleDeleteCommentSubmit(e);
                        }}
                        onDeny={() => setShowAlert(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
