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
import AlertModal from "@/app/components/alertModal";

export default function PlanPage() {
    const { status } = useSession();
    const [studentSubjectInterest, setStudentSubjectInterest] = useState<any[]>([]);
    const [classDate, setClassDate] = useState<any[]>([]);
    const [midExamDate, setMidExamDate] = useState<any[]>([]);
    const [finalExamDate, setFinalExamDate] = useState<any[]>([]);
    const [selectSubject, setSelectSubject] = useState<any[]>([]);
    const [selectSubjectMid, setSelectSubjectMid] = useState<any[]>([]);
    const [selectSubjectFinal, setSelectSubjectFinal] = useState<any[]>([]);
    const [termYear, setTermYear] = useState<TermYearJSON>({
        term: "2",
        year: "2564",
    });
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [deletedSubject, setDeletedSubject] = useState<any>({});
    const [forceChange, setForceChange] = useState<boolean>(false);

    const fetchStudentInterest = (userData: any) => {
        try {
            fetch(`${config.apiUrlPrefix}/student/${userData.studentId}?term=${termYear.term}&year=${termYear.year}`, {
                method: "GET",
                // cache: 'cache',
            })
                .then((res) => res.json())
                .then((data) => {
                    setStudentSubjectInterest(data);
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
        var tempSelectSubject: any = [...selectSubject];
        var tempSelectSubjectMid: any = [...selectSubjectMid];
        var tempSelectSubjectFinal: any = [...selectSubjectFinal];
        var filterSubject: JSON[];
        var midExam: any;
        var finalExam: any;

        if (select) {
            filterSubject = classDate.filter((item: any) => item[0].subjectId == subjectId && item[0].section == section);
            midExam = midExamDate.filter((item: any) => (item?.length ? item[0].subjectId == subjectId && item[0].section == section : null));
            finalExam = finalExamDate.filter((item: any) => (item?.length ? item[0].subjectId == subjectId && item[0].section == section : null));
            tempSelectSubject.push(filterSubject);
            tempSelectSubjectMid.push(midExam);
            tempSelectSubjectFinal.push(finalExam);
        } else {
            tempSelectSubject = tempSelectSubject.filter((item: any) => item[0][0].subjectId != subjectId || item[0][0].section != section);
            tempSelectSubjectMid = tempSelectSubjectMid.filter((item: any) => (item?.length ? item[0][0].subjectId != subjectId || item[0][0].section != section : null));
            tempSelectSubjectFinal = tempSelectSubjectFinal.filter((item: any) => (item?.length ? item[0][0].subjectId != subjectId || item[0][0].section != section : null));
        }
        setSelectSubject(tempSelectSubject);
        setSelectSubjectMid(tempSelectSubjectMid);
        setSelectSubjectFinal(tempSelectSubjectFinal);

        const planSelect = { subjects: tempSelectSubject, subjectMids: tempSelectSubjectMid, subjectFinals: tempSelectSubjectFinal };
        localStorage.setItem(`plan-${termYear.term}-${termYear.year}`, JSON.stringify(planSelect));
    };

    const handleTermSelect = (e: any) => {
        e.preventDefault();
        const splitData = e.target.value.split("/");
        const newTermYear = {
            term: splitData[0],
            year: "25" + splitData[1],
        };
        setTermYear(newTermYear);
        setSelectSubject([]);
        setSelectSubjectMid([]);
        setSelectSubjectFinal([]);
    };

    const handleDeleteInterestSubmit = (e: any) => {
        const deletedSubjectFilter = studentSubjectInterest.filter(
            (subject) =>
                subject.subjectId == deletedSubject.subjectId &&
                subject.section == deletedSubject.section &&
                subject.term == deletedSubject.eduTerm &&
                subject.year == deletedSubject.eduYear
        );
        const deletedSubjectId = deletedSubjectFilter.length ? deletedSubjectFilter[0]._id : "";

        try {
            fetch(`${config.apiUrlPrefix}/student/deleteSubjectInterest/${deletedSubjectId}`, {
                method: "POST",
            }).then((res) => {
                // console.log(res);
                if (res.status == 204) {
                    setDeletedSubject({});
                    setSelectSubject([]);
                    setForceChange(!forceChange);
                }
            });
        } catch (e) {
            console.error(e);
        }
    };

    const handleDeleteInterest = (subjectId: string) => {
        setShowAlert(true);
        setDeletedSubject(subjectId);
    };

    useEffect(() => {
        const userData = JSON.parse(encryptStorage.getItem("userData") || "{}");
        if (Object.keys(userData).length && status == "authenticated") {
            const pastSelectSubject = JSON.parse(localStorage.getItem(`plan-${termYear.term}-${termYear.year}`) || "{}");
            if (Object.keys(pastSelectSubject).length) {
                setSelectSubject(pastSelectSubject.subjects);
                setSelectSubjectMid(pastSelectSubject.subjectMids);
                setSelectSubjectFinal(pastSelectSubject.subjectFinals);
            }

            setClassDate([]);
            fetchStudentInterest(userData);
        }
    }, [status, termYear, forceChange]);

    return (
        <section>
            <div className="grid grid-cols-1 gap-5">
                <div className="grid grid-cols-1 gap-4">
                    <p className="text-4xl font-bold text-right">วางเเผนตารางเรียน</p>
                </div>
                <div>
                    <TimeTable data={selectSubject} />
                </div>
                <div className="grid grid-cols-1 px-6 py-6 bg-white w-full border rounded-lg">
                    <p className="text-2xl font-bold">ตารางสอบ</p>
                    <div className="grid grid-cols-3 bg-white w-full border-t-2 mt-2 py-2">
                        <p className="font-bold px-2">ชื่อวิชา</p>
                        <p className="font-bold pr-2">สอบกลางภาค</p>
                        <p className="font-bold pr-2">สอบปลายภาค</p>
                    </div>
                    <div className="grid grid-cols-3 gap-y-2 bg-white max-h-52 overflow-y-auto border-t-2 p-2">
                        {selectSubject.length
                            ? selectSubject.map((subject: any) => {
                                  var midExam: any = selectSubjectMid.filter((item: any) =>
                                      item[0]?.length ? item[0][0].subjectId == subject[0][0].subjectId : null
                                  );
                                  var finalExam: any = selectSubjectFinal.filter((item: any) =>
                                      item[0]?.length ? item[0][0].subjectId == subject[0][0].subjectId : null
                                  );
                                  midExam = midExam.length ? midExam[0][0][0] : null;
                                  finalExam = finalExam.length ? finalExam[0][0][0] : null;
                                  const midStr: string = midExam?.examDate.slice(0, 10);
                                  const finalStr: string = finalExam?.examDate.slice(0, 10);
                                  const midDateStr = dateToTHstr(midStr);
                                  const finalDateStr = dateToTHstr(finalStr);

                                  var midOverlap: any = [];
                                  var finalOverlap: any = [];

                                  if (midStr) {
                                      midOverlap = selectSubjectMid.filter((data: any) => {
                                          if (data[0]?.length && data[0][0] !== midExam) {
                                              const midDate = data[0][0].examDate;
                                              const midStartT = data[0][0].examStartTime;
                                              const midStopT = data[0][0].examStopTime;
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
                                      finalOverlap = selectSubjectFinal.filter((data: any) => {
                                          if (data[0]?.length && data[0][0] !== finalExam) {
                                              const finalDate = data[0][0].examDate.slice(0, 10);
                                              const finalStartT = data[0][0].examStartTime;
                                              const finalStopT = data[0][0].examStopTime;
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
                                          <p className="pr-2 py-2 text-xs md:text-sm border-b break-words">{`${subject[0][0].subjectCode} ${subject[0][0].shortNameEng}`}</p>
                                          {midExam ? (
                                              <p
                                                  className="pr-2 py-2 text-gray-700 text-xs md:text-sm border-b break-words"
                                                  style={{
                                                      color: `${midOverlap.length ? "#EF4444" : ""}`,
                                                  }}
                                              >{`${midDateStr} เวลา ${timeFormatter(midExam?.examStartTime)} - ${timeFormatter(
                                                  midExam?.examStopTime
                                              )} ห้อง ${midExam?.roomName ? midExam?.roomName : "-"}`}</p>
                                          ) : (
                                              <p className="pr-2 py-2 text-xs text-center md:text-sm border-b break-words">-</p>
                                          )}
                                          {finalExam ? (
                                              <p
                                                  className="pr-2 py-2 text-gray-700 text-xs md:text-sm border-b break-words"
                                                  style={{
                                                      color: `${finalOverlap.length ? "#EF4444" : ""}`,
                                                  }}
                                              >{`${finalDateStr} เวลา ${timeFormatter(finalExam?.examStartTime)} - ${timeFormatter(
                                                  finalExam?.examStopTime
                                              )} ห้อง ${finalExam?.roomName ? finalExam?.roomName : "-"}`}</p>
                                          ) : (
                                              <p className="pr-2 py-2 text-xs text-center md:text-sm border-b break-words">-</p>
                                          )}
                                      </>
                                  );
                              })
                            : null}
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-2 px-6 py-4 mb-16 bg-white w-full border rounded-lg">
                    <div className="flex justify-between py-2 border-b-2">
                        <p className="text-2xl font-bold ">วิชาที่คุณสนใจ</p>
                        <select
                            id="term"
                            onChange={handleTermSelect}
                            className="w-3/12 md:w-2/12 h-fit bg-gray-50 p-1 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
                        >
                            <option value="2/64">2/64</option>
                            <option value="1/64">1/64</option>
                            <option value="3/63">3/63</option>
                            <option value="2/63">2/63</option>
                            <option value="1/63">1/63</option>
                        </select>
                    </div>

                    {classDate.length ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-white w-full p-2">
                            {classDate.map((subject: any) => {
                                const isSelect: boolean = selectSubject.filter((item: any) => item[0][0].subjectId == subject[0].subjectId && item[0][0].section == subject[0].section).length > 0
                                return (
                                    <SelectableSectionCard
                                        key={subject[0].subjectId}
                                        data={subject[0]}
                                        onClick={handleSubjectSelect}
                                        onDelete={handleDeleteInterest}
                                        selected={isSelect}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col w-full">
                            <p className="text-center p-3 text-gray-500">ไม่มีข้อมูล</p>
                        </div>
                    )}
                    <a
                        className="w-full m-auto p-2 text-center border-2 rounded-lg text-gray-500 hover:bg-blue-100 transition-all duration-200"
                        href={`/subjectSearch?term=${termYear.term}&year=${termYear.year}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6 m-auto"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </a>
                </div>
            </div>
            <AnimatePresence>
                {status == "unauthenticated" ? <ProtectPageModel /> : null}
                {showAlert && (
                    <AlertModal
                        onConfirm={(e: any) => {
                            setShowAlert(false);
                            handleDeleteInterestSubmit(e);
                        }}
                        onDeny={() => setShowAlert(false)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}
