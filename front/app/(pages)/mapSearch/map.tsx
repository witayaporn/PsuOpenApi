"use client";
import {
    MapContainer,
    TileLayer,
    Polygon,
    useMap,
    GeoJSON,
    Marker,
    Popup,
    GeoJSONProps,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { useEffect, useState } from "react";
import DetailCard from "./detailCard";
import { motion } from "framer-motion";
import buildingData from "@/public/building-data.json";
import parkingData from "@/public/parking-data.json";
import roomData from "@/public/room-data.json";
import { useSearchParams } from "next/navigation";

export default function Map() {
    const startPoint: any[] = [100.5006, 7.0078]
    const defaultGEO: GeoJSON.Feature = {
        type: "Feature",
        geometry: {
            type: "Polygon",
            coordinates: startPoint,
        },
        properties: null,
    };
    const seachParams = useSearchParams();
    const [selectedPlace, setSelectedPlace] =
        useState<GeoJSON.Feature | any>(defaultGEO);
    const [keyGeoJson, setKeyGeoJson] = useState<number>(0);
    const [filter, setFilter] = useState<string>("building");
    const [keyMap, setKeyMap] = useState<number>(0);
    const [locateMe, setLocateMe] = useState<boolean>(false);

    const handleCheckBox = (e: any) => {
        const id: string = e.target.id;
        setFilter(filter == id ? "" : id);
        setLocateMe(false);
        setSelectedPlace(defaultGEO);
        setKeyMap(keyMap + 1);
    };

    const parkingIcon = new L.Icon({
        iconUrl: "./parking-icon.png",
        iconSize: [32, 45],
        iconAnchor: [16, 37],
        popupAnchor: [0, 0],
    });

    const LocationMarker = () => {
        const [position, setPosition] = useState<any>(null);
        const map = useMap();
        useEffect(() => {
            map.locate().on("locationfound", (e) => {
                setPosition(e.latlng);
                map.flyTo(e.latlng, map.getZoom());
                console.log("Hello");
            });
        }, [map]);
        return position === null ? null : (
            <Marker position={position}>
                <Popup>คุณอยู่นี่</Popup>
            </Marker>
        );
    };

    useEffect(() => {
        var searchStr = seachParams.get("search")?.toLowerCase();
        if (searchStr && searchStr != "") {
            console.log(searchStr);
            var roomCode: string;
            if (searchStr.slice(0, 4) == "ห้อง") {
                roomCode = searchStr.slice(4);
            } else {
                roomCode = searchStr;
            }
            roomCode = roomCode.replace(/\d+/, "");
            const building = roomData.filter((room: any) =>
                room.buildingCode.some(
                    (code: string) =>
                        code.toLowerCase() == roomCode.toLowerCase()
                )
            )[0];
            searchStr = building ? building.building : searchStr;

            const searchBuilding = buildingData.features.filter((data: any) => {
                const byName = data.properties.name
                    ?.toLowerCase()
                    .includes(searchStr);
                const byNameEng = data.properties.nameEng
                    ?.toLowerCase()
                    .includes(searchStr);
                return byName || byNameEng;
            });
            searchBuilding.length ? setSelectedPlace(searchBuilding[0]) : null;
            console.log(searchBuilding);
        }
    }, []);
    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="relative flex flex-wrap items-center space-x-2 w-full">
                <div>
                    <input
                        type="checkbox"
                        id="building"
                        checked={filter == "building"}
                        className="hidden peer"
                        onChange={handleCheckBox}
                    ></input>
                    <label
                        htmlFor="building"
                        className="inline-flex p-1 text-gray-800 border-2 bg-white border-gray-200 rounded-lg cursor-pointer peer-checked:bg-blue-100 peer-checked:border-blue-900 peer-checked:text-black"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                            />
                        </svg>
                        <p className="hidden sm:inline">ตึกเเละอาคาร</p>
                    </label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="parking"
                        checked={filter == "parking"}
                        className="hidden peer"
                        onChange={handleCheckBox}
                    ></input>
                    <label
                        htmlFor="parking"
                        className="flex p-1 text-gray-800 border-2 bg-white border-gray-200 rounded-lg cursor-pointer peer-checked:bg-blue-100 peer-checked:border-blue-900 peer-checked:text-black"
                    >
                        <svg
                            width="800px"
                            height="800px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6"
                        >
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M5 12.0002C5.00024 8.66068 7.35944 5.78639 10.6348 5.1351C13.9102 4.48382 17.1895 6.23693 18.4673 9.32231C19.7451 12.4077 18.6655 15.966 15.8887 17.8212C13.1119 19.6764 9.41127 19.3117 7.05 16.9502C5.73728 15.6373 4.99987 13.8568 5 12.0002Z"
                                stroke="#000000"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M14 9.92018C13.923 8.78975 12.949 7.93278 11.818 8.00018H10V11.8402H11.818C12.949 11.9076 13.923 11.0506 14 9.92018Z"
                                stroke="#000000"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M10 11.8402V16.0002"
                                stroke="#000000"
                                stroke-width="1.5"
                                stroke-linecap="round"
                            />
                        </svg>
                        <p className="hidden sm:inline">ที่จอดรถ</p>
                    </label>
                </div>
                <div className="absolute right-0">
                    <button
                        className="inline-flex p-1 text-gray-800 border-2 bg-white border-gray-200 rounded-lg"
                        onClick={() => setLocateMe(true)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                            />
                        </svg>
                        <p className="hidden sm:inline">ตำเเหน่งของฉัน</p>
                    </button>
                </div>
            </div>
            <div>
                <MapContainer
                    preferCanvas={true}
                    key={keyMap}
                    center={[7.0078, 100.5006]}
                    zoom={16}
                    scrollWheelZoom={true}
                    style={{ height: "22rem", width: "auto", border: "none" }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <GeoJSON
                        pathOptions={{
                            color: "wheat",
                            weight: 1,
                            opacity: 0.1,
                        }}
                        data={
                            filter == "parking"
                                ? parkingData.features
                                : buildingData.features
                        }
                        pointToLayer={(feature, latlng) =>
                            L.marker(latlng, { icon: parkingIcon })
                        }
                        eventHandlers={{
                            click: (data: any) => {
                                const feature = data.layer["feature"];
                                setSelectedPlace(feature);
                                setKeyGeoJson(keyGeoJson + 1);
                                setLocateMe(false);
                            },
                        }}
                    />

                    <GeoJSON
                        pathOptions={{ color: "blue", weight: 2 }}
                        data={selectedPlace}
                        key={keyGeoJson}
                        pointToLayer={(feature, latlng) =>
                            L.marker(latlng, { icon: parkingIcon })
                        }
                    />

                    {locateMe && <LocationMarker />}
                </MapContainer>
            </div>
            {selectedPlace.properties && (
                <motion.div
                    key={keyGeoJson}
                    initial={{ opacity: 0, scale: 0.75, y: 80 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: { ease: "easeOut", duration: 0.2 },
                    }}
                    exit={{
                        opacity: 0,
                        scale: 0.75,
                        transition: { ease: "easeIn", duration: 0.1 },
                    }}
                    onAnimationComplete={() =>
                        window.scrollTo({ top: 1000, behavior: "smooth" })
                    }
                    className="mb-2 md:mb-24"
                >
                    <DetailCard data={selectedPlace.properties} />
                </motion.div>
            )}
        </div>
    );
}
