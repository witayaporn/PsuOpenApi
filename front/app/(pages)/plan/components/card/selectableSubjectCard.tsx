"use client";
import { useState } from "react";

export default function SelectableSectionCard(prop: any) {
    const [select, setSelect] = useState<boolean>(prop.selected);
    const data = prop.data;
    const subjectShortNameEN = data.subjectCode + " " + data.shortNameEng;

    const handleCardClick = () => {
        prop.onClick(data.subjectId, data.section, !select);
        setSelect(!select);
    };

    return (
        <div
            className={
                "flex flex-col justify-between p-1 rounded-lg showdow-sm hover:shadow-md cursor-pointer transition-all " +
                (select ? "bg-slate-100 border-4 border-blue-300" : "border-2")
            }
        >
            <a className="px-4 py-3" onClick={handleCardClick}>
                <p className="font-bold text-green-950">{subjectShortNameEN}</p>
                <p className="text-gray-700 truncate max-h-6">{data.subjectNameThai}</p>
                <p className="text-gray-700 truncate text-sm max-h-6">ตอน {data.section}</p>
                <p className="text-gray-500 inline ">{data.credit}</p>
                <p className="inline-flex py-1 px-2 mx-2 text-black text-xs bg-gray-100 border-gray-400 rounded-lg">{data.subjectTypeDesc}</p>
            </a>
            <button
                className=" text-orange-600 p-2 border border-orange-600 rounded-lg font-bold uppercase text-sm hover:bg-orange-500 hover:text-white focus:outline-none ease-linear transition-all duration-150"
                type="button"
                onClick={()=> prop.onDelete(data)}
            >
                ลบออกจากวิชาที่สนใจ
            </button>
        </div>
    );
}
