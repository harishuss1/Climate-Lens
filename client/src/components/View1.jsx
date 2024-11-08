import LineChart from './LineChart.jsx';
import { useState } from 'react';

export default function View1() {
  const [country, setCountry] = useState('');
  const [year, setYear] = useState('');
  const [chartData, setChartData] = useState(null);
  const fetchData = async () => {
    try {
      const response = await fetch(`/api/temp/${country}/${year}`);
      if (!response.ok) {
        throw new ArgumentException('Fetch went wrong');
      }

      const data = await response.json();
      console.log(data);
      setChartData(data);
    } catch (error) {
      console.error('error fetching: ', error);
    }
  };
  
  return (
    <div className="flex">
      <LineChart data={chartData} />
      <input type="text"
        placeholder="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      ></input>

      <select value={year} onChange={(e) => setYear(e.target.value)}>
        <option value="">Select Year</option>
        <option value="2008">2008</option>
        <option value="2009">2009</option>
        <option value="2010">2010</option>
        <option value="2011">2011</option>
        <option value="2012">2012</option>
        <option value="2013">2013</option>
      </select>

      <button onClick={fetchData}>Retrieve</button>
    </div>
  );
}