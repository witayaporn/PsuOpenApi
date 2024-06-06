"use client";
import { useEffect, useState } from "react";
import SelectableSectionCard from "./selectableSubjectCard";
import TimeTable from "./timeTable";
import { timeFormatter, dateToTHstr, checkDateTimeOverlap } from "@/app/utils/timeUtils";
import { TermYearJSON } from "../subjectSearch/page";
import { useSession } from "next-auth/react";
import { AnimatePresence } from "framer-motion";
import ProtectPageModel from "@/app/components/protectPageModal";
import config from "@/app/config";
import { encryptStorage } from "@/app/utils/encryptStorage";

export default function PlanPage() {
    const { status } = useSession();
    const [classDate, setClassDate] = useState<any[]>([]);
    const [midExamDate, setMidExamDate] = useState<any[]>([]);
    const [finalExamDate, setFinalExamDate] = useState<any[]>([]);
    const [selectSubject, setSelectSubject] = useState<any[]>([]);
    const [termYear, setTermYear] = useState<TermYearJSON>({
        term: "2",
        year: "2564",
    });

    const fetchStudentInterest = (userData: any) => {
        try {
            fetch(`${config.apiUrlPrefix}/student/${userData.studentId}?term=${termYear.term}&year=${termYear.year}`, {
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
                            .then((data) => (data.data ? setClassDate((classDate) => [...classDate, data.data]) : null));

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
                                const mid = data.data?.filter((subject: any) => subject.examdateType == "M");
                                const final = data.data?.filter((subject: any) => subject.examdateType == "F");
                                setMidExamDate((midExamDate) => [...midExamDate, mid]);
                                setFinalExamDate((finalExamDate) => [...finalExamDate, final]);
                            });
                    });
                });
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubjectSelect = (subjectId: string, section: string, select: boolean) => {
        var temp: any = [...selectSubject];
        var filterSubject: JSON[];
        if (select) {
            filterSubject = classDate.filter((item: any) => item[0].subjectId == subjectId && item[0].section == section);
            temp.push(filterSubject);
        } else {
            temp = temp.filter((item: any) => item[0][0].subjectId != subjectId || item[0][0].section != section);
        }
        setSelectSubject(temp);
    };

    const handleTermSelect = (e: any) => {
        e.preventDefault();
        const splitData = e.target.value.split("/");
        const newTermYear = {
            term: splitData[0],
            year: "25" + splitData[1],
        };
        setTermYear(newTermYear);
    };

    useEffect(() => {
        // "use client";
        const userData = JSON.parse(encryptStorage.getItem("userData") || "{}");
        if (Object.keys(userData).length && status == "authenticated") {
            setClassDate([]);
            fetchStudentInterest(userData);
        }
    }, [status, termYear]);

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
                                        >{`${midDateStr} เวลา ${timeFormatter(midExam?.examStartTime)} - ${timeFormatter(
                                            midExam?.examStopTime
                                        )} ห้อง ${midExam?.roomName ? midExam?.roomName : "-"}`}</p>
                                    ) : (
                                        <p>-</p>
                                    )}
                                    {finalExam ? (
                                        <p
                                            className="text-sm"
                                            style={{
                                                color: `${finalOverlap.length ? "red" : "black"}`,
                                            }}
                                        >{`${finalDateStr} เวลา ${timeFormatter(finalExam?.examStartTime)} - ${timeFormatter(
                                            finalExam?.examStopTime
                                        )} ห้อง ${finalExam?.roomName ? finalExam?.roomName : "-"}`}</p>
                                    ) : (
                                        <p>-</p>
                                    )}
                                </>
                            );
                        })}
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-2 px-6 py-4 mb-16 bg-white w-full border rounded-lg">
                    <div className="flex justify-between">
                        <p className="text-2xl font-bold">วิชาที่คุณสนใจ</p>
                        <select
                            id="term"
                            onChange={handleTermSelect}
                            className="h-full bg-gray-50 p-1 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
                        >
                            <option value="2/64">2/64</option>
                            <option value="1/64">1/64</option>
                            <option value="3/63">3/63</option>
                            <option value="2/63">2/63</option>
                            <option value="1/63">1/63</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-white w-full border-t-2 p-2">
                        {classDate.length ? (
                            classDate.map((subject, key) => <SelectableSectionCard key={key} data={subject} onClick={handleSubjectSelect} />)
                        ) : (
                            <p className="font-bold">ไม่มีข้อมูล</p>
                        )}
                    </div>
                </div>
            </div>
            <AnimatePresence>{status == "unauthenticated" ? <ProtectPageModel /> : null}</AnimatePresence>
        </section>
    );
}
