import TimeTable from "./timeTable"

export default function PlanPage() {
    return (
        <section>
            <div className="grid grid-cols-1 gap-5 mb-3">
                <div className="grid grid-cols-1 gap-4">
                    <p className="text-4xl font-bold text-right">Your Plan</p>
                </div>
                <div>
                    <TimeTable />
                </div>
                <div className="grid grid-cols-1 gap-2 px-6 py-4 bg-white w-full h-[520px] border rounded-lg">
                    <p className="text-3xl font-bold">Your Interests</p>
                    <div className="bg-white w-full h-[520px] border-t-2">

                    </div>
                </div>
            </div>
            <div>

            </div>
        </section>
    )
}