import facultyData from "../../../public/faculty-data.json"

export default function DetailCard(prop: any) {
    const propData = prop.data
    const facDetail = facultyData.filter((fac) => fac.facNameEng == propData.faculty)[0]
    const buildingDetail = { ...propData, facDetail }
    return (
        <div className="max-w-full overflow-hidden p-5 bg-white grid grid-cols-1 gap-y-3 rounded-lg border">
            <div className="text-center">
                <p className="font-bold text-xl">{buildingDetail.name}</p>
                <p className="text-lg">{buildingDetail.nameEng}</p>
            </div>
            <div className="px-4 pt-4 grid grid-cols-1 md:grid-cols-2 text-center border-t">
                <div className="px-4 grid grid-cols-1 text-center">
                    <p className="font-bold">สังกัด</p>
                    <p>{buildingDetail.facDetail.facNameThai}</p>
                </div>
                <div className="px-4 grid grid-cols-1 text-center">
                    <p className="font-bold">เว็บไซต์</p>
                    <a href={buildingDetail.facDetail.website} className="">{buildingDetail.facDetail.website}</a>
                </div>
                <p>Id {buildingDetail["@id"]}</p>
            </div>
        </div>
    )
}