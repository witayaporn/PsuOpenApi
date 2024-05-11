"use client";
import { useEffect, useState } from "react";
import { checkTimeOverlap } from "@/app/utils/timeUtils";
import { Tooltip } from "react-tooltip";

interface SubjectOverlap {
    [key: string]: number;
}

interface WeekTime {
    [key: string]: JSON[];
}

const weekDay = [
    {
        day: "วันจันทร์",
        shortEng: "mon",
    },
    {
        day: "วันอังคาร",
        shortEng: "tue",
    },
    {
        day: "วันพุธ",
        shortEng: "wed",
    },
    {
        day: "วันพฤหัสบดี",
        shortEng: "thu",
    },
    {
        day: "วันศุกร์",
        shortEng: "fri",
    },
];

const calculateSubjectPanel = (startTime: number, stopTime: number, minTime: number) => {
    const startT: number = startTime / 100;
    const stopT: number = stopTime / 100;
    const startRender: number = parseInt(startT - minTime) + 1;
    const period: number = parseInt(stopT - startT) + ((stopT - startT) % 1) / 0.6;
    return { startRender: startRender, period: period };
};

export default function TimeTable(prop: any) {
    const data = prop.data;
    const defaultWeekTime: WeekTime = {
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
    };
    const defaultSubjectOverlap: SubjectOverlap = {
        mon: 0,
        tue: 0,
        wed: 0,
        thu: 0,
        fri: 0,
    };
    const [weekTime, setWeekTime] = useState<WeekTime>(defaultWeekTime);
    const [subjectOverlap, setSubjectOverlap] = useState<SubjectOverlap>(defaultSubjectOverlap);
    const [maxTime, setMaxTime] = useState<number>(13);
    const [minTime, setMinTime] = useState<number>(8);

    const setUpData = () => {
        var temp = defaultWeekTime;
        var tempOverlap = defaultSubjectOverlap;
        var minT: number = 8;
        var maxT: number = 13;
        data.map((subject: any) => {
            subject.length
                ? subject[0].map((item: any) => {
                      minT =
                          parseInt(item.startTime) / 100 < minT
                              ? Math.ceil(parseInt(item.startTime) / 100)
                              : minT;
                      maxT =
                          parseInt(item.stopTime) / 100 > maxT
                              ? Math.ceil(parseInt(item.stopTime) / 100)
                              : maxT;
                      switch (item.classDate) {
                          case "1":
                              temp.mon.length > 0
                                  ? temp.mon.map((prevItem: any) => {
                                        const isOverlap = checkTimeOverlap(
                                            item.startTime,
                                            item.stopTime,
                                            prevItem.startTime,
                                            prevItem.stopTime
                                        );
                                        if (isOverlap) {
                                            tempOverlap.mon += 1;
                                        }
                                    })
                                  : null;
                              temp.mon.push(item);
                              break;
                          case "2":
                              temp.tue.length > 0
                                  ? temp.tue.map((prevItem: any) => {
                                        const isOverlap = checkTimeOverlap(
                                            item.startTime,
                                            item.stopTime,
                                            prevItem.startTime,
                                            prevItem.stopTime
                                        );
                                        if (isOverlap) {
                                            tempOverlap.tue += 1;
                                        }
                                    })
                                  : null;
                              temp.tue.push(item);
                              break;
                          case "3":
                              temp.wed.length > 0
                                  ? temp.wed.map((prevItem: any) => {
                                        const isOverlap = checkTimeOverlap(
                                            item.startTime,
                                            item.stopTime,
                                            prevItem.startTime,
                                            prevItem.stopTime
                                        );
                                        if (isOverlap) {
                                            tempOverlap.wed += 1;
                                        }
                                    })
                                  : null;
                              temp.wed.push(item);
                              break;
                          case "4":
                              temp.thu.length > 0
                                  ? temp.thu.map((prevItem: any) => {
                                        const isOverlap = checkTimeOverlap(
                                            item.startTime,
                                            item.stopTime,
                                            prevItem.startTime,
                                            prevItem.stopTime
                                        );
                                        if (isOverlap) {
                                            tempOverlap.thu += 1;
                                        }
                                    })
                                  : null;
                              temp.thu.push(item);
                              break;
                          case "5":
                              temp.fri.length > 0
                                  ? temp.fri.map((prevItem: any) => {
                                        const isOverlap = checkTimeOverlap(
                                            item.startTime,
                                            item.stopTime,
                                            prevItem.startTime,
                                            prevItem.stopTime
                                        );
                                        if (isOverlap) {
                                            tempOverlap.fri += 1;
                                        }
                                    })
                                  : null;
                              temp.fri.push(item);
                              break;
                      }
                  })
                : null;
        });
        setWeekTime(temp);
        setMaxTime(maxT);
        setMinTime(minT);
        setSubjectOverlap(tempOverlap);
        console.log(temp);
    };

    useEffect(() => {
        setUpData();
    }, [prop.data]);

    return (
        <>
            <div className="relative w-full text-xs bg-white rounded-lg border-2 border-slate-300 overflow-x-scroll">
                <div
                    className="absolute z-[2000] inline-block"
                    style={{ width: `${(maxTime - minTime + 2) * 120}px` }}
                >
                    <div className="relative h-[56px] bg-green-100 opacity-20"></div>
                    {weekDay.map((day) => (
                        <div
                            className="relative py-1 pl-[120px]"
                            style={{
                                height: `${(subjectOverlap[day.shortEng] + 1) * 66}px`,
                            }}
                        >
                            {weekTime[day.shortEng].length ? (
                                weekTime[day.shortEng].map((item: any, key: number) => {
                                    const renderData: any = calculateSubjectPanel(
                                        parseInt(item.startTime),
                                        parseInt(item.stopTime),
                                        minTime
                                    );
                                    var countOverlap: number = 0;
                                    weekTime[day.shortEng].slice(0, key).map((prevItem: any) => {
                                        if (
                                            item.subjectId == prevItem.subjectId &&
                                            item.section == prevItem.section
                                        ) {
                                            return;
                                        }
                                        const isOverlap: boolean = checkTimeOverlap(
                                            item.startTime,
                                            item.stopTime,
                                            prevItem.startTime,
                                            prevItem.stopTime
                                        );
                                        if (isOverlap) {
                                            countOverlap += 1;
                                        }
                                    });
                                    // console.log(day.day + " " + countOverlap)
                                    // console.log(weekTime[day.shortEng].slice(0, key - 1))
                                    console.log(item)

                                    return (
                                        <>
                                            <a
                                                key={key}
                                                data-tooltip-id={`tooltip-bottom-${item.subjectId}-${item.section}`}
                                                className="absolute h-[60px] p-2 hover:border rounded-md"
                                                style={{
                                                    left: `${renderData.startRender * 120}px`,
                                                    marginTop: `${countOverlap * 66}px`,
                                                    maxWidth: `${renderData.period * 120}px`,
                                                    backgroundColor: '#' + item.subjectCode.replace(/-/, '') + "80",
                                                }}
                                            >
                                                <p
                                                    className="text-xs font-bold text-gray-900 truncate"
                                                    style={{
                                                        maxWidth: `${renderData.period * 120}px`,
                                                    }}
                                                >{`${item.subjectCode} ${item.shortNameEng}`}</p>
                                                <p className="text-xs text-gray-800">
                                                    {item.credit}
                                                </p>
                                            </a>
                                            <Tooltip id={`tooltip-bottom-${item.subjectId}-${item.section}`} place="bottom">
                                                <p className="text-sm">{`${item.subjectCode} ${item.shortNameEng}`}</p>
                                                <p className="text-sm">{`${item.credit} ตอน ${item.section} `}</p>
                                                <p className="text-sm">{`ห้อง ${item?.roomName ? item.roomName : "-"}`}</p>
                                            </Tooltip>
                                        </>
                                    );
                                })
                            ) : (
                                <></>
                            )}
                        </div>
                    ))}
                </div>
                <div className="relative" id="classTableParent">
                    <table className="border-collapse rounded-lg" id="classTable">
                        <thead className="text-left">
                            <tr>
                                <th
                                    className="min-w-[120px] p-5 text-center border border-slate-300"
                                    style={{}}
                                >
                                    วัน/เวลาเรียน
                                </th>
                                {[...Array(maxTime - minTime + 1)].map((x, i) => (
                                    <th
                                        key={i}
                                        className="min-w-[120px] pl-2 p-5 border border-slate-300"
                                    >
                                        {("0" + (minTime + i)).slice(-2)}:00
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {weekDay.map((day) => (
                                <tr>
                                    <th
                                        className="min-w-[120px] p-5 border border-slate-300"
                                        style={{
                                            height: `${(subjectOverlap[day.shortEng] + 1) * 66}px`,
                                        }}
                                    >
                                        {day.day}
                                    </th>
                                    {[...Array(maxTime - minTime + 1)].map((x, i) => (
                                        <td
                                            key={i}
                                            className="min-w-[120px] p-5 border border-slate-300"
                                        ></td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
