// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import React from 'react';

const colorPalette = [
  'rgba(255, 99, 132, 0.7)', 
  'rgba(54, 162, 235, 0.7)', 
  'rgba(75, 192, 192, 0.7)'  
];
const BarChart = React.memo(({ data }) => {
  const hasData = data && data.length > 0 && data.some(countryData => 
    countryData.dataPoints.length > 0);

  // Chart data with actual or placeholder data if no actual data is provided
  const chartData = {
    labels: hasData 
      ? [...new Set(data.flatMap(countryData => countryData.dataPoints.map(d => d.year)))]
      : [''],  
    datasets: hasData 
      ? data.map((countryData, index) => ({
        label: countryData.country,
        data: countryData.dataPoints.map(d => d.avgTemperature),
        backgroundColor: colorPalette[index % colorPalette.length],
      }))
      : [{
        label: 'No Data Available',
        data: [0], 
        backgroundColor: 'rgba(211, 211, 211, 0.5)', 
      }],
  };

  return <Bar data={chartData} />;
});
BarChart.displayName = 'BarChart';
export default BarChart;