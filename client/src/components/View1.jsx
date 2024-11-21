import LineChart from './LineChart';
import PieChart from './PieChart';
import Search from './SearchFilter.jsx';
import { useState, useEffect } from 'react';


/**
 * View1 component displays the temperature and CO2 emissions data 
 * for a selected country and year. It allows users to choose a country, 
 * select a year, and then fetch and visualize the corresponding data 
 * in a LineChart and a PieChart.
 */

export default function View1() {
  const [country, setCountry] = useState('Canada');
  const [year, setYear] = useState('2012');
  const [chartData, setChartData] = useState(null);
  const [pieData, setPieData] = useState(null);
  const [isValidCountry, setIsValidCountry] = useState(true);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    fetchData();
    setIsValidCountry(false);
  }, []);

  /**
   * fetchData function retrieves temperature and emissions data based on the selected
   * country and year. It displays an error message if the country or year is not selected.
   * If data is fetched successfully, it updates the state with the new chart data.
   */
  const fetchData = async () => {
    if (!isValidCountry || !year) {
      setShowErrorMessage(true);
      return;
    }
    
    // Hide the error message if both fields are valid
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
      //sort the date before setting
      setChartData(tempData.sort((a, b) => new Date(a.dt) - new Date(b.dt)) );
      setPieData(emissionsData);

    } catch (error) {
      console.error('error fetching: ', error);
    }
  };

  return (
    <div>
      <div className="flex">
        <section className="chart-container">
          <h2 className="view-title">Temperature and Emissions Analysis</h2>
          <p className="view-description">
        Analyze the average monthly temperatures and CO2 emissions for a selected country and year.
          </p>
          <LineChart data={chartData} />
        </section>

        <section className="controls-container">
          {showErrorMessage && (!isValidCountry || !year) && 
            <p className="error">Please select a valid country and year</p>
          }
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
      <section className="chart-container">
        <h2>Causes of CO2 Emissions</h2>
        <PieChart data={pieData} />
      </section>
    </div>
  );
}