
const timeFormatter = (time: string) => {
    if (time) {
        const h = time.slice(0, 2)
        const m = time.slice(2, 4)
        return h + ":" + m + " น."
    }
    return "-"
}

export default function SectionCard(prop: any) {
    const data = prop.data[0]
    const dateData = prop.data[1]
    const examData = prop.data[2]
    const midExam = examData ? examData.filter((data) => data.examdateType == 'M')[0] : null
    const finalExam = examData ? examData.filter((data) => data.examdateType == 'F')[0] : null
    const noInterest: number = 143
    const percentage: number = (data.noOffer / noInterest) * 100
    return (
        <div className="w-full p-4 grid grid-cols-1 gap-3 rounded-lg bg-slate-200 ">
            <div className="grid grid-cols-2 ">
                {/* {console.log(dateData)} */}
                <p className="font-bold text-sm text-gray-800">ตอน {data.section}</p>
                <p className="text-sm text-right text-gray-800">โอกาส {percentage.toFixed(2)} %</p>
            </div>
            <div>
                <div className="grid grid-cols-3 text-sm">
                    <p>ผู้เรียน</p>
                    <p>จำนวนที่นั่ง</p>
                    <p>จำนวนคนที่สนใจ</p>
                </div>
                <div className="grid grid-cols-3 text-sm break-words text-gray-600">
                    <p className="p-1">{data.studentGroup}</p>
                    <p className="p-1">{data.noOffer}</p>
                    <p className="p-1">{noInterest}</p>
                </div>
            </div>
            <div>
                <div className="grid grid-cols-3 text-sm">
                    <p>วัน/เวลาเรียน</p>
                    <p>ห้องเรียน</p>
                    <p>ผู้สอน</p>
                </div>
                <div className="grid grid-cols-3 gap-y-2 text-sm break-normal text-gray-600">
                    {
                        dateData ? dateData.map((date: any) =>
                            <>
                                <p className="p-1">{date.classDateDesc} {timeFormatter(date.startTime) + " - " + timeFormatter(date.stopTime)}</p>
                                {date.roomName ?
                                    <p className="block md:inline-flex p-1">
                                        <p className="py-1 md:mr-3">{date.roomName}</p>
                                        <a 
                                            className="inline-flex py-1 px-2 bg-gray-300 w-fit h-fit rounded-lg" 
                                            href={`/mapSearch/?search=${date.roomName}`}
                                            target="_blank" rel="noopener noreferrer"
                                        >
                                            ค้นหาห้อง
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 ml-1">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>

                                        </a>
                                    </p>
                                    : <p>-</p>}
                                <p className="p-1">{date.lecturerNameThai}</p>
                            </>
                        )
                            : "ไม่มีข้อมูล"
                    }
                </div>
            </div>

            <div>
                <div className="grid grid-cols-2 text-sm">
                    <p>สอบกลางภาค</p>
                    <p>สอบปลายภาค</p>
                </div>
                <div className="grid grid-cols-2 text-sm break-words text-gray-600">
                    {console.log(examData)}
                    {console.log(midExam)}
                    {midExam ? <p>{`${timeFormatter(midExam.examStartTime)} - ${timeFormatter(midExam.examStopTime)} ห้อง ${midExam.roomName ? midExam.roomName : "-"}`}</p> : <p>-</p>}
                    {finalExam ? <p>{`${timeFormatter(finalExam.examStartTime)} - ${timeFormatter(finalExam.examStopTime)} ห้อง ${finalExam.roomName ? finalExam.roomName : "-"}`}</p> : <p>-</p>}
                </div>
            </div>
            <div className="grid grid-cols-1 px-auto">
                <button
                    className=" text-blue-500 p-2 border border-blue-500 rounded-lg font-bold uppercase text-sm hover:bg-blue-500 hover:text-white focus:outline-none ease-linear transition-all duration-150"
                    type="button"
                >
                    Interest
                </button>
            </div>

        </div >
    )
}