import LineChart from './LineChart';
import PieChart from './PieChart';
import Search from './SearchFilter.jsx';
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
        <section className="chart-container">
          <LineChart data={chartData} />
        </section>

        <section className="controls-container">
          {showErrorMessage && (!isValidCountry || !year) && (
            <p className="error">Please select a valid country and year</p>
          )}
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
      <h2>Causes of CO2 Emissions</h2>
      <section className="chart-container">
        <PieChart data={pieData} />
      </section>
    </div>
  );
}