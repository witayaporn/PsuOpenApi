
const timeFormatter = (time: string) => {
    const h = time.slice(0, 2)
    const m = time.slice(2, 4)
    return h + ":" + m + " น."
}
export default function SectionCard(prop: any) {
    const data = prop.data[0]
    const dateData = prop.data[1]
    const noInterest: number = 143
    const percentage: number = (data.noOffer / noInterest) * 100
    return (
        <div className="w-full p-4 grid grid-cols-1 gap-3 rounded-lg bg-green-200">
            <div className="grid grid-cols-2 ">
                {console.log(dateData)}
                <p className="font-bold text-sm text-gray-800">ตอน {data.section}</p>
                <p className="text-sm text-right text-gray-800">โอกาส {percentage.toFixed(2)} %</p>
            </div>
            <div>
                <div className="grid grid-cols-3">
                    <p>ผู้เรียน</p>
                    <p>จำนวนที่นั่ง</p>
                    <p>จำนวนคนที่สนใจ</p>
                </div>
                <div className="grid grid-cols-3 text-sm text-gray-600">
                    <p>{data.studentGroup}</p>
                    <p>{data.noOffer}</p>
                    <p>{noInterest}</p>
                </div>
            </div>
            <div>
                <div className="grid grid-cols-3">
                    <p>วัน/เวลาเรียน</p>
                    <p>ห้องเรียน</p>
                    <p>ผู้สอน</p>
                </div>
                <div className="grid grid-cols-3 gap-y-2 text-sm text-gray-600">
                    {
                        dateData ? dateData.map((date) =>
                            <>
                                <p>{date.classDateDesc} {timeFormatter(date.startTime) + " - " + timeFormatter(date.stopTime)}</p>
                                <p>{date.roomName ? date.roomName : "-"}</p>
                                <p>{date.lecturerNameThai}</p>
                            </>
                        )
                            : "ไม่มีข้อมูล"
                    }
                </div>
            </div>

            <div>
                <div className="grid grid-cols-2">
                    <p>สอบกลางภาค</p>
                    <p>สอบปลายภาค</p>
                </div>
                <div className="grid grid-cols-2 text-sm text-gray-600">
                    <p>{}</p>
                    <p>{}</p>
                </div>
            </div>


        </div >
    )
}