import { timeFormatter, dateToTHstr } from "@/app/utils/timeUtils";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import config from "@/app/config";
import { encryptStorage } from "@/app/utils/encryptStorage";

export default function SectionCard(prop: any) {
    const data = prop.data[0];
    const dateData = prop.data[1];
    const examData = prop.data[2];
    const statData = prop.data[3];
    const midExam = examData ? examData.filter((data: any) => data.examdateType == "M")[0] : null;
    const finalExam = examData ? examData.filter((data: any) => data.examdateType == "F")[0] : null;
    const noInterest = statData.length ? statData[0].totalCount : 0;
    const percentage = noInterest ? (data.noOffer / (noInterest + 1)) * 100 : 100;
    const [isInterest, setIsInterest] = useState<any>();
    const { status } = useSession();

    const handleInterestClick = () => {
        const userData = JSON.parse(encryptStorage.getItem("userData") || "{}");
        const body = {
            studentId: userData.studentId,
            studentFaculty: userData.majorNameThai,
            subjectId: data.subjectId,
            section: data.section,
            term: data.eduTerm,
            year: data.eduYear,
        };
        try {
            fetch(`${config.apiUrlPrefix}/student/`, {
                method: "POST",
                // mode: "no-cors",
                body: JSON.stringify(body),
            })
                .then((res: any) => res.json())
                .then((data) => {
                    setIsInterest(data);
                    prop.setShowAlert(!prop.showAlert);
                });
        } catch (e) {
            console.error(e);
        }
    };

    const handleRemoveInterestClick = () => {
        try {
            fetch(`${config.apiUrlPrefix}/student/deleteSubjectInterest/${isInterest?._id}`, {
                method: "POST",
            }).then((res) => {
                setIsInterest(null);
                prop.setShowAlert(!prop.showAlert);
            });
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        const userData = JSON.parse(encryptStorage.getItem("userData") || "{}");
        try {
            userData
                ? fetch(`${config.apiUrlPrefix}/student/${userData.studentId}`, {
                      method: "GET",
                      headers: {
                          accept: "application/json",
                      },
                  })
                      .then((res) => res.json())
                      .then((studentIn) => {
                          const isInInterest = studentIn.filter(
                              (item: any) =>
                                  item.subjectId == data.subjectId &&
                                  item.section == data.section &&
                                  item.year == data.eduYear &&
                                  item.term == data.eduTerm
                          );
                          setIsInterest(isInInterest.length ? isInInterest[0] : null);
                      })
                : null;
        } catch (e) {
            console.error(e);
        }
    }, []);
    return (
        <div className="w-full p-4 grid grid-cols-1 gap-3 rounded-lg bg-slate-200 ">
            <div className="flex justify-between">
                <p className="font-bold text-md text-gray-800">ตอน {data.section}</p>
                <p
                    className="text-sm text-right bg-white p-2 border rounded-lg"
                    style={{ color: `hsl(${percentage > 100 ? 100.0 : percentage.toFixed(2)}, 70%, 40%)` }}
                >
                    โอกาส {percentage > 100 ? 100.0 : percentage.toFixed(2)} %
                </p>
            </div>
            <div>
                <div className="grid grid-cols-3 text-sm">
                    <p>ผู้เรียน</p>
                    <p>จำนวนที่นั่ง</p>
                    <p>จำนวนคนที่สนใจ</p>
                </div>
                <div className="grid grid-cols-3 text-sm break-words text-gray-600">
                    <p className="p-1">{data.studentGroup}</p>
                    <p className="p-1">{data.noOffer}</p>
                    <p className="p-1">{noInterest}</p>
                </div>
            </div>
            <div>
                <div className="grid grid-cols-3 text-sm">
                    <p>วัน/เวลาเรียน</p>
                    <p>ห้องเรียน</p>
                    <p>ผู้สอน</p>
                </div>
                <div className="grid grid-cols-3 gap-y-2 text-sm break-normal text-gray-600">
                    {dateData
                        ? dateData.map((date: any) => (
                              <>
                                  <p className="p-1">
                                      {date.classDateDesc} {timeFormatter(date.startTime) + " - " + timeFormatter(date.stopTime)}
                                  </p>
                                  {date.roomName ? (
                                      <p className="inline-flex p-1">
                                          <p className="py-1 mr-3">{date.roomName}</p>
                                          <a
                                              className="inline-flex py-1 px-2 bg-gray-300 w-fit h-fit rounded-lg"
                                              href={`/mapSearch/?search=${date.roomName}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                          >
                                              <p className="hidden md:flex">ค้นหาห้อง</p>
                                              <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  strokeWidth="1.5"
                                                  stroke="currentColor"
                                                  className="w-5 h-5 md:ml-1"
                                              >
                                                  <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                  />
                                              </svg>
                                          </a>
                                      </p>
                                  ) : (
                                      <p>-</p>
                                  )}
                                  <p className="p-1">{date.lecturerNameThai}</p>
                              </>
                          ))
                        : "ไม่มีข้อมูล"}
                </div>
            </div>

            <div>
                <div className="grid grid-cols-2 text-sm">
                    <p>สอบกลางภาค</p>
                    <p>สอบปลายภาค</p>
                </div>
                <div className="grid grid-cols-2 text-sm break-words text-gray-600">
                    {midExam ? (
                        <p className="p-1">{`${dateToTHstr(midExam.examDate.slice(0, 10))} เวลา ${timeFormatter(
                            midExam.examStartTime
                        )} - ${timeFormatter(midExam.examStopTime)} ห้อง ${midExam.roomName ? midExam.roomName : "-"}`}</p>
                    ) : (
                        <p>-</p>
                    )}
                    {finalExam ? (
                        <p className="p-1">{`${dateToTHstr(finalExam.examDate.slice(0, 10))} เวลา ${timeFormatter(
                            finalExam.examStartTime
                        )} - ${timeFormatter(finalExam.examStopTime)} ห้อง ${finalExam.roomName ? finalExam.roomName : "-"}`}</p>
                    ) : (
                        <p>-</p>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-1 px-auto">
                {status == "authenticated" ? (
                    !isInterest ? (
                        <button
                            className="text-blue-500 p-2 border border-blue-500 rounded-lg font-bold uppercase text-sm hover:bg-blue-500 hover:text-white focus:outline-none ease-linear transition-all duration-150"
                            type="button"
                            onClick={handleInterestClick}
                        >
                            เพิ่มเข้าในวิชาที่สนใจ
                        </button>
                    ) : (
                        <button
                            className=" text-orange-600 p-2 border border-orange-600 rounded-lg font-bold uppercase text-sm hover:bg-orange-500 hover:text-white focus:outline-none ease-linear transition-all duration-150"
                            type="button"
                            onClick={handleRemoveInterestClick}
                        >
                            ลบออกจากวิชาที่สนใจ
                        </button>
                    )
                ) : (
                    <a className="text-gray-500 text-center p-2 border border-gray-500 rounded-lg font-bold uppercase text-sm" href="/login">
                        กรุณาเข้าสู่ระบบ
                    </a>
                )}
            </div>
        </div>
    );
}
