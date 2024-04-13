'use client'

import { useEffect, useState } from "react";
import SubjectCard from "./subjectCard";

export default function SubjectSearchPage() {
    const campusID: string = "01"
    const [termYear, setTermYear] = useState({
        "term": "2",
        "year": "2564"
    })
    useEffect(() => {
    }, [])

    const [searchInput, setSearchInput] = useState("")
    const handleSearchChange = (e: any) => {
        console.log(e.target.value)
        setSearchInput(e.target.value)
    }

    const [courseData, setCourseData] = useState([])
    const handleSubmit = (e: any) => {
        e.preventDefault()
        fetch(`https://api-gateway.psu.ac.th/Test/regist/SubjectOfferCampus/${campusID}/${termYear.term}/${termYear.year}?facID=&deptID=&keySearch=${searchInput}&offset=0&limit=1000`, {
            method: 'GET',
            headers: {
                "credential": process.env.NEXT_PUBLIC_API_KEY
            }
        })
            .then((res) => res.json())
            .then((data) => setCourseData(data.data))
    }

    const [termSelect, setTermSelect] = useState("")
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
    return (
        <section>
            <div className="grid grid-rows-1 gap-4 mb-4">
                <div className="grid grid-rows-3 gap-4">
                    <div>
                        <p className="text-3xl font-bold text-right">Subject Search</p>
                    </div>
                    <div>
                        <form onSubmit={handleSubmit} className="grid grid-cols-6 gap-1">
                            <input type="text" onChange={handleSearchChange} className="col-span-5 bg-gray-50 border border-gray-700 text-md rounded-xl focus:border-[#2d505b] block w-full p-2.5"></input>
                            <button type="submit" onClick={handleSubmit} className="w-full h-full bg-[#2d505b] hover:bg-green-900 text-white py-2 px-4 rounded-xl ">
                                <svg className="w-6 h-6 sm:hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                                <p className="hidden sm:inline">Search</p>
                            </button>
                        </form>
                    </div>
                    <div>
                        <div className="flex space-x-2">
                            <div>
                                <input type="checkbox" id="option-1" value="" className="hidden peer"></input>
                                <label htmlFor="option-1" className="inline-flex p-1 text-black bg-green-100 border-2 border-green-200 rounded-lg cursor-pointer peer-checked:border-[#2d505b] peer-checked:text-gray-60">
                                    Art
                                </label>
                            </div>
                            <div>
                                <input type="checkbox" id="option-2" value="" className="hidden peer"></input>
                                <label htmlFor="option-2" className="inline-flex p-1 text-black bg-red-100 border-2 border-red-200 rounded-lg cursor-pointer peer-checked:border-[#2d505b] peer-checked:text-gray-60">
                                    Mathematic
                                </label>
                            </div>
                            <div>
                                <input type="checkbox" id="option-3" value="" className="hidden peer"></input>
                                <label htmlFor="option-3" className="inline-flex p-1 text-black bg-yellow-100 border-2 border-yellow-200 rounded-lg cursor-pointer peer-checked:border-[#2d505b] peer-checked:text-gray-60">
                                    Technologies
                                </label>
                            </div>
                            <div>
                                <input type="checkbox" id="option-4" value="" className="hidden peer"></input>
                                <label htmlFor="option-4" className="inline-flex p-1 text-black bg-blue-100 border-2 border-blue-200 rounded-lg cursor-pointer peer-checked:border-[#2d505b] peer-checked:text-gray-60">
                                    Literature
                                </label>
                            </div>
                            <div className="">
                                <select id="term" onChange={handleTermSelect} className="bg-gray-50 p-1 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full">
                                    <option selected>2/64</option>
                                    <option value="1/64">1/64</option>
                                    <option value="3/63">3/63</option>
                                    <option value="2/63">2/63</option>
                                    <option value="1/63">1/63</option>
                                </select>
                            </div>
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