import { Chart as ChartJS } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

//name to be changed?
export default function LineChart({ data }) {
  if (!data || data.length === 0) {
    return <h2>no data</h2>;
  }
  return (
    <Line
      data={{
        labels: data.map((d) => d['dt'] || 'test'),
        datasets: [
          {
            label: data[0]['Country'],
            data: data.map((d) => d['AverageTemperature']),
          }
        ]
      }}
    />
  );
}