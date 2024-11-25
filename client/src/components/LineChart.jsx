// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import React from 'react';

const LineChart = React.memo(({ data }) => {
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

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const year = data[0]['dt'].split('-')[0];
  return (
    <Line
      data={{
        labels: monthNames,
        datasets: [
          {
            label: data[0]['Country'],
            data: data.map((d) => d['AverageTemperature']),
          }
        ]
      }}
      options={{
        scales: {
          x: {
            title: {
              display: true,
              text: `Year: ${year}`,
            },
          },
          y: {
            title: {
              display: true,
              text: 'Average temperature',
            },
          },
        },
      }}
    />
  );
});
LineChart.displayName = 'LineChart';
export default LineChart;