"use client"

import { useMemo, useState } from "react"
import dynamic from "next/dynamic"
import SearchBar from "../../components/searchBar";
import DetailCard from "./detailCard";

export default function MapSearchPage(){
    const [mapData, setMapData] = useState({})
    const Map = dynamic(() => import("./map"), {
        ssr: false,
        loading: () => <p>Loading...</p>,
    });

    const handleSearchChange = (e: any) => {
        console.log(e.target.value)
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
    }

    const mapMemo = useMemo(() => <Map mapData={mapData} setMapData={setMapData} />, [])

    return (
        <section>
            <div className="grid grid-cols-1 gap-4 mb-3">
                <div className="grid grid-rows-2 gap-4">
                    <div>
                        <p className="text-3xl font-bold text-right">Building/Room Search</p>
                    </div>
                    <SearchBar onSubmit={handleSubmit} onChange={handleSearchChange}/>
                </div>
            </div>
            <div className="grid grid-rows-2 gap-3">
                {mapMemo}
                <div>
                    <DetailCard data={mapData} />
                </div>
            </div>
        </section>
    )
}