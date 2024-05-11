"use client";
import { useEffect, useState } from "react";
import SelectableSectionCard from "./selectableSubjectCard";
import TimeTable from "./timeTable";
import { timeFormatter, dateToTHstr, checkDateTimeOverlap } from "@/app/utils/timeUtils";
import mockup from "@/public/interest-card-mock.json";
import { useSession } from "next-auth/react";
import { AnimatePresence } from "framer-motion";
import ProtectPageModel from "@/app/components/protectPageModal";

export default function PlanPage() {
    const { status } = useSession();
    const [classDate, setClassDate] = useState<any[]>([]);
    const [midExamDate, setMidExamDate] = useState<any[]>([]);
    const [finalExamDate, setFinalExamDate] = useState<any[]>([]);
    const [selectSubject, setSelectSubject] = useState<any[]>([]);

    const handleSubjectSelect = (subjectId: string, section: string, select: boolean) => {
        var temp: any = [...selectSubject];
        var filterSubject: JSON[];
        if (select) {
            filterSubject = classDate.filter(
                (item: any) => item[0].subjectId == subjectId && item[0].section == section
            );
            temp.push(filterSubject);
        } else {
            temp = temp.filter(
                (item: any) => item[0][0].subjectId != subjectId && item[0][0].section != section
            );
        }
        setSelectSubject(temp);
    };

    useEffect(() => {
        const userData = JSON.parse(sessionStorage.getItem("userData"));
        if (userData != null && status == "authenticated") {
            fetch(`http://localhost:8000/student/${userData.studentId}?term=${2}&year=${2563}`, {
                method: "GET",
                // cache: 'cache',
            })
                .then((res) => res.json())
                .then((data) => {
                    data.map((subject: any) => {
                        fetch(
                            `https://api-gateway.psu.ac.th/Test/regist/SectionClassdateCampus/01/${subject.term}/${subject.year}/${subject.subjectId}/?section=${subject.section}&offset=0&limit=100`,
                            {
                                method: "GET",
                                cache: "force-cache",
                                headers: {
                                    credential: process.env.NEXT_PUBLIC_API_KEY,
                                },
                            }
                        )
                            .then((res) => res.json())
                            .then((data) =>
                                data.data
                                    ? setClassDate((classDate) => [...classDate, data.data])
                                    : null
                            );

                        fetch(
                            `https://api-gateway.psu.ac.th/Test/regist/SectionExamdateCampus/01/${subject.term}/${subject.year}/${subject.subjectId}?section=&offset=0&limit=100`,
                            {
                                method: "GET",
                                cache: "force-cache",
                                headers: {
                                    credential: process.env.NEXT_PUBLIC_API_KEY,
                                },
                            }
                        )
                            .then((res) => res.json())
                            .then((data) => {
                                const mid = data.data?.filter(
                                    (subject: any) => subject.examdateType == "M"
                                );
                                const final = data.data?.filter(
                                    (subject: any) => subject.examdateType == "F"
                                );
                                setMidExamDate((midExamDate) => [...midExamDate, mid]);
                                setFinalExamDate((finalExamDate) => [...finalExamDate, final]);
                            });
                    });
                });
        }
    }, []);

    return (
        <section>
            <div className="grid grid-cols-1 gap-5">
                <div className="grid grid-cols-1 gap-4">
                    <p className="text-4xl font-bold text-right">วางเเผนตารางเรียน</p>
                </div>
                <div>
                    <TimeTable data={selectSubject} />
                </div>
                <div className="grid grid-cols-1 px-6 py-4 bg-white w-full border rounded-lg">
                    <p className="text-xl font-bold">ตารางสอบ</p>
                    <div className="grid grid-cols-3 md:grid-cols-3 gap-2 bg-white w-full border-t-2 p-2">
                        <p className="font-bold">ชื่อวิชา</p>
                        <p className="font-bold">สอบกลางภาค</p>
                        <p className="font-bold">สอบปลายภาค</p>
                        {selectSubject.map((subject: any) => {
                            console.log(subject[0][0]);
                            console.log(midExamDate);
                            finalExamDate.map((data: any) => console.log(data));
                            var midExam: any = midExamDate.filter((data: any) =>
                                data?.length ? data[0].subjectId == subject[0][0].subjectId : null
                            );
                            var finalExam: any = finalExamDate.filter((data: any) =>
                                data?.length ? data[0].subjectId == subject[0][0].subjectId : null
                            );
                            midExam = midExam.length ? midExam[0][0] : null;
                            finalExam = finalExam.length ? finalExam[0][0] : null;
                            const midStr: string = midExam?.examDate.slice(0, 10);
                            const finalStr: string = finalExam?.examDate.slice(0, 10);
                            const midDateStr = dateToTHstr(midStr);
                            const finalDateStr = dateToTHstr(finalStr);

                            var midOverlap: any = [];
                            var finalOverlap: any = [];
                            if (midStr) {
                                midOverlap = midExamDate.filter((data: any) => {
                                    if (data?.length && data[0] !== midExam) {
                                        const midDate = data[0].examDate.slice(0, 10);
                                        const midStartT = data[0].examStartTime;
                                        const midStopT = data[0].examStopTime;
                                        return checkDateTimeOverlap(
                                            midExam.examDate,
                                            midExam.examStartTime,
                                            midExam.examStopTime,
                                            midDate,
                                            midStartT,
                                            midStopT
                                        );
                                    }
                                    return false;
                                });
                            }

                            if (finalStr) {
                                finalOverlap = finalExamDate.filter((data: any) => {
                                    if (data?.length && data[0] !== finalExam) {
                                        const finalDate = data[0].examDate.slice(0, 10);
                                        const finalStartT = data[0].examStartTime;
                                        const finalStopT = data[0].examStopTime;
                                        return checkDateTimeOverlap(
                                            finalExam.examDate,
                                            finalExam.examStartTime,
                                            finalExam.examStopTime,
                                            finalDate,
                                            finalStartT,
                                            finalStopT
                                        );
                                    }
                                    return false;
                                });
                            }

                            return (
                                <>
                                    <p className="text-sm">{`${subject[0][0].subjectCode} ${subject[0][0].shortNameEng}`}</p>
                                    {midExam ? (
                                        <p
                                            className="text-sm"
                                            style={{
                                                color: `${midOverlap.length ? "red" : "black"}`,
                                            }}
                                        >{`${midDateStr} เวลา ${timeFormatter(
                                            midExam?.examStartTime
                                        )} - ${timeFormatter(midExam?.examStopTime)} ห้อง ${
                                            midExam?.roomName ? midExam?.roomName : "-"
                                        }`}</p>
                                    ) : (
                                        <p>-</p>
                                    )}
                                    {finalExam ? (
                                        <p
                                            className="text-sm"
                                            style={{
                                                color: `${finalOverlap.length ? "red" : "black"}`,
                                            }}
                                        >{`${finalDateStr} เวลา ${timeFormatter(
                                            finalExam?.examStartTime
                                        )} - ${timeFormatter(finalExam?.examStopTime)} ห้อง ${
                                            finalExam?.roomName ? finalExam?.roomName : "-"
                                        }`}</p>
                                    ) : (
                                        <p>-</p>
                                    )}
                                </>
                            );
                        })}
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-2 px-6 py-4 mb-16 bg-white w-full border rounded-lg">
                    <p className="text-2xl font-bold">วิชาที่คุณสนใจ</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-white w-full border-t-2 p-2">
                        {classDate.length ? (
                            classDate.map((subject, key) => (
                                <SelectableSectionCard
                                    key={key}
                                    data={subject}
                                    onClick={handleSubjectSelect}
                                />
                            ))
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
            <AnimatePresence>
                {status == "unauthenticated" ? <ProtectPageModel /> : null}
            </AnimatePresence>
        </section>
    );
}
