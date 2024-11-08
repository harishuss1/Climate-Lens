import { Chart as ChartJS } from 'chart.js/auto';
import { PieChart } from 'react-chartjs-2';

//name to be changed?
export default function PieChart1({ data }) {
  if (!data || data.length === 0) {
    return <h2>no data</h2>;
  }
  return (
    <Line
      data={{
        labels: ['A', 'B'], //data.map((d) => d['dt'] || 'test'),
        datasets: [
          {
            label: [1, 2],
            data: data.map((d) => d['AverageTemperature']),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
            ],
            borderWidth: 1,
          }
        ]
      }}
    />
  );
}