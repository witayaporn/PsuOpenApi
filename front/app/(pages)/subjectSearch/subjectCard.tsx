'use client'
import { useState } from "react"
export default function SubjectCard(prop: any) {
    const data = prop.data
    const subjectNameTH = data.subjectCode + " " + data.subjectNameThai
    const subjectNameEN = data.subjectCode + " " + data.subjectNameEng
    const subjectShortNameEN = data.subjectCode + " " + data.shortNameEng

    const [showModal, setShowModal] = useState(false);
    const [courseDetail, setCourseDetail] = useState({});
    const [courseDate, setCourseDate] = useState([]);
    const handleCardClick = () => {
        const html = document.getElementsByTagName('html')[0]
        if (!showModal) {
            fetch(`https://api-gateway.psu.ac.th/Test/regist/Subject/${data.subjectId}?campusID=&offset=0&limit=100`, {
                method: 'GET',
                headers: {
                    "credential": process.env.NEXT_PUBLIC_API_KEY
                }
            })
            .then((res) => res.json())
            .then((data) => setCourseDetail(data.data[0]))

            fetch(`https://api-gateway.psu.ac.th/Test/regist/SectionClassdateCampus/${data.campusId}/${data.eduTerm}/${data.eduYear}/${data.subjectId}?section=&offset=0&limit=100`, {
                method: 'GET',
                headers: {
                    "credential": process.env.NEXT_PUBLIC_API_KEY
                }
            })
            .then((res) => res.json())
            .then((data) => setCourseDate(data.data))

            html.classList.add("overflow-hidden")
        } else {
            html.classList.remove("overflow-hidden")
        }
        setShowModal(!showModal)
        console.log(data)
    }

    return (
        <>
            <a className="p-4 md:h-44 bg-emerald-100 rounded-lg hover:shadow hover:scale-[1.01] transition-all " onClick={handleCardClick}>
                <div className="grid grid-cols-1 gap-1">
                    <p className="font-bold text-green-950">{subjectShortNameEN}</p>
                    <p className="text-green-800 truncate max-h-6">{data.subjectNameThai}</p>
                    <p className="text-gray-500">{data.credit}</p>
                </div>
            </a>
            {showModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[110] outline-none overscroll-auto">
                        <div className="relative w-full my-6 mx-auto max-w-3xl">
                            <div className="w-full grid grid-cols-1 gap-2 border-0 rounded-lg shadow-lg relative bg-white outline-none focus:outline-none">
                                <div className="items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                    <p className="font-bold text-lg text-green-950">{subjectNameEN}</p>
                                    <p className="text-green-800">{data.subjectNameThai}</p>
                                    <p className="text-gray-500">{data.credit}</p>
                                </div>
                                <div className="relative px-5 flex-auto">
                                    <p className="font-bold">รายละเอียด</p>
                                    <p className="text-gray-900 text-md leading-relaxed">
                                        {/* {console.log(courseDetail)} */}
                                        {courseDetail.subjectDescThai ? courseDetail.subjectDescThai : "ไม่มีข้อมูล"}
                                    </p>
                                </div>
                                <div className="relative px-5 flex-auto">
                                    <p className="font-bold">ตอน</p>
                                    {courseDate ? courseDate.map((section, key) => <p>Section {section.section}</p>) : "ไม่มีข้อมูล"}
                                </div>
                                <div className="flex items-center justify-end p-5 border-t border-solid border-blueGray-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={handleCardClick}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-[100] bg-black"></div>
                </>
            ) : null}
        </>
    )
}