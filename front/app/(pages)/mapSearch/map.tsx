"use client"
import { MapContainer, TileLayer, Polygon, useMap, GeoJSON } from 'react-leaflet'
import L from 'leaflet'
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { useEffect, useState } from 'react';
import buildingData from '../../../public/building-data.json'
import parkingData from '../../../public/parking-data.json'
import parkingIconURL from '../../../public/parking-icon.png'



export default function Map(props) {
    const defaultGEO: GeoJSON.Feature = {
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: [100.5006, 7.0078],
        },
        properties: {}
    }
    const [selectedPlace, setSelectedPlace] = useState({});
    const [keyGeoJson, setKeyGeoJson] = useState(0)
    // useEffect(() =>{
    //     fetch('https://overpass-api.de/api/interpreter',{
    //             method: "POST",
    //             body: `
    //             <osm-script output="json">
    //                 <union>
    //                     <query type="node">
    //                     <has-kv k="building"/>
    //                     <bbox-query s="6.999015288669186" w="100.48567706383449" n="7.013007716829359" e="100.51758462227563"/>
    //                     </query>
    //                     <query type="way">
    //                     <has-kv k="building"/>
    //                     <bbox-query s="6.999015288669186" w="100.48567706383449" n="7.013007716829359" e="100.51758462227563"/>
    //                     </query>
    //                     <query type="relation">
    //                     <has-kv k="building"/>
    //                     <bbox-query s="6.999015288669186" w="100.48567706383449" n="7.013007716829359" e="100.51758462227563"/>
    //                     </query>
    //                 </union>
    //                 <print mode="body"/>
    //                 <recurse type="down"/>
    //                 <print mode="skeleton"/>
    //             </osm-script>
    //         `
    //         }
    //     )
    //     .then((res) => res.json())
    //     .then((data) => setData(data.elements))
    // }, [])

    const [filter, setFilter] = useState("building")
    const [keyMap, setKeyMap] = useState(0)
    const handleCheckBox = (e : any) => {
        const id : string = e.target.id
        setFilter(filter == id ? "" : id)
        setSelectedPlace(defaultGEO)
        setKeyMap(keyMap + 1)
        // console.log(filter)
    }

    const parkingIcon = new L.Icon({
        iconUrl: './parking-icon.png',
        iconSize: [32, 45],
        iconAnchor: [16, 37],
        popupAnchor: [0, 0]
    })

    useEffect(() => {
        setSelectedPlace(defaultGEO)
    }, [])
    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="flex space-x-2">
                <div>
                    <input type="checkbox" id="building" checked={filter == "building"} className="hidden peer" onChange={handleCheckBox}></input>
                    <label htmlFor="building" className="inline-flex p-1 text-gray-400 bg-blue-100 border-2 border-blue-200 rounded-lg cursor-pointer peer-checked:border-[#2d505b] peer-checked:text-black">
                        Building
                    </label>
                </div>
                <div>
                    <input type="checkbox" id="parking" checked={filter == "parking"} className="hidden peer" onChange={handleCheckBox}></input>
                    <label htmlFor="parking" className="inline-flex p-1 text-gray-400 bg-red-100 border-2 border-red-200 rounded-lg cursor-pointer peer-checked:border-[#2d505b] peer-checked:text-black">
                        Parking
                    </label>
                </div>
            </div>
            <div>
                <MapContainer
                    preferCanvas={true}
                    key={keyMap}
                    center={[7.0078, 100.5006]}
                    zoom={16}
                    scrollWheelZoom={true}
                    style={{ height: "22rem", width: "auto", borderRadius: "18px" }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <GeoJSON
                        pathOptions={{ color: "wheat", weight: 1, opacity: 0.1 }}
                        data={filter == "parking" ? parkingData.features : buildingData.features}
                        pointToLayer={(feature, latlng) => L.marker(latlng, {icon: parkingIcon})}
                        eventHandlers={{
                            click: (data: any) => {
                                const feature = data.layer['feature']
                                setSelectedPlace(feature)
                                props.setMapData(feature.properties)
                                setKeyGeoJson(keyGeoJson + 1)
                                // console.log(selectedPlace)
                            }
                        }}
                    />
                    {console.log(filter)}
                    <GeoJSON
                        pathOptions={{ color: "blue", weight: 2 }}
                        data={selectedPlace}
                        key={keyGeoJson}
                        pointToLayer={(feature, latlng) => L.marker(latlng, {icon: parkingIcon})}
                    />
                </MapContainer>
            </div>
        </div>
    )
}