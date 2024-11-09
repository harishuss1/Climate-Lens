import './View1.css';
import LineChart from './LineChart.jsx';
import PieChart from './PieChart.jsx';
import Search from './Search.jsx';
import { useState } from 'react';
export default function View1() {
  const [country, setCountry] = useState('');
  const [year, setYear] = useState('');
  const [chartData, setChartData] = useState(null);
  const [pieData, setPieData] = useState(null);
  const [isValidCountry, setIsValidCountry] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const fetchData = async () => {
    if (!isValidCountry || !year) {
      setShowErrorMessage(true);
      return;
    }

    setShowErrorMessage(false);
    try {
      const [tempResponse, emissionsResponse] = await Promise.all([
        fetch(`/api/temp/${country}/${year}`),
        fetch(`/api/emissions/${country}/${year}`)
      ]);

      if (!tempResponse.ok) {
        throw new Error('Fetch from /api/temp... went wrong');
      }

      if (!emissionsResponse.ok) {
        throw new Error('Fetch from /api/emissions went wrong');
      }

      const tempData = await tempResponse.json();
      const emissionsData = await emissionsResponse.json();

      setChartData(tempData);
      setPieData(emissionsData);

    } catch (error) {
      console.error('error fetching: ', error);
    }
  };

  return (
    <div>
      <h2>Average Monthly Temperature</h2>
      <div className="flex">

        <section className="lineChart">
          <LineChart data={chartData} />
        </section>
        <section className="search">
          {!isValidCountry && showErrorMessage &&
            <p className="error">Please select a valid country</p>}

          {!year && showErrorMessage && <p className="error"> Please select a year</p>}

          <Search setCountry={setCountry} setIsValid={setIsValidCountry} />

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
        </section>
      </div>
      <h2> Emissions Breakdown </h2>
      <section className="pieChart">
        <PieChart data={pieData} />
      </section>
    </div >
  );
}