
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from 'chart.js/auto';
import { Pie } from 'react-chartjs-2';
import React from 'react';

const PieChart = React.memo(({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ width: '300px', height: '300px' }}>
        <Pie
          data={{
            labels: ['No data availabe. Select a country!'],
            datasets: [
              {
                label: 'No Data',
                data: [1],
                backgroundColor: ['#e0e0e0']
              }
            ]
          }}
        />
      </div>
    );
  }

  //Include bunker fuels
  const totalEmissions = data[0]['Total'] + data[0]['Bunker fuels (Not in Total)'];

  //get all the keys name for labeling except total,country,year, 
  //Per Capita and id for the pie chart label
  var labels = Object.keys(data[0]).filter(key =>
    key !== 'Total' && key !== 'Country' && key !== 'Year' && key !== '_id' && key !== 'Per Capita'
  );
  //Get the values of each label (key)
  const filteredData = labels.map(label => data[0][label]);

  //Change the key name for bunker fuels
  labels = labels.map(label => {
    if (label === 'Bunker fuels (Not in Total)') {
      return 'Bunker Fuels';
    }
    return label;
  });
  
  function calculatePercentage(value, total) {
    return ((value / total) * 100).toFixed(2);
  }
  const percentageLabels = labels.map((label, index) => {
    const percentage = calculatePercentage(filteredData[index], totalEmissions);
    return `${label} (${percentage}%)`;
  });

  return (
    <div className="pie-chart-container">
      <Pie
        data={{
          labels: percentageLabels,
          datasets: [
            {
              data: filteredData,
              backgroundColor: ['red', 'blue', 'green', 'yellow', 'orange', 'violet', 'pink'],
              borderWidth: 1,
            }
          ]
        }}
        options={{
          plugins: {
            //Configuration for the legend table
            legend: {
              position: 'right',
              title: {
                display: true,
                text: 'Type of emissions',
                font: {
                  size: 15,
                  weight: 'bold',
                }
              },
            }
          },
          // To make the chart resizeable when resizing the page
          responsive: true,
          maintainAspectRatio: false
        }

        }
      />
    </div>
  );
});
PieChart.displayName = 'PieChart';
export default PieChart;