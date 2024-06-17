"use client";

import { useEffect, useState } from "react";
import SubjectCard from "./components/card/subjectCard";
import SearchBar from "@/app/components/searchBar";
import facultyData from "@/public/static-data/faculty-data.json";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

const campusID: string = "01";

export interface TermYearJSON {
    term: string;
    year: string;
}

export default function SubjectSearchPage() {
    const seachParams = useSearchParams();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [faculty, setFaculty] = useState<any>(facultyData);
    const [selectFaculty, setSelectFaculty] = useState<any[]>([]);
    const [termYear, setTermYear] = useState<TermYearJSON>({
        term: "2",
        year: "2564",
    });
    const [searchInput, setSearchInput] = useState<string>("");
    const [courseData, setCourseData] = useState<any>(null);

    const handleSearchChange = (e: any) => {
        setSearchInput(e.target.value);
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const filterFac = selectFaculty.map((selFac: any) => selFac.facId);
        try {
            fetch(
                `https://api-gateway.psu.ac.th/Test/regist/SubjectOfferCampus/${campusID}/${termYear.term}/${termYear.year}?&keySearch=${searchInput}&offset=0&limit=1000`,
                {
                    method: "GET",
                    cache: "force-cache",
                    headers: {
                        credential: process.env.NEXT_PUBLIC_API_KEY,
                    },
                }
            )
                .then((res) => res.json())
                .then((json) => {
                    if (json.data) {
                        const data = json.data;
                        const filteredData = selectFaculty.length ? data.filter((course: any) => filterFac.includes(course.facId)) : data;
                        setCourseData(filteredData);
                    } 
                });
        } catch (e) {
            console.error(e);
        }
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

    const handleFilterClick = (e: any, mode: string) => {
        const key: number = e.target.id.split("-")[1];
        const tmpFaculty = [...faculty];
        const tmpSelectFaculty = [...selectFaculty];
        var selectFac;
        if (mode == "select") {
            selectFac = tmpFaculty.splice(key, 1);
            setFaculty(tmpFaculty);
            tmpSelectFaculty.push(selectFac[0]);
        } else {
            selectFac = tmpSelectFaculty.splice(key, 1);
            tmpFaculty.push(selectFac[0]);
            setFaculty(tmpFaculty);
        }

        setSelectFaculty(tmpSelectFaculty);
    };

    useEffect(() => {
        const subjectId = seachParams.get("subjectId");
        const term = seachParams.get("term") || "2";
        const year = seachParams.get("year") || "2564";
        try {
            subjectId || (term && year)
                ? fetch(
                      `https://api-gateway.psu.ac.th/Test/regist/SubjectOfferCampus/01/${term}/${year}${
                          subjectId ? `/${subjectId}` : ""
                      }?offset=0&limit=1000`,
                      {
                          method: "GET",
                          cache: "force-cache",
                          headers: {
                              credential: process.env.NEXT_PUBLIC_API_KEY,
                          },
                      }
                  )
                      .then((res) => res.json())
                      .then((json) => {
                          if (json.data.length) {
                              const data = json.data;
                              setCourseData(data);
                              setTermYear({ term: term || "", year: year || "" });
                          } 
                      })
                : null;
        } catch (e) {
            console.error(e);
        }
    }, []);

    return (
        <section>
            <div className="grid grid-rows-1 gap-4 mb-4">
                <div className="grid grid-cols-1 gap-y-4">
                    <div>
                        <p className="text-4xl font-bold text-right">ค้นหารายวิชา</p>
                    </div>
                    <div>
                        <SearchBar onSubmit={handleSubmit} onChange={handleSearchChange} />
                    </div>
                    <div className="flex justify-between space-x-2">
                        <div className="md:flex w-full justify-start max-w-fit overflow-x-auto no-scrollbar shadow-transparent">
                            {selectFaculty.map((fac: any, key: number) => (
                                <div className="hidden md:flex min-w-fit" key={fac.facId}>
                                    <input
                                        type="checkbox"
                                        id={`${fac.facNameThai}-${key}`}
                                        value={`${fac.facNameThai}`}
                                        className="hidden peer"
                                        onClick={(e) => handleFilterClick(e, "deselect")}
                                    ></input>
                                    <label
                                        htmlFor={`${fac.facNameThai}-${key}`}
                                        className="flex p-1 m-[0.1rem] text-black text-sm border-2 rounded-lg cursor-pointer peer-checked:border-[#2d505b] peer-checked:text-gray-60"
                                        style={{
                                            backgroundColor: `${fac.secondaryColor}`,
                                            borderColor: `${fac.primaryColor}`,
                                        }}
                                    >
                                        {fac.facNameThai}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="flex space-x-2">
                            <div className="min-w-[5.75rem]">
                                <select
                                    id="term"
                                    onChange={handleTermSelect}
                                    className="h-full bg-gray-50 p-1 border border-black text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full"
                                >
                                    <option value="2/64" selected={termYear.term == "2" && termYear.year == "2564"}>
                                        2/64
                                    </option>
                                    <option value="1/64" selected={termYear.term == "1" && termYear.year == "2564"}>
                                        1/64
                                    </option>
                                    <option value="3/63" selected={termYear.term == "3" && termYear.year == "2563"}>
                                        3/63
                                    </option>
                                    <option value="2/63" selected={termYear.term == "2" && termYear.year == "2563"}>
                                        2/63
                                    </option>
                                    <option value="1/63" selected={termYear.term == "1" && termYear.year == "2563"}>
                                        1/63
                                    </option>
                                </select>
                            </div>
                            <div className="">
                                <button
                                    className="relative h-full p-[5px] bg-gray-50 border border-black rounded-lg"
                                    onClick={() => setShowModal(!showModal)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                                        />
                                    </svg>
                                    <div className="absolute inline-flex items-center justify-center w-5 h-5 -top-3 -right-2 text-xs font-bold text-white bg-blue-950 rounded-full">
                                        {selectFaculty.length}
                                    </div>
                                </button>
                            </div>
                        </div>
                        <AnimatePresence>
                            {showModal && (
                                <>
                                    <div className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[10100] outline-none overscroll-auto">
                                        <div className="relative m-auto max-w-3xl">
                                            <motion.div
                                                className="grid grid-cols-1 gap-2 border-0 rounded-lg shadow-lg relative bg-white outline-none focus:outline-none"
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.75,
                                                }}
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
                                                <div className="items-start justify-between overflow-hidden p-5 border-b border-solid">
                                                    <div className="col-span-9 flex flex-wrap">
                                                        {selectFaculty.map((fac: any, key: number) => (
                                                            <div key={key}>
                                                                <input
                                                                    type="checkbox"
                                                                    id={`${fac.facNameThai}-${key}`}
                                                                    value={`${fac.facNameThai}`}
                                                                    className="hidden peer"
                                                                    onClick={(e) => handleFilterClick(e, "deselect")}
                                                                ></input>
                                                                <label
                                                                    htmlFor={`${fac.facNameThai}-${key}`}
                                                                    className="flex p-1 m-[0.1rem] text-black text-sm border-2 rounded-lg cursor-pointer peer-checked:border-[#2d505b] peer-checked:text-gray-60"
                                                                    style={{
                                                                        backgroundColor: `${fac.secondaryColor}`,
                                                                        borderColor: `${fac.primaryColor}`,
                                                                    }}
                                                                >
                                                                    {fac.facNameThai}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="items-start justify-between overflow-hidden p-5">
                                                    <div className="col-span-9 flex flex-wrap">
                                                        {faculty.map((fac: any, key: number) => (
                                                            <div key={key}>
                                                                <input
                                                                    type="checkbox"
                                                                    id={`${fac.facNameThai}-${key}`}
                                                                    value={`${fac.facNameThai}`}
                                                                    className="hidden peer"
                                                                    onClick={(e) => handleFilterClick(e, "select")}
                                                                ></input>
                                                                <label
                                                                    htmlFor={`${fac.facNameThai}-${key}`}
                                                                    className="flex p-1 m-[0.1rem] text-black text-sm border-2 rounded-lg cursor-pointer peer-checked:border-[#2d505b] peer-checked:text-gray-60"
                                                                    style={{
                                                                        backgroundColor: `${fac.secondaryColor}`,
                                                                        borderColor: `${fac.primaryColor}`,
                                                                    }}
                                                                >
                                                                    {fac.facNameThai}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-end p-1">
                                                    <button
                                                        className=" text-red-500 p-4 rounded-lg font-bold uppercase text-sm outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
                                                        type="button"
                                                        onClick={() => setShowModal(!showModal)}
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
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {courseData ? (
                courseData.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-20">
                        {courseData.map((course: any, key: number) => (
                            <SubjectCard key={course.subjectId + "" + key} data={course} />
                        ))}
                    </div>
                ) : (
                    <p className="w-full text-center text-lg text-gray-500 mt-4">ไม่มีข้อมูล</p>
                )
            ) : (
                <div className="w-full h-full">
                    <svg
                        aria-hidden="true"
                        className="size-16 m-auto text-gray-200 animate-spin fill-blue-800"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                </div>
            )}
        </section>
    );
}
