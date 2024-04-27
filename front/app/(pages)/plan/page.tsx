"use client"
import { useEffect, useState } from "react"
import SelectableSectionCard from "./selectableSubjectCard"
import TimeTable from "./timeTable"
import mockup from "@/public/interest-card-mock.json"

export default function PlanPage() {
    const [classDate, setClassDate] = useState([])
    const [selectSubject, setSelectSubject] = useState([])

    const handleSubjectSelect = (subjectId: string, select: boolean) => {
        let temp: any = [...selectSubject]
        let filterSubject: JSON[]
        if(select){
            filterSubject = classDate.filter((item) => item[0].subjectId == subjectId)
            temp.push(filterSubject)
        }else{
            temp = temp.filter((item) => item[0][0].subjectId != subjectId)            
        }        
        setSelectSubject(temp)
    }

    useEffect(() => {
        mockup.map((subject) => {
            fetch(`https://api-gateway.psu.ac.th/Test/regist/SectionClassdateCampus/01/${subject.term}/${subject.year}/${subject.subjectId}/?section=${subject.section}&offset=0&limit=100`, {
                method: 'GET',
                cache: 'force-cache',
                headers: {
                    "credential": process.env.NEXT_PUBLIC_API_KEY
                }
            })
                .then((res) => res.json())
                .then((data) => setClassDate(classDate => [...classDate, data.data]))
        })
    }, [])

    return (
        <section>
            {/* {console.log(classDate)} */}
            <div className="grid grid-cols-1 gap-5">
                <div className="grid grid-cols-1 gap-4">
                    <p className="text-4xl font-bold text-right">Your Plan</p>
                </div>
                <div>
                    <TimeTable data={selectSubject}/>
                </div>
                <div className="grid grid-cols-1 gap-2 px-6 py-4 mb-16 bg-white w-full border rounded-lg">
                    <p className="text-3xl font-bold">Your Interests</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-white w-full border-t-2 p-2">
                        {
                            classDate.map((subject, key) => <SelectableSectionCard key={key} data={subject} onClick={handleSubjectSelect} />)
                        }
                    </div>
                </div>
            </div>
            <div>

            </div>
        </section>
    )
}