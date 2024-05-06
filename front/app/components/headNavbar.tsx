'use client'

import { signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function HeadNavbar() {
    const [userData, setUserData] = useState()
    const { data: session, status } = useSession()
    useEffect(() => {
        console.log(sessionStorage.getItem("userData"))
        if (sessionStorage.getItem("userData") === null && status == "authenticated") {
            console.log("reload user data")
            fetch("https://api-gateway.psu.ac.th/Test/regist/level2/StudentDetailCampus/01/token", {
                method: 'GET',
                cache: 'force-cache',
                headers: {
                    "credential": process.env.NEXT_PUBLIC_API_KEY,
                    "token": session?.accessToken
                }
            })
                .then((res) => res.json())
                .then((json) => {
                    if (json.data) {
                        const userData = {
                            'titleNameEng': json.data[0]?.titleNameEng,
                            'titleNameThai': json.data[0]?.titleNameThai,
                            'studNameEng': json.data[0]?.studNameEng,
                            'studNameThai': json.data[0]?.studNameThai,
                            'studSnameEng': json.data[0]?.studSnameEng,
                            'studSnameThai': json.data[0]?.studSnameThai,
                            'studentId': json.data[0]?.studentId,
                            'majorNameEng': json.data[0]?.majorNameEng,
                            'majorNameThai': json.data[0]?.majorNameThai
                        }
                        sessionStorage.setItem("userData", JSON.stringify(userData))
                    }
                })
        } else if(status == "unauthenticated"){
            sessionStorage.removeItem("userData")
        } else{
            setUserData(JSON.parse(sessionStorage.getItem("userData")))
        }

    }, [status])
    return (
        <nav className="bg-white border-b-4 border-blue-900 shadow-md fixed w-full top-0 start-0 z-[9999]">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="/home" className="flex items-center space-x-1 rtl:space-x-reverse">
                    {/* <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo"/> */}
                    <span className="self-center text-3xl font-semibold text-blue-900">PSU</span>
                    <span className="self-center text-3xl whitespace-nowrap">Guide</span>
                </a>

                <div className="flex md:order-2 space-x-3 md:space-x-3 ltr:space-x-reverse">
                    {
                        userData ?
                            <>
                                {/* {console.log(status)} */}
                                <p className="self-center text-lg">{userData?.studNameEng}</p>
                                <p className="self-center text-lg">{`${userData?.studSnameEng[0]}.`}</p>
                                <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                                <button className="p-2 text-red-500" onClick={() => signOut()}>Log Out</button>
                            </>
                            : status == "unauthenticated" ?
                                <>
                                    <a className="p-2 shadow-md rounded-lg bg-blue-900 text-white hover:shadow-lg hover:scale-105 transition-all" href="/login">ลงชื่อเข้าใช้งาน</a>
                                </>
                                :
                                <>
                                    <p>Loading...</p>
                                </>
                    }
                </div>
            </div>
        </nav>
    )
}