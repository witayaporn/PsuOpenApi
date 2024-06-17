import { Bar } from "react-chartjs-2";
import { Chart, ChartData, registerables } from "chart.js";

export default function BarChart(prop: any) {
    Chart.register(...registerables);
    const data = prop.data;
;
    return (
        <>
            <Bar
                data={data}
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
            </Bar>
        </>
    );
}
