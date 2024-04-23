'use client'
import { useEffect, useState } from "react"

export default function TimeTable(prop: any) {
    const data = prop.data
    const defaultWeekTime = {
        "mon": [],
        "tue": [],
        "wed": [],
        "thu": [],
        "fri": [],
        "sat": [],
        "sun": []
    }
    const [weekTime, setWeekTime] = useState(defaultWeekTime)

    const maxTime: number = 17
    const minTime: number = 8

    const setUpData = () => {
        let temp = defaultWeekTime
        data.map((subject) => {
            console.log(subject)
            subject.length
                ? subject.map((item) => {
                    console.log(item)
                    switch (item.classDate) {
                        case "1":
                            temp.mon.push(item)
                            break
                        case "2":
                            temp.tue.push(item)
                            break
                        case "3":
                            temp.wed.push(item)
                            break
                        case "4":
                            temp.thu.push(item)
                            break
                        case "5":
                            temp.fri.push(item)
                            break
                        case "6":
                            temp.sat.push(item)
                            break
                        case "7":
                            temp.sun.push(item)
                            break
                    }
                })
                : null
        })
        setWeekTime(temp)
    }

    useEffect(() => {
        setUpData()
        { console.log("set up") }
    }, [prop.update])

    return (
        <>
            <div className="relative w-full text-xs bg-white rounded-lg border-2 border-slate-300 overflow-x-scroll">
                {console.log(weekTime)}
                <div className="absolute z-[2000] inline-block" style={{ width: `${(maxTime - minTime + 2) * 120}px` }}>
                    <div className="relative h-[57px] bg-green-100 opacity-50">
                    </div>
                    <div className="relative h-[66px] py-1 pl-[120px] opacity-50">
                        {weekTime.mon.length ? weekTime.mon.map((item) => {
                            const startT: string = parseInt(item.startTime) / 100
                            const stopT: string = parseInt(item.stopTime) / 100
                            const startRender = parseInt(startT - minTime) + 1
                            const period = parseInt(stopT - startT) + (((stopT - startT) % 1) / 0.6)
                            console.log(startT + " " + stopT)
                            console.log("start" + startRender)
                            console.log("period" + period)
                            return (
                                <a
                                    className="absolute bg-blue-300 h-[60px] hover:border rounded-md"
                                    style={{ left: `${startRender * 120}px`, width: `${period * 120}px` }}
                                >
                                    {item.subjectNameThai}
                                </a>
                            )
                        }) : <></>}
                    </div>
                    <div className="relative h-[66px] py-1 pl-[120px] opacity-50">
                        {weekTime.tue.length ? weekTime.tue.map((item) => {
                            const startT: string = parseInt(item.startTime) / 100
                            const stopT: string = parseInt(item.stopTime) / 100
                            const startRender = parseInt(startT - minTime) + 1
                            const period = parseInt(stopT - startT) + (((stopT - startT) % 1) / 0.6)
                            return (
                                <a
                                    className="absolute bg-blue-300 h-[60px] hover:border rounded-md"
                                    style={{ left: `${startRender * 120}px`, width: `${period * 120}px` }}
                                >
                                    {item.subjectNameThai}
                                </a>
                            )
                        }) : <></>}
                    </div>
                    <div className="relative h-[66px] py-1 pl-[120px] opacity-50">
                        {weekTime.wed.length ? weekTime.wed.map((item) => {
                            const startT: string = parseInt(item.startTime) / 100
                            const stopT: string = parseInt(item.stopTime) / 100
                            const startRender = parseInt(startT - minTime) + 1
                            const period = parseInt(stopT - startT) + (((stopT - startT) % 1) / 0.6)
                            return (
                                <a
                                    className="absolute bg-blue-300 h-[60px] hover:border rounded-md"
                                    style={{ left: `${startRender * 120}px`, width: `${period * 120}px` }}
                                >
                                    {item.subjectNameThai}
                                </a>
                            )
                        }) : <></>}
                    </div>
                    <div className="relative h-[66px] py-1 pl-[120px] opacity-50">
                        {weekTime.thu.length ? weekTime.thu.map((item, key) => {
                            const startT: string = parseInt(item.startTime) / 100
                            const stopT: string = parseInt(item.stopTime) / 100
                            const startRender = parseInt(startT - minTime) + 1
                            const period = parseInt(stopT - startT) + (((stopT - startT) % 1) / 0.6)
                            console.log(item.subjectId.slice(0, 6))
                            return (
                                <a
                                    key={key}
                                    className="absolute h-[60px] hover:border rounded-md"
                                    style={{ left: `${startRender * 120}px`, width: `${period * 120}px`, backgroundColor: `#${item.subjectId.slice(0, 6)}` }}
                                >
                                    {item.subjectNameThai}
                                </a>
                            )
                        }) : <></>}
                    </div>
                    <div className="relative h-[66px] py-1 pl-[120px] opacity-50">
                        {weekTime.fri.length ? weekTime.fri.map((item) => {
                            const startT: string = parseInt(item.startTime) / 100
                            const stopT: string = parseInt(item.stopTime) / 100
                            const startRender = parseInt(startT - minTime) + 1
                            const period = parseInt(stopT - startT) + (((stopT - startT) % 1) / 0.6)
                            return (
                                <a
                                    className="absolute bg-blue-300 h-[60px] hover:border rounded-md"
                                    style={{ left: `${startRender * 120}px`, width: `${period * 120}px`, backgroundColor: `#${item.subjectId.slice(0, 6)}` }}
                                >
                                    {item.subjectNameThai}
                                </a>
                            )
                        }) : <></>}
                    </div>
                </div>
                <div className="relative" id="classTableParent">
                    <table className="border-collapse rounded-lg" id="classTable">
                        <thead className="text-left">
                            <tr>
                                <th className="min-w-[120px] p-5 text-center border border-slate-300" style={{}}>วัน/เวลาเรียน</th>
                                {[...Array(maxTime - minTime + 1)].map((x, i) =>
                                    <th key={i} className="min-w-[120px] pl-2 p-5 border border-slate-300">{('0' + (minTime + i)).slice(-2)}:00</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            <tr>
                                <th className="min-w-[120px] h-[66px] p-5 border border-slate-300">วันจันทร์</th>
                                {[...Array(maxTime - minTime + 1)].map((x, i) =>
                                    <td key={i} className="min-w-[120px] p-5 border border-slate-300"></td>
                                )}
                            </tr>
                            <tr>
                                <th className="min-w-[120px] p-5 h-[66px] border border-slate-300">วันอังคาร</th>
                                {[...Array(maxTime - minTime + 1)].map((x, i) =>
                                    <td key={i} className="min-w-[120px] p-5 border border-slate-300"></td>
                                )}
                            </tr>
                            <tr>
                                <th className="min-w-[120px] p-5 h-[66px] border border-slate-300">วันพุธ</th>
                                {[...Array(maxTime - minTime + 1)].map((x, i) =>
                                    <td key={i} className="min-w-[120px] p-5 border border-slate-300"></td>
                                )}
                            </tr>
                            <tr>
                                <th className="min-w-[120px] p-5 h-[66px] border border-slate-300">วันพฤหัสบดี</th>
                                {[...Array(maxTime - minTime + 1)].map((x, i) =>
                                    <td key={i} className="min-w-[120px] p-5 border border-slate-300"></td>
                                )}
                            </tr>
                            <tr>
                                <th className="min-w-[120px] p-5 h-[66px] border border-slate-300">วันศุกร์</th>
                                {[...Array(maxTime - minTime + 1)].map((x, i) =>
                                    <td key={i} className="min-w-[120px] p-5 border border-slate-300"></td>
                                )}
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div>
        </>
    )
}