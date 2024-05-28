"use client";

import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function HeadNavbar() {
    const router = usePathname();
    const [userData, setUserData] = useState<any>();
    const [isShowDropdown, setIsShowDropdown] = useState<boolean>(false);
    const [studentImg, setStudentImg] = useState<any>();
    const { data: session, status } = useSession();

    const handleSignOut = () => {
        sessionStorage.removeItem("userData");
        if (sessionStorage.getItem("userData") == null) {
            signOut();
        }
    };

    useEffect(() => {
        if (sessionStorage.getItem("userData") == null && status == "authenticated") {
            try {
                fetch("https://api-gateway.psu.ac.th/Test/regist/level2/StudentDetailCampus/01/token", {
                    method: "GET",
                    cache: "force-cache",
                    headers: {
                        credential: process.env.NEXT_PUBLIC_API_KEY,
                        token: session?.accessToken,
                    },
                })
                    .then((res) => res.json())
                    .then((json) => {
                        if (json.data) {
                            const userData = {
                                titleNameEng: json.data[0]?.titleNameEng,
                                titleNameThai: json.data[0]?.titleNameThai,
                                studNameEng: json.data[0]?.studNameEng,
                                studNameThai: json.data[0]?.studNameThai,
                                studSnameEng: json.data[0]?.studSnameEng,
                                studSnameThai: json.data[0]?.studSnameThai,
                                studentId: json.data[0]?.studentId,
                                majorNameEng: json.data[0]?.majorNameEng,
                                majorNameThai: json.data[0]?.majorNameThai,
                            };
                            sessionStorage.setItem("userData", JSON.stringify(userData));
                        }
                    });

                fetch("https://api-gateway.psu.ac.th/Test/regist/level2/StudentImage/token/string", {
                    method: "GET",
                    cache: "force-cache",
                    headers: {
                        credential: process.env.NEXT_PUBLIC_API_KEY,
                        token: session?.accessToken,
                    },
                })
                    .then((res) => res.text())
                    .then((image) => sessionStorage.setItem("userImg", image?.replace(/[""]+/g, "")));
            } catch (e) {
                console.error(e);
            }
        } else {
            setUserData(JSON.parse(sessionStorage.getItem("userData")!));
            setStudentImg(sessionStorage.getItem("userImg"));
        }
    }, [status, session]);
    return (
        <nav className="bg-white border-b-4 border-blue-900 shadow-md fixed w-full top-0 start-0 z-[9999]">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <div className="flex space-x-1">
                    <a href="/home" className="flex items-center mr-4">
                        <img src="/logo/psu-guide-logo.svg" className="h-12" alt="PSU GUIDE Logo" />
                    </a>
                    <a
                        href="/home"
                        className="hidden xl:flex text-blue-950 px-3 items-center space-x-2 rounded-lg hover:bg-gray-200"
                        style={{
                            backgroundColor: router == "/home" ? "rgb(229 231 235)" : "",
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[1.5rem] h-[1.6rem] mb-1">
                            <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                            <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                        </svg>
                        <p className="inline font-bold">หน้าเเรก</p>
                    </a>
                    <a
                        href="/subjectSearch"
                        className="hidden xl:flex text-blue-950 px-3 items-center space-x-2 rounded-lg hover:bg-gray-200"
                        style={{
                            backgroundColor: router == "/subjectSearch" ? "rgb(229 231 235)" : "",
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-[1.6rem]">
                            <path d="M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z" />
                            <path
                                fill-rule="evenodd"
                                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.125 4.5a4.125 4.125 0 1 0 2.338 7.524l2.007 2.006a.75.75 0 1 0 1.06-1.06l-2.006-2.007a4.125 4.125 0 0 0-3.399-6.463Z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        <p className="inline font-bold">ค้นหารายวิชา</p>
                    </a>
                    <a
                        href="/mapSearch"
                        className="hidden xl:flex text-blue-950 px-3 items-center space-x-2 rounded-lg hover:bg-gray-200"
                        style={{
                            backgroundColor: router == "/mapSearch" ? "rgb(229 231 235)" : "",
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path
                                fill-rule="evenodd"
                                d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        <p className="inline font-bold">เเผนที่เเละอาคาร</p>
                    </a>
                    <a
                        href="/plan"
                        className="hidden xl:flex text-blue-950 px-3 items-center space-x-2 rounded-lg hover:bg-gray-200"
                        style={{
                            backgroundColor: router == "/plan" ? "rgb(229 231 235)" : "",
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                            <path
                                fill-rule="evenodd"
                                d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 18.375V5.625ZM21 9.375A.375.375 0 0 0 20.625 9h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 0 0 .375-.375v-1.5Zm0 3.75a.375.375 0 0 0-.375-.375h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 0 0 .375-.375v-1.5Zm0 3.75a.375.375 0 0 0-.375-.375h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 0 0 .375-.375v-1.5ZM10.875 18.75a.375.375 0 0 0 .375-.375v-1.5a.375.375 0 0 0-.375-.375h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375h7.5ZM3.375 15h7.5a.375.375 0 0 0 .375-.375v-1.5a.375.375 0 0 0-.375-.375h-7.5a.375.375 0 0 0-.375.375v1.5c0 .207.168.375.375.375Zm0-3.75h7.5a.375.375 0 0 0 .375-.375v-1.5A.375.375 0 0 0 10.875 9h-7.5A.375.375 0 0 0 3 9.375v1.5c0 .207.168.375.375.375Z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        <p className="inline font-bold">วางเเผนตารางเรียน</p>
                    </a>
                </div>

                <div className="flex md:order-2 space-x-3 md:space-x-3 ltr:space-x-reverse">
                    {status == "authenticated" && userData ? (
                        <>
                            <button
                                className="flex items-center text-gray-800 font-bold rounded-lg border-[1px] border-gray-200"
                                type="button"
                                onClick={() => setIsShowDropdown(!isShowDropdown)}
                            >
                                <p className="m-2 hidden md:block">{`${userData?.studNameEng} ${userData?.studSnameEng[0]}.`}</p>
                                <img src={`data:image/png;base64,${studentImg}`} className="max-w-8 rounded-md border border-gray-700" />
                            </button>

                            <div
                                className="absolute right-2 mt-12 bg-white border border-blue-950 divide-gray-100 rounded-lg shadow w-46"
                                style={{
                                    display: isShowDropdown ? "block" : "none",
                                }}
                            >
                                <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdownDefaultButton">
                                    <li className="block text-wrap px-4 py-2">
                                        <p className="text-md">เข้าสู่ระบบในชื่อ</p>
                                        <p className="text-sm font-bold mt-2">
                                            {`${userData?.titleNameThai} ${userData?.studNameThai} ${userData?.studSnameThai}`}
                                        </p>
                                        <p className="text-sm font-bold">{`รหัสนักศึกษา ${userData?.studentId}`}</p>
                                    </li>
                                    <li className="border-t-2">
                                        <button
                                            className="block w-full px-4 py-2 text-red-400 hover:bg-red-400 hover:text-white"
                                            type="button"
                                            onClick={handleSignOut}
                                        >
                                            Sign Out
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            {/* <button className="p-2 text-red-500" onClick={() => signOut()}>Log Out</button> */}
                        </>
                    ) : status == "unauthenticated" ? (
                        <>
                            <a
                                className="p-2 shadow-md rounded-lg bg-blue-900 text-white hover:shadow-lg hover:scale-105 transition-all"
                                href="/login"
                            >
                                ลงชื่อเข้าใช้งาน
                            </a>
                        </>
                    ) : (
                        <>
                            <p>Loading...</p>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
