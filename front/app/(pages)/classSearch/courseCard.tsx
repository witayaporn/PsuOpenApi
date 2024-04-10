'use client'
import { useState } from "react"
export default function CourseCard(prop: any) {
    const data = prop.data
    const subjectNameTH = data.subjectCode + " " + data.subjectNameThai
    const subjectNameEN = data.subjectCode + " " + data.subjectNameEng

    const [showModal, setShowModal] = useState(false);
    const handleCardClick = () => {
        const html = document.getElementsByTagName('html')[0]
        !showModal ? html.classList.add("overflow-hidden") : html.classList.remove("overflow-hidden")
        setShowModal(!showModal)
        console.log(data)
    }

    return (
        <>
            <a className="p-4 md:h-44 bg-emerald-100 rounded-lg hover:shadow hover:scale-[1.01] transition-all " onClick={handleCardClick}>
                <div className="grid grid-cols-1 gap-1">
                    <p className="font-bold text-green-950">{subjectNameEN}</p>
                    <p className="text-green-800">{data.subjectNameThai}</p>
                    <p className="text-gray-500">{data.credit}</p>
                </div>
            </a>
            {showModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[110] outline-none overscroll-auto">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            <div className="grid grid-cols-1 border-0 rounded-lg shadow-lg relative w-full bg-white outline-none focus:outline-none">
                                <div className="items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                    <p className="font-bold text-green-950">{subjectNameEN}</p>
                                    <p className="text-green-800">{data.subjectNameThai}</p>
                                    <p className="text-gray-500">{data.credit}</p>
                                </div>
                                <div className="relative p-5 flex-auto">
                                    <p className="text-gray-900 text-lg leading-relaxed">
                                    </p>
                                </div>
                                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
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