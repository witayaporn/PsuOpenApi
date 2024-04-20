export default function TimeTable() {
    const maxTime: number = 17
    const minTime: number = 8

    return (
        <>
            <div className="relative w-full text-xs bg-white rounded-lg border-2 border-slate-300 overflow-x-scroll">
                <div className="absolute z-[2000] inline-block" style={{ width: `${(maxTime - minTime + 2) * 120}px` }}>
                    <div className="relative h-[57px] bg-green-100 opacity-50">
                    </div>
                    <div className="relative h-[66px] py-1 pl-[120px] opacity-50">
                        <a className="absolute bg-red-300 w-[240px] h-[60px] hover:border rounded-md">

                        </a>
                        <a className="absolute bg-blue-300 w-[120px] h-[60px] left-[480px] hover:border rounded-md">

                        </a>
                    </div>
                    <div className="relative h-[66px] py-1 pl-[120px] opacity-50">

                    </div>
                    <div className="relative h-[66px] py-1 pl-[120px] opacity-50">

                    </div>
                    <div className="relative h-[66px] py-1 pl-[120px] opacity-50">

                    </div>
                    <div className="relative h-[66px] py-1 pl-[120px] opacity-50">

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