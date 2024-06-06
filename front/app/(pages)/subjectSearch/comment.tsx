import { datetimeToTHstr } from "@/app/utils/timeUtils";
import config from "@/app/config";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { encryptStorage } from "@/app/utils/encryptStorage";

export function Comment(prop: any) {
    const data = prop.data;
    // const allCommentData = prop.comments ? prop.comments : [];
    // const allStudentVote = prop.votes ? prop.votes : [];
    const dateCreated = datetimeToTHstr(data.created);

    const { data: session, status } = useSession();
    const [userData, setUserData] = useState<any>(JSON.parse(encryptStorage.getItem("userData") || "{}"));
    const [comments, setComments] = useState<any>(prop.comments || []);
    const [votes, setVotes] = useState<any>(prop.votes || []);
    const [vote, setVote] = useState<number>(0);
    const [studentVoteState, setStudentVoteState] = useState<any>({});
    const [commentReply, setCommentReply] = useState<any>([]);
    const [commentOption, showCommentOption] = useState<boolean>(false);

    const handleVoteClick = (voteType: string) => {
        if (Object.keys(userData).length && status == "authenticated") {
            const body = {
                commentId: data._id,
                studentId: userData.studentId,
                subjectId: data.subjectId,
                voteType: voteType,
            };
            if (studentVoteState) {
                if (studentVoteState.voteType != voteType) {
                    try {
                        fetch(`${config.apiUrlPrefix}/vote/update/${studentVoteState._id}`, {
                            method: "POST",
                            body: JSON.stringify(body),
                        })
                            .then((res) => res.json())
                            .then((data) => {
                                if (data) {
                                    setVote(voteType == "up" ? vote + 2 : vote - 2);
                                    setStudentVoteState(data);
                                }
                            });
                    } catch (e) {
                        console.error(e);
                    }
                } else {
                    try {
                        fetch(`${config.apiUrlPrefix}/vote/delete/${studentVoteState._id}`, {
                            method: "POST",
                        }).then((res) => {
                            if (res.status == 204) {
                                setVote(voteType == "up" ? vote - 1 : vote + 1);
                                setStudentVoteState(null);
                            }
                        });
                    } catch (e) {
                        console.error(e);
                    }
                }
            } else {
                try {
                    fetch(`${config.apiUrlPrefix}/vote/`, {
                        method: "POST",
                        body: JSON.stringify(body),
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            if (data) {
                                setVote(voteType == "up" ? vote + 1 : vote - 1);
                                setStudentVoteState(data);
                            }
                        });
                } catch (e) {
                    console.error(e);
                }
            }
        }
    };

    useEffect(() => {
        const studentVote = votes.filter((vote: any) => vote.commentId == data._id);
        const replies = comments.filter((comment: any) => comment.parentId == data._id);

        setVote(data.vote);
        setStudentVoteState(studentVote[0]);
        setCommentReply(replies);
    }, []);

    return (
        <div
            className="flex flex-col w-full my-1 px-2 py-1 bg-slate-100 rounded-lg"
            style={{ backgroundColor: Object.keys(userData).length && userData.studentId == data?.studentId && prop.onReply ? "#DBEAFE" : "" }}
        >
            <div className="flex">
                <div className="min-w-8 h-8 rounded-full bg-slate-500 my-auto"></div>
                <div className="flex flex-col">
                    <p className="mx-2 text-sm">{`${data?.studentInfoTH} (${data?.studentId})`}</p>
                    <p className="mx-2 text-[0.65rem]" style={{ color: data?.extraInfo.length ? "#0F766E" : "#EA580C" }}>
                        {data?.extraInfo.length ? `เคยลงทะเบียนเรียนวิชานี้ (${data.extraInfo})` : "ไม่เคยลงทะเบียนวิชานี้"}
                    </p>
                </div>
            </div>
            <div className="px-3 py-3 border-l-2 border-solid">
                <p className="text-sm text-gray-700">{data?.content}</p>
                <p className="text-[0.65rem] text-gray-700">{dateCreated}</p>
            </div>
            <div className="flex">
                <div className="flex bg-white border border-gray-400 w-fit p-1 rounded-full">
                    <button onClick={() => handleVoteClick("up")}>
                        <svg
                            xmlns="http://www.w2.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="size-5 mx-1 hover:text-green-700"
                            style={studentVoteState ? { color: studentVoteState?.voteType == "up" ? "#15803D" : "" } : {}}
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M5.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                            />
                        </svg>
                    </button>
                    <p className="px-2 text-sm m-auto border-x" style={{ color: vote > 0 ? "#15803D" : vote == 0 ? "" : "#EF4444" }}>
                        {(vote > 0 ? "+" : "") + vote}
                    </p>
                    <button onClick={() => handleVoteClick("down")}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="size-5 mx-1 hover:text-red-500"
                            style={studentVoteState ? { color: studentVoteState?.voteType == "down" ? "#EF4444" : "" } : {}}
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54"
                            />
                        </svg>
                    </button>
                </div>

                {prop.onReply ? (
                    <button
                        className="text-sm mx-2 px-2 p-1 bg-white border border-gray-400 rounded-full hover:bg-gray-300 ease-linear transition-all"
                        onClick={() => prop.onReply(data)}
                    >
                        ตอบกลับ
                    </button>
                ) : (
                    <p className="text-sm px-3 my-auto text-gray-600">กำลังตอบกลับ</p>
                )}

                {Object.keys(userData).length && userData.studentId == data?.studentId && prop.onReply && (
                    <div
                        className="w-fit text-sm bg-gray-200 rounded-full ease-linear transition-all"
                        // style={{ borderWidth: commentOption ? "1px 0px" : "0px 0px" }}
                    >
                        <button
                            className="text-sm px-2 p-1 bg-white border border-gray-400 rounded-full hover:bg-gray-300 ease-linear transition-all"
                            onClick={() => showCommentOption(!commentOption)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                                />
                            </svg>
                        </button>
                        <button
                            className="text-sm px-2 p-1 rounded-full hover:bg-gray-300 hover:text-blue-500 ease-linear transition-all"
                            style={{ display: commentOption ? "" : "none" }}
                            onClick={() => prop.onEdit(data)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.3"
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                />
                            </svg>
                        </button>
                        <button
                            className="text-sm px-2 p-1 rounded-full hover:bg-gray-300 hover:text-red-500 ease-linear transition-all"
                            style={{ display: commentOption ? "" : "none" }}
                            onClick={() => prop.onDelete()}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.3"
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
            <div className="pl-5">
                {commentReply.map((reply: any) => (
                    <Comment
                        key={reply._id}
                        data={reply}
                        comments={comments}
                        votes={votes}
                        onReply={prop.onReply}
                        onEdit={prop.onEdit}
                        onDelete={prop.onDelete}
                    />
                ))}
            </div>
        </div>
    );
}
