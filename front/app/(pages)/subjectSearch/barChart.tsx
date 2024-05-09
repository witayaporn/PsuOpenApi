import { Bar } from "react-chartjs-2";
import { Chart, ChartData, registerables } from "chart.js";
import { useEffect, useState } from "react";

export default function BarChart(prop: any) {
    Chart.register(...registerables);
    const data = prop.data;
    const [subjectStat, setSubjectStat] = useState<ChartData<"bar">>({
        labels: [],
        datasets: [],
    });
    const fetchSubjectStat = () => {
        fetch(
            `http://localhost:8000/student/getSubjectStat/${data.subjectId}?year=${data.eduYear}&term=${data.eduTerm}`,
            {
                method: "GET",
                headers: {
                    accept: "application/json",
                },
            }
        )
            .then((res) => res.json())
            .then((stat) => {
                console.log(subjectStat);
                if (stat.length) {
                    var labels: string[] = [];
                    const datasets = stat.map((data: any) => {
                        console.log(data);
                        const label = data._id;
                        const dataset = data.summary.map((item: any) => {
                            labels.includes(item.studentFaculty)
                                ? null
                                : labels.push(item.studentFaculty);
                            return { x: item.studentFaculty, y: item.count };
                        });
                        return { data: dataset, label: label };
                    });
                    setSubjectStat({ labels: labels, datasets: datasets });
                } else {
                    setSubjectStat({ labels: [], datasets: [] });
                }
            });
    };

    useEffect(() => {
        fetchSubjectStat();
    }, []);
    return (
        <>
            <Bar
                data={subjectStat}
                width={"100%"}
                height={"1rem"}
                options={{
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            stacked: true,
                        },
                        y: {
                            stacked: true,
                        },
                    },
                }}
            >
                {/* {console.log(prop.shareStage)} */}
            </Bar>
        </>
    );
}
