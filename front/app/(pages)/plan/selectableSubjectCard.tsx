"use client";
import { useState } from "react";

export default function SelectableSectionCard(prop: any) {
    const [select, setSelect] = useState<boolean>(false);
    const data = prop.data[0];
    // const noInterest: number = 143
    // const percentage: number = (data.noOffer / noInterest) * 100
    const subjectShortNameEN = data.subjectCode + " " + data.shortNameEng;
    const handleCardClick = () => {
        prop.onClick(data.subjectId, !select);
        setSelect(!select);
    };

    return (
        <a
            className={
                "p-4 border rounded-lg showdow-sm hover:shadow-md cursor-pointer transition-all " +
                (select ? "border-4 border-blue-300" : "")
            }
            // style={{ background: `linear-gradient(to bottom, ${facColor.primary}, ${facColor.secondary})`, }}
            onClick={handleCardClick}
        >
            {/* <div className={ "h-full bg-white rounded-r-md"}> */}
            <p className="font-bold text-green-950">{subjectShortNameEN}</p>
            <p className="text-gray-700 truncate max-h-6">
                {data.subjectNameThai}
            </p>
            <p className="text-gray-700 truncate text-sm max-h-6">
                ตอน {data.section}
            </p>
            <p className="text-gray-500 inline ">{data.credit}</p>
            <p className="inline-flex py-1 px-2 mx-2 text-black text-xs bg-gray-100 border-gray-400 rounded-lg">
                {data.subjectTypeDesc}
            </p>
            {/* </div> */}
        </a>
    );
}
