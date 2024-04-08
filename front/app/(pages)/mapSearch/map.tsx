"use client"
import { MapContainer, TileLayer, Polygon, useMap, GeoJSON } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import { useEffect, useState } from 'react';
import buildingData from '../../../public/building-data.json'

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
    useEffect(()=>{
        setSelectedPlace(defaultGEO)
    }, [])
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
            <GeoJSON 
            pathOptions={{color: "white", weight: 1}} 
            data={buildingData.features}
            eventHandlers={{
                click: (data : any) => {
                    const feature = data.layer['feature']
                    setSelectedPlace(feature)
                    props.setShareState(feature)
                    setKeyGeoJson(keyGeoJson + 1)
                    // console.log(selectedPlace)
                }
            }}
            />
            <GeoJSON
                pathOptions={{color: "blue", weight: 2}} 
                data={selectedPlace}
                key={keyGeoJson}
            />
        </MapContainer>
    )
}