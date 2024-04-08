"use client"
import { MapContainer, TileLayer, Polygon, useMap, GeoJSON } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { LatLngExpression } from 'leaflet';
import { useEffect, useState } from 'react';
import geodata from '../../../public/building-data.json'

const buildingClick = (prop : any) => {
    console.log(prop.layer['feature'])
}

export default function Map() {
    // const [data, setData] = useState([]);
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

    const sirinPos = [
        [7.0064096, 100.5024446],
        [7.0060944, 100.5026604],
        [7.0058861, 100.5023517],
        [7.0062013, 100.5021358]
    ]
    return (
        <MapContainer
            preferCanvas={true}
            center={[7.0078, 100.5006]}
            zoom={16}
            scrollWheelZoom={true}
            style={{ height: "22rem", width: "auto", borderRadius: "18px" }}
        >
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* <Polygon
                pathOptions={{color: "blue", weight: 2}} 
                positions={sirinPos}
            /> */}
            <GeoJSON 
            pathOptions={{color: "white", weight: 1}} 
            data={geodata.features}
            eventHandlers={{
                click: (e) => buildingClick(e)
            }}
            />
            {console.log(geodata.features)}
        </MapContainer>
    )
}