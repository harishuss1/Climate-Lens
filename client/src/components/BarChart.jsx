// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

const colorPalette = [
  'rgba(255, 99, 132, 0.7)', 
  'rgba(54, 162, 235, 0.7)', 
  'rgba(75, 192, 192, 0.7)'  
];

export default function BarChart({ data }) {
  if (!data || data.length === 0) {
    return <h2>No data</h2>;
  }

  const chartData = {
    labels: [...new Set(data.flatMap(countryData => countryData.dataPoints.map(d => d.year)))],
    datasets: data.map((countryData, index) => ({
      label: countryData.country,
      data: countryData.dataPoints.map(d => d.avgTemperature),
      backgroundColor: colorPalette[index % colorPalette.length],
    })),
  };

  return <Bar data={chartData} />;
}
