"use client"

import { useEffect, useMemo, useState } from "react"
import SearchBar from "../../components/searchBar";
import dynamic from "next/dynamic";
import Map from "./map";
import { useRouter } from "next/navigation";


export default function MapSearchPage() {
    const router = useRouter()
    const Map = dynamic(() => import("./map"), {
        ssr: false,
        loading: () => <p>Loading...</p>,
    });
    // const mapMemo = useMemo(() => <Map mapData={mapData} setMapData={setMapData} />, [])
    // const [search, setSearch] = useState("") 
    const handleSearchChange = (e: any) => {
        // console.log(e.target.value)
        // setSearch(e.target.value)
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        // console.log(e.target[0].value)
        router.push(`/mapSearch/?search=${e.target[0].value}`)
    }


    return (
        <section>
            <div className="grid grid-cols-1 gap-4 mb-3">
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <p className="text-4xl font-bold text-right">Building/Room Search</p>
                    </div>
                    <SearchBar onSubmit={handleSubmit} onChange={handleSearchChange} />
                </div>
            </div>
            <div>
                <Map />
            </div>
        </section>
    )
}