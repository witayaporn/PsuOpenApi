'use client'

import { useEffect, useState } from "react";
import SubjectCard from "./subjectCard";
import SearchBar from "@/app/components/searchBar";
import facultyData from "@/public/faculty-data.json"
import { AnimatePresence, motion } from "framer-motion"

export default function SubjectSearchPage() {
    const [showModal, setShowModal] = useState(false)
    const [faculty, setFaculty] = useState(facultyData)
    const [selectFaculty, setSelectFaculty] = useState([])
    const campusID: string = "01"
    const [termYear, setTermYear] = useState({
        "term": "2",
        "year": "2564"
    })

    const [searchInput, setSearchInput] = useState("")
    const handleSearchChange = (e: any) => {
        console.log(e.target.value)
        setSearchInput(e.target.value)
    }

    const [courseData, setCourseData] = useState([])
    const handleSubmit = (e: any) => {
        e.preventDefault()
        const filterFac = selectFaculty.map((selFac: any) => selFac.facId)
        fetch(`https://api-gateway.psu.ac.th/Test/regist/SubjectOfferCampus/${campusID}/${termYear.term}/${termYear.year}?facID=&deptID=&keySearch=${searchInput}&offset=0&limit=1000`, {
            method: 'GET',
            cache: 'force-cache',
            headers: {
                "credential": process.env.NEXT_PUBLIC_API_KEY
            }
        })
            .then((res) => res.json())
            .then((json) => {
                const data = json.data
                const filteredData = filterFac.length ? data.filter((course: any) => filterFac.includes(course.facId)) : data
                setCourseData(filteredData)
            })
        
    }

    const handleTermSelect = (e: any) => {
        e.preventDefault()
        console.log(e.target.value)
        console.log(e.target.value.split('/'))
        const splitData = e.target.value.split('/')
        const newTermYear = {
            'term': splitData[0],
            'year': "25" + splitData[1]
        }
        setTermYear(newTermYear)
    }

    const handleFilterClick = (e: any) => {
        console.log(e.target.id.split('-')[1])
        const key: number = e.target.id.split('-')[1]
        const tmpFaculty = [...faculty]
        const tmpSelectFaculty = [...selectFaculty]
        const selectFac = tmpFaculty.splice(key, 1)
        setFaculty(tmpFaculty)
        tmpSelectFaculty.push(selectFac[0])
        setSelectFaculty(tmpSelectFaculty)

    }

    const handleDeSelectClick = (e: any) => {
        console.log(e.target.id.split('-')[1])
        const key: number = e.target.id.split('-')[1]
        const tmpFaculty = [...faculty]
        const tmpSelectFaculty = [...selectFaculty]
        const selectFac = tmpSelectFaculty.splice(key, 1)
        tmpFaculty.push(selectFac[0])
        setFaculty(tmpFaculty)
        setSelectFaculty(tmpSelectFaculty)
    }
    return (
        <section>
            <div className="grid grid-rows-1 gap-4 mb-4">
                <div className="grid grid-cols-1 gap-y-4">
                    <div>
                        <p className="text-4xl font-bold text-right">Subject Search</p>
                    </div>
                    <div>
                        <SearchBar onSubmit={handleSubmit} onChange={handleSearchChange} />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <div className="col-span-8 flex space-x-2 overflow-x-hidden">
                        </div>
                        <div className="col-span-2">
                            <select id="term" onChange={handleTermSelect} className="h-full bg-gray-50 p-1 border border-black text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full">
                                <option value="2/64">2/64</option>
                                <option value="1/64">1/64</option>
                                <option value="3/63">3/63</option>
                                <option value="2/63">2/63</option>
                                <option value="1/63">1/63</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <button className="h-full p-[5px] bg-gray-50 border border-black rounded-lg" onClick={() => setShowModal(!showModal)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                                </svg>
                            </button>
                            <AnimatePresence>
                                {showModal && (
                                    <>
                                        <div className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[10100] outline-none overscroll-auto">
                                            <div className="relative m-auto max-w-3xl">
                                                <motion.div
                                                    className="grid grid-cols-1 gap-2 border-0 rounded-lg shadow-lg relative bg-white outline-none focus:outline-none"
                                                    initial={{ opacity: 0, scale: 0.75 }}
                                                    animate={{ opacity: 1, scale: 1, transition: { ease: "easeOut", duration: 0.10 } }}
                                                    exit={{ opacity: 0, scale: 0.75, transition: { ease: "easeIn", duration: 0.10 } }}
                                                >
                                                    <div className="items-start justify-between overflow-hidden p-5 border-b border-solid rounded-t">
                                                        <div className="col-span-9 flex flex-wrap space-x-2 space-y-1">
                                                            {
                                                                selectFaculty.map((fac: any, key: number) => (
                                                                    <div key={key}>
                                                                        <input type="checkbox" id={`${fac.facNameThai}-${key}`} value={`${fac.facNameThai}`} className="hidden peer" onClick={handleDeSelectClick}></input>
                                                                        <label
                                                                            for={`${fac.facNameThai}-${key}`}
                                                                            className="flex p-1 text-black text-sm border-2 rounded-lg cursor-pointer peer-checked:border-[#2d505b] peer-checked:text-gray-60"
                                                                            style={{ backgroundColor: `${fac.secondaryColor}`, borderColor: `${fac.primaryColor}` }}
                                                                        >
                                                                            {fac.facNameThai}
                                                                        </label>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="items-start justify-between overflow-hidden p-5 border-b border-solid rounded-t">
                                                        <div className="col-span-9 flex flex-wrap space-x-2 space-y-1">
                                                            {
                                                                faculty.map((fac: any, key: number) => (
                                                                    <div>
                                                                        <input type="checkbox" id={`${fac.facNameThai}-${key}`} value={`${fac.facNameThai}`} className="hidden peer" onClick={handleFilterClick}></input>
                                                                        <label
                                                                            for={`${fac.facNameThai}-${key}`}
                                                                            className="flex p-1 text-black text-sm border-2 rounded-lg cursor-pointer peer-checked:border-[#2d505b] peer-checked:text-gray-60"
                                                                            style={{ backgroundColor: `${fac.secondaryColor}`, borderColor: `${fac.primaryColor}` }}
                                                                        >
                                                                            {fac.facNameThai}
                                                                        </label>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-end p-1">
                                                        <button
                                                            className=" text-red-500 p-4 rounded-lg font-bold uppercase text-sm outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                                                            type="button"
                                                            onClick={() => setShowModal(!showModal)}
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
                        </div>
                       
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {
                    courseData ? courseData.map((course, key) => <SubjectCard key={key} data={course} />) : <p>ไม่มีข้อมูล</p>
                }
            </div>
        </section>
    )
}