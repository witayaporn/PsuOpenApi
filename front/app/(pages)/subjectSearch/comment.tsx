import { datetimeToTHstr, timeFormatter } from "@/app/utils/timeUtils";
import config from "@/app/config";
import { useState } from "react";

export function Comment(prop: any) {
    const data = prop.data[0];
    const allCommentData = prop.data[1];
    const allStudentVote = prop.data[2];

    const dateCreated = datetimeToTHstr(data.created);
    const studentVote = allStudentVote.filter((vote: any) => vote.commentId == data._id);
    const replies = allCommentData.filter((comment: any) => comment.parentId == data._id);

    const [vote, setVote] = useState<number>(data.vote);
    const [studentVoteState, setStudentVoteState] = useState<any>(studentVote[0]);

    const handleVoteClick = (voteType: string) => {
        const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
        // console.log("Click");
        if (Object.keys(userData).length) {
            const body = {
                commentId: data._id,
                studentId: userData.studentId,
                subjectId: data.subjectId,
                voteType: voteType,
            };
            // console.log(body);
            if (studentVoteState) {
                if (studentVoteState.voteType != voteType) {
                    try {
                        fetch(`${config.apiUrlPrefix}/vote/update/${studentVoteState._id}`, {
                            method: "POST",
                            // cache: "force-cache",
                            body: JSON.stringify(body),
                        })
                            .then((res) => res.json())
                            .then((data) => {
                                // console.log(data);
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
                        // cache: "force-cache",
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

    return (
        <div className="flex flex-col w-full p-2">
            <div className="flex">
                <div className="w-8 h-8 rounded-full bg-slate-500 my-auto"></div>
                <div className="flex flex-col">
                    <p className="mx-2 text-sm">นายxxxx xxxxxx (64xxxxxxx)</p>
                    <p className="mx-2 text-xs">{`เคยเรียน xxxxxxxxx`}</p>
                </div>
            </div>
            <div className="px-3 py-3 border-l-2 border-solid">
                <p className="text-sm text-gray-700">{data?.content}</p>
                <p className="text-[0.65rem] text-gray-700">{dateCreated}</p>
            </div>
            <div className="flex">
                <div className="flex border border-gray-400 w-fit p-1 rounded-full">
                    <button onClick={() => handleVoteClick("up")}>
                        <svg
                            xmlns="http://www.w2.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="size-5 mx-1 hover:text-green-700"
                            style={studentVoteState ? { color: studentVoteState?.voteType == "up" ? "rgb(21, 128, 61)" : "" } : {}}
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M5.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                            />
                        </svg>
                    </button>
                    <p className="px-2 text-sm border-x" style={{ color: vote > 0 ? "rgb(21, 128, 61)" : vote == 0 ? "" : "rgb(185, 28, 27)" }}>
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
                            style={studentVoteState ? { color: studentVoteState?.voteType == "down" ? "rgb(239, 68, 68)" : "" } : {}}
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54"
                            />
                        </svg>
                    </button>
                </div>
                <button className="text-sm px-3">ตอบกลับ</button>
            </div>
            <div className="pl-5">
                {replies.map((reply: any, key: number) => (
                    <Comment key={key} data={[reply, allCommentData, allStudentVote]} />
                ))}
            </div>
        </div>
    );
}
