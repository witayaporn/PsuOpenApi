'use client'
import { useEffect, useState } from "react"
import SectionCard from "./sectionCard"
import facultyData from '@/public/faculty-data.json'
import { AnimatePresence, motion } from "framer-motion"

export default function SubjectCard(prop: any) {
    const data = prop.data
    const subjectNameEN = data.subjectCode + " " + data.subjectNameEng
    const subjectShortNameEN = data.subjectCode + " " + data.shortNameEng

    const [showModal, setShowModal] = useState(false);
    const [courseDetail, setCourseDetail] = useState({});
    const [courseSection, setCourseSection] = useState([]);
    const [sectionDate, setSectionDate] = useState([]);
    const handleCardClick = () => {
        const html = document.getElementsByTagName('html')[0]
        if (!showModal) {
            fetch(`https://api-gateway.psu.ac.th/Test/regist/Subject/${data.subjectId}?campusID=&offset=0&limit=100`, {
                method: 'GET',
                cache: 'force-cache',
                headers: {
                    "credential": process.env.NEXT_PUBLIC_API_KEY
                }
            })
                .then((res) => res.json())
                .then((data) => setCourseDetail(data.data[0]))

            fetch(`https://api-gateway.psu.ac.th/Test/regist/SectionOfferCampus/01/${data.eduTerm}/${data.eduYear}/${data.subjectId}/?section=&offset=0&limit=100`, {
                method: 'GET',
                cache: 'force-cache',
                headers: {
                    "credential": process.env.NEXT_PUBLIC_API_KEY
                }
            })
                .then((res) => res.json())
                .then((data) => setCourseSection(data.data))

            fetch(`https://api-gateway.psu.ac.th/Test/regist/SectionClassdateCampus/01/${data.eduTerm}/${data.eduYear}/${data.subjectId}/?section=&offset=0&limit=100`, {
                method: 'GET',
                cache: 'force-cache',
                headers: {
                    "credential": process.env.NEXT_PUBLIC_API_KEY
                }
            })
                .then((res) => res.json())
                .then((data) => setSectionDate(data.data))

            html.classList.add("overflow-hidden")
        } else {
            html.classList.remove("overflow-hidden")
        }
        setShowModal(!showModal)
    }

    const faculty = facultyData.filter((fac) => fac.facId == data.facId)[0]
    const facColor = {
        "primary": faculty.primaryColor,
        "secondary": faculty.secondaryColor
    }

    return (
        <>
            {/* {console.log(facColor)} */}
            <a 
                className="md:h-44 pl-2 border rounded-lg shadow hover:shadow-md hover:scale-[1.01] transition-all" 
                style={{ background: `linear-gradient(to bottom, ${facColor.primary}, ${facColor.secondary})`, }} 
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
                {showModal && (
                    <>
                        <div className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[10100] outline-none overscroll-auto">
                            <div className="relative w-full m-auto max-w-3xl">
                                <motion.div
                                    className="w-full h-fit grid grid-cols-1 gap-2 border-0 rounded-lg shadow-lg relative bg-white outline-none focus:outline-none"
                                    initial={{ opacity: 0, scale: 0.75 }}
                                    animate={{ opacity: 1, scale: 1, transition: { ease: "easeOut", duration: 0.10 } }}
                                    exit={{ opacity: 0, scale: 0.75, transition: { ease: "easeIn", duration: 0.10 } }}
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
                                        <div className="flex-auto">
                                            <p className="font-bold">รายละเอียด</p>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 text-sm">
                                                <p>ภาคการศึกษา</p>
                                                <p>{data.eduTerm + '/' + data.eduYear}</p>
                                                <p>ภาควิชา</p>
                                                <p>{data.deptNameThai}</p>
                                                <p>คณะ</p>
                                                <p>{data.facNameThai}</p>
                                                <p>วิทยาเขต</p>
                                                <p>{data.campusNameThai}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-bold">คำอธิบายรายวิชา</p>
                                            <p className="text-gray-900 text-sm leading-relaxed">
                                                {/* {console.log(courseDetail)} */}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                            {console.log(sectionDate)}
                                            <p className="font-bold">ตอน</p>
                                            {courseSection ? courseSection.map((section: any, key: number) => {
                                                const dateData = sectionDate ? sectionDate.filter((data) => data.section == section.section) : sectionDate
                                                return <SectionCard key={key} data={[section, dateData]} />
                                            }) : "ไม่มีข้อมูล"}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end p-1 border-t border-solid border-blueGray-200 rounded-b">
                                        <button
                                            className=" text-red-500 p-4 rounded-lg font-bold uppercase text-sm outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={handleCardClick}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-[10000] bg-black"></div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}