
export default function SectionCard (prop : any) {
    const data = prop.data
    const noInterest: number = 143
    const percentage: number = (data.noOffer / noInterest) * 100
    return (
        <div className="w-full p-3 grid grid-cols-2 rounded-lg bg-green-200">
            {/* {console.log(prop)} */}
            <div>
                <p className="font-bold text-sm text-gray-800">ตอน {data.section}</p>
            </div>
            <div className="text-right">
                <p className="text-sm text-gray-800">โอกาส {percentage.toFixed(2)} %</p>
            </div>
        </div>
    )
}