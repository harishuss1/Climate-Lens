
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from 'chart.js/auto';
import { Pie } from 'react-chartjs-2';

//name to be changed?
export default function PieChart1({ data }) {
  if (!data || data.length === 0) {
    return <h2>no data</h2>;
  }

  //get all the keys except total,country,year and id for the pie chart label
  const labels = Object.keys(data[0]).filter(key =>
    key !== 'Total' && key !== 'Country' && key !== 'Year' && key !== '_id'
  );

  return (
    <Pie
      data={{
        labels: labels,
        datasets: [
          {
            //for each key, get its value 
            data: labels.map(label => data[0][label]),
            backgroundColor: labels.map((label, index) =>
              `rgba(${Math.floor(Math.random() * 256)}, 
            ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
            ),
            borderWidth: 1,
          }
        ]
      }}
    />
  );
}