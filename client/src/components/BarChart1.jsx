import { Chart as ChartJS } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

//name to be changed?
export default function BarChart1({ data }) {
  if (!data || data.length === 0) {
    return <h2>no data</h2>;
  }
  return (
    <Line
      data={{
        labels: ['A', 'B', 'C'],//data.map((d) => d['dt'] || 'test'),
        datasets: [
          {
            label: 'Revenue',
            data: [12, 24, 55], // data.map((d) => d['AverageTemperature']),
          }
        ]
      }}
    />
  );
}