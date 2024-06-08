"use client";
import { useEffect, useState } from "react";
import BarChart from "./barChart";
import SectionCard from "./sectionCard";
import CommentModal from "./commentModal";
import { Comment } from "./comment";
import SuccessModal from "@/app/components/successModal";
import facultyData from "@/public/faculty-data.json";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { ChartData } from "chart.js";
import config from "@/app/config";

export default function SubjectCard(prop: any) {
    const data = prop.data;
    const subjectNameEN = data.subjectCode + " " + data.subjectNameEng;
    const subjectShortNameEN = data.subjectCode + " " + data.shortNameEng;

    const router = useRouter();
    const urlParam = useSearchParams();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showSubjectDesc, setShowSubjectDesc] = useState<boolean>(false);
    const [showComment, setShowComment] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState<boolean>(true);
    const [examDate, setExamDate] = useState<any[]>([]);
    const [courseSection, setCourseSection] = useState<any[]>([]);
    const [sectionDate, setSectionDate] = useState<any[]>([]);
    const [subjectStatSerialize, setSubjectStatSerialize] = useState<ChartData>({
        labels: [],
        datasets: [],
    });
    const [subjectStat, setSubjectStat] = useState<any[]>([]);
    const [subject, setSubject] = useState<any>();
    const [subjectPreviewComment, setSubjectPreviewComment] = useState<any>({});

    const fetchSubjectDetail = () => {
        try {
            fetch(`https://api-gateway.psu.ac.th/Test/regist/SubjectCampus/01/${data.subjectId}?offset=0&limit=1`, {
                method: "GET",
                cache: "force-cache",
                headers: {
                    credential: process.env.NEXT_PUBLIC_API_KEY,
                },
            })
                .then((res) => res.json())
                .then((data) => setSubject(data.data));
        } catch (e) {
            console.error(e);
        }
    };

    const fetchSectionOffer = () => {
        try {
            fetch(
                `https://api-gateway.psu.ac.th/Test/regist/SectionOfferCampus/01/${data.eduTerm}/${data.eduYear}/${data.subjectId}/?section=&offset=0&limit=100`,
                {
                    method: "GET",
                    cache: "force-cache",
                    headers: {
                        credential: process.env.NEXT_PUBLIC_API_KEY,
                    },
                }
            )
                .then((res) => res.json())
                .then((data) => setCourseSection(data.data));
        } catch (e) {
            console.error(e);
        }
    };

    const fetchSectionClassDate = () => {
        try {
            fetch(
                `https://api-gateway.psu.ac.th/Test/regist/SectionClassdateCampus/01/${data.eduTerm}/${data.eduYear}/${data.subjectId}/?section=&offset=0&limit=100`,
                {
                    method: "GET",
                    cache: "force-cache",
                    headers: {
                        credential: process.env.NEXT_PUBLIC_API_KEY,
                    },
                }
            )
                .then((res) => res.json())
                .then((data) => setSectionDate(data.data));
        } catch (e) {
            console.error(e);
        }
    };

    const fetchSectionExamDate = () => {
        try {
            fetch(
                `https://api-gateway.psu.ac.th/Test/regist/SectionExamdateCampus/01/${data.eduTerm}/${data.eduYear}/${data.subjectId}?section=&offset=0&limit=100`,
                {
                    method: "GET",
                    cache: "force-cache",
                    headers: {
                        credential: process.env.NEXT_PUBLIC_API_KEY,
                    },
                }
            )
                .then((res) => res.json())
                .then((data) => setExamDate(data.data));
        } catch (e) {
            console.error(e);
        }
    };

    const fetchSubjectStat = () => {
        try {
            fetch(`${config.apiUrlPrefix}/student/getSubjectStat/${data.subjectId}?year=${data.eduYear}&term=${data.eduTerm}`, {
                method: "GET",
                headers: {
                    accept: "application/json",
                },
            })
                .then((res) => res.json())
                .then((stat) => {
                    if (stat.length) {
                        var labels: string[] = [];
                        const datasets = stat.map((data: any) => {
                            const label = "ตอน " + data._id;
                            const dataset = data.summary.map((item: any) => {
                                labels.includes(item.studentFaculty) ? null : labels.push(item.studentFaculty);
                                return { x: item.studentFaculty, y: item.count };
                            });
                            return { data: dataset, label: label };
                        });
                        setSubjectStat(stat);
                        setSubjectStatSerialize({ labels: labels, datasets: datasets });
                    } else {
                        setSubjectStatSerialize({ labels: [], datasets: [] });
                    }
                });
        } catch (e) {
            console.error(e);
        }
    };

    const fetchSubjectPreviewComment = () => {
        try {
            fetch(`${config.apiUrlPrefix}/comment/getPreviewComment/${data.subjectId}`, {
                method: "GET",
                headers: {
                    accept: "application/json",
                },
            })
                .then((res) => res.json())
                .then((comment) => {
                    if (comment.length) {
                        setSubjectPreviewComment(comment[0]);
                    }
                });
        } catch (e) {
            console.error(e);
        }
    };

    const handleCardClick = () => {
        const html = document.getElementsByTagName("html")[0];
        if (!showModal) {
            try {
                Promise.all([
                    fetchSubjectDetail(),
                    fetchSectionOffer(),
                    fetchSectionClassDate(),
                    fetchSectionExamDate(),
                    fetchSubjectStat(),
                    fetchSubjectPreviewComment(),
                ]);
            } catch (e) {
                console.error(e);
            }

            html.classList.add("overflow-hidden");
            router.push(`/subjectSearch/?subjectId=${data.subjectId}&term=${data.eduTerm}&year=${data.eduYear}&modal=open`, undefined, {
                shallow: true,
            });
        } else {
            html.classList.remove("overflow-hidden");
            router.push("/subjectSearch", undefined, { shallow: true });
        }
        setShowModal(!showModal);
    };

    const faculty = facultyData.filter((fac) => fac.facId == data.facId)[0];
    const facColor = {
        primary: faculty?.primaryColor,
        secondary: faculty?.secondaryColor,
    };

    useEffect(() => {
        const modal = urlParam.get("modal");
        modal == "open" ? handleCardClick() : null;
    }, []);

    return (
        <>
            <a
                className="md:h-44 pl-2 border rounded-lg shadow hover:shadow-md hover:scale-[1.01] transition-all"
                style={{
                    background: `linear-gradient(to bottom, ${facColor.primary}, ${facColor.secondary})`,
                }}
                onClick={handleCardClick}
            >
                <div className="p-4 h-full bg-white rounded-r-md">
                    <p className="font-bold text-green-950">{subjectShortNameEN}</p>
                    <p className="text-gray-700 truncate max-h-6">{data.subjectNameThai}</p>
                    <p className="text-gray-500 inline md:block">{data.credit}</p>
                    <p className="inline-flex py-1 px-2 mx-2 md:mt-2 md:m-0 text-black text-xs bg-gray-100 border-gray-400 rounded-lg">
                        {data.subjectTypeDesc}
                    </p>
                </div>
            </a>
            <AnimatePresence>
                {showModal && showAlert && (
                    <>
                        <div className="justify-center flex overflow-x-hidden overflow-y-scroll fixed inset-0 z-[10100] outline-none overscroll-auto">
                            <div className="relative w-full m-auto max-w-3xl">
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
                                    <div className="items-start justify-between overflow-hidden p-5 border-b border-solid rounded-t">
                                        <button
                                            className="absolute top-1 right-0 px-2 text-gray-500 hover:bg-gray-300 hover:text-red-500 rounded-lg font-bold uppercase text-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={handleCardClick}
                                        >
                                            X
                                        </button>
                                        <p className="font-bold text-lg text-green-950">{subjectNameEN}</p>
                                        <p className="text-gray-700">{data.subjectNameThai}</p>
                                        <p className="text-gray-500 inline md:block">{data.credit}</p>
                                        <p className="inline-flex py-1 px-2 mx-2 md:mt-2 md:m-0 text-black text-xs bg-gray-100 border-gray-400 rounded-lg">
                                            {data.subjectTypeDesc}
                                        </p>
                                    </div>
                                    <div className="relative px-5 grid grid-cols-1 gap-y-2">
                                        <div className="flex-auto pb-3 border-b border-solid">
                                            <p className="font-bold">รายละเอียด</p>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 text-sm">
                                                <p>ภาคการศึกษา</p>
                                                <p className="text-gray-700">{data.eduTerm + "/" + data.eduYear}</p>
                                                <p>ภาควิชา</p>
                                                <p className="text-gray-700">{data.deptNameThai}</p>
                                                <p>คณะ</p>
                                                <p className="text-gray-700">{data.facNameThai}</p>
                                                <p>วิทยาเขต</p>
                                                <p className="text-gray-700">{data.campusNameThai}</p>
                                            </div>
                                        </div>

                                        <div className="pb-3 border-b border-solid">
                                            <div className="flex justify-between mb-2">
                                                <p className="font-bold">คำอธิบายรายวิชา</p>
                                                <button
                                                    className="text-sm px-2 rounded-md border border-blue-900"
                                                    onClick={() => setShowSubjectDesc(!showSubjectDesc)}
                                                >
                                                    {showSubjectDesc ? "ซ่อน" : "เเสดง"}
                                                </button>
                                            </div>
                                            <AnimatePresence>
                                                {showSubjectDesc && (
                                                    <motion.p
                                                        className="text-gray-900 bg-gray-100 text-sm p-2 border-2 rounded-lg break-words"
                                                        initial={{
                                                            y: -10,
                                                            opacity: 0,
                                                        }}
                                                        animate={{
                                                            y: 0,
                                                            opacity: 1,
                                                            transition: {
                                                                ease: "backOut",
                                                                duration: 0.3,
                                                            },
                                                        }}
                                                        exit={{
                                                            y: -5,
                                                            opacity: 0,
                                                            // scale: 0.75,
                                                            transition: {
                                                                ease: "backIn",
                                                                duration: 0.2,
                                                            },
                                                        }}
                                                    >
                                                        {subject[0].subjectDescThai ? subject[0].subjectDescThai : "ไม่มีข้อมูล"}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <div className="pb-3 border-b border-solid">
                                            <p className="font-bold">ข้อมูลจำนวนนักศึกษาที่สนใจ</p>
                                            <p className="text-gray-900 text-xs">
                                                <BarChart data={subjectStatSerialize} showAlert={showAlert} />
                                            </p>
                                        </div>

                                        <div className="pb-2 border-b border-solid">
                                            <p className="font-bold">ความคิดเห็นต่อรายวิชา</p>
                                            <div className="px-2">
                                                {Object.keys(subjectPreviewComment).length ? (
                                                    <Comment
                                                        data={subjectPreviewComment}
                                                        onReply={() => setShowComment(true)}
                                                        onEdit={() => setShowComment(true)}
                                                        onDelete={() => setShowComment(true)}
                                                    />
                                                ) : (
                                                    <p className="w-full text-gray-500 text-center p-2">ไม่มีความคิดเห็นต่อรายวิชา</p>
                                                )}
                                                <button
                                                    className="w-full m-auto p-1 border rounded-lg hover:bg-gray-100 transition-all"
                                                    onClick={() => setShowComment(!showComment)}
                                                >
                                                    {Object.keys(subjectPreviewComment).length ? "ดูความคิดเห็น" : "เเสดงความเห็นต่อรายวิชา"}
                                                </button>
                                            </div>
                                            <AnimatePresence>
                                                {showComment && (
                                                    <CommentModal
                                                        subjectId={data.subjectId}
                                                        showComment={showComment}
                                                        setShowComment={setShowComment}
                                                        hasComment={Object.keys(subjectPreviewComment).length > 0}
                                                    />
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <div className="grid grid-cols-1 gap-2">
                                            <p className="font-bold">ตอน</p>
                                            {courseSection
                                                ? courseSection.map((section: any, key: number) => {
                                                      const dateData = sectionDate
                                                          ? sectionDate.filter((data: any) => data.section == section.section)
                                                          : sectionDate;
                                                      const examData = examDate
                                                          ? examDate.filter((data: any) => data.section == section.section)
                                                          : examDate;
                                                      const statData = subjectStat
                                                          ? subjectStat.filter((data: any) => data?._id == section.section)
                                                          : {};
                                                      return (
                                                          <SectionCard
                                                              key={key}
                                                              data={[section, dateData, examData, statData]}
                                                              setShowAlert={setShowAlert}
                                                              showAlert={showAlert}
                                                          />
                                                      );
                                                  })
                                                : "ไม่มีข้อมูล"}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end p-1 border-t border-solid border-blueGray-200 rounded-b">
                                        <button
                                            className=" text-red-500 p-4 rounded-lg font-bold uppercase text-sm outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={handleCardClick}
                                        >
                                            ปิด
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-[10000] bg-black"></div>
                    </>
                )}
                {!showAlert && (
                    <SuccessModal
                        onClose={() => {
                            setShowAlert(!showAlert);
                            fetchSubjectStat();
                        }}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
