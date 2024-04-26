import { Bar } from "react-chartjs-2"
import { Chart, registerables } from "chart.js";

export default function BarChart() {
    
    Chart.register(...registerables);
    const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    const data = {
        labels: labels,
        datasets: [{
            data: [65, 59, 80, 81, 56, 55, 40, 21, 54, 78, 10, 25, 29],
            borderWidth: 1
        }]
    };

    return (
        <>
            <Bar
                data={data}
                width={"100%"}
                height={"1rem"}
                options={{ maintainAspectRatio: false }}
            >

            </Bar>
        </>
    )
}