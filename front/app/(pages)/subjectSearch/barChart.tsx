import { Bar } from "react-chartjs-2"
import { Chart, registerables } from "chart.js";
import facultyData from '@/public/faculty-data.json'

export default function BarChart() {
    
    Chart.register(...registerables);
    const labels = facultyData.filter((fac) => fac.facNameThai != 'ส่วนกลางมหาวิทยาลัย').map((filtered) => filtered.facNameThai);
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