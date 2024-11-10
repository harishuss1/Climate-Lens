// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';


//name to be changed?
export default function LineChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <Line
        data={{
          labels: [],
          datasets: [
            {
              label: 'No data available. Select a country!',
              data: [],
            }
          ]
        }}
      />);
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
      options={{
        responsive: true,
        maintainAspectRatio: false
      }}
    />
  );
}