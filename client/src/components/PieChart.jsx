
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from 'chart.js/auto';
import { Pie } from 'react-chartjs-2';


export default function PieChart({ data }) {
  if (!data || data.length === 0) {
    return <h2>no data</h2>;
  }

  const totalEmissions = data[0]['Total'];
  //get all the keys except total,country,year and id for the pie chart label
  const labels = Object.keys(data[0]).filter(key =>
    key !== 'Total' && key !== 'Country' && key !== 'Year' && key !== '_id'
  );

  const filteredData = labels.map(label => data[0][label]);

  function calculatePercentage(value, total) {
    return ((value / total) * 100).toFixed(1);
  }
  const percentageLabels = labels.map((label, index) => {
    const percentage = calculatePercentage(filteredData[index], totalEmissions);
    return `${label} (${percentage}%)`;
  });

  return (
    <div style={{ width: '100%', height: '800px' }}>
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

          }
        }
        }
      />
    </div>
  );
}