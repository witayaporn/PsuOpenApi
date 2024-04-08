"use client"

import { useMemo, useState } from "react"
import dynamic from "next/dynamic"

export default function MapSearchPage(){
    const [mapData, setMapData] = useState({})
    const Map = dynamic(() => import("./map"), {
        ssr: false,
        loading: () => <p>Loading...</p>,
    });


    const mapMemo = useMemo(() => <Map mapData={mapData} setMapData={setMapData} />, [])

    return (
        <section>
            <div className="grid grid-cols-1 gap-4 mb-3">
                <div className="grid grid-rows-2 gap-4">
                    <div>
                        <p className="text-3xl font-bold text-right">Building/Room Search</p>
                    </div>
                    <div className="grid grid-cols-6 gap-1">
                        <div className="col-span-5">
                            <input type="text" className="bg-gray-50 border border-gray-700 text-md rounded-xl focus:border-[#2d505b] block w-full p-2.5"></input>
                        </div>
                        <div className="col-span-1">
                            <button className="w-full h-full bg-[#2d505b] hover:bg-green-900 text-white py-2 px-4 rounded-xl ">
                                <svg className="w-6 h-6 sm:hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                                <p className="hidden sm:inline">Search</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-rows-2 gap-3">
                {mapMemo}
                <div>
                    {console.log(mapData)}
                    <h1 className="text-center text-xl font-bold">{mapData.name}</h1>
                </div>
            </div>
        </section>
    )
}