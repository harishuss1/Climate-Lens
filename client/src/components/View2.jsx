import { useState, useEffect } from 'react';
import BarChart from './BarChart.jsx';
import SearchFilter from './SearchFilter.jsx';
import Narrative from './Narrative.jsx';
/**
 * View2 Component for comparing average temperatures of 
 * multiple countries over a selected year range.
 */

export default function View2() {
  const [countries, setCountries] = useState([{ country: 'Canada', data: null, isValid: true }]);
  const [startYear, setStartYear] = useState('2012');
  const [endYear, setEndYear] = useState('2013');
  const [errorMessage, setErrorMessage] = useState('');
  const [chartData, setChartData] = useState('');
  const maxCountries = 3;

  // Fetch Canada's data on initial load
  useEffect(() => {
    fetchData(0); 
  }, []);

  /**
   * Fetches data for the specified country and year range.
   * @param {number} index - The index of the country in the countries array.
   */
  const fetchData = async (index) => {
    const { country, isValid } = countries[index];
    if (!country || !isValid || !startYear || !endYear) {
      setErrorMessage('Please select a valid country and both start and end years.');
      return;
    }
    try {
      const response = await fetch(`/api/temp/${country}/${startYear}/${endYear}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      if (data.length === 0) {
        setErrorMessage(`No data found for ${country} in the selected year range.`);
        countries[index].data = { country, dataPoints: [] };
      } else {
        setErrorMessage('');
        const updatedCountries = [...countries];
        updatedCountries[index].data = {
          country,
          dataPoints: data,
        };
        setCountries(updatedCountries);
        setChartData( countries.
          filter((c) => c.data && c.data.dataPoints).
          map((c) => c.data));
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(`Error fetching data for ${country}. Please try again.`);
    }
  };

  /**
   * Adds a new country input field to the form if the number of countries 
   * is less than the max limit (3).
   */
  const addCountryField = () => {
    if (countries.length < maxCountries) {
      setCountries([...countries, { country: '', data: null, isValid: false }]);
    }
  };

  /**
   * Removes a country input field at a specific index.
   * 
   * @param {number} index - The index of the country to remove.
   */
  const removeCountryField = (index) => {
    const updatedCountries = countries.filter((_, i) => i !== index);
    setCountries(updatedCountries);
  };

  /**
   * Fetches data for all selected countries.
   */
  const fetchAllData = () => {
    countries.forEach((_, index) => fetchData(index));
  };

  /**
    * Updates the selected country at a specific index.
    * 
    * @param {number} index - The index of the country to update.
    * @param {string} country - The new country value.
    */
  const updateCountry = (index, country) => {
    const updatedCountries = [...countries];
    updatedCountries[index].country = country;
    setCountries(updatedCountries);
  };

  /**
   * Updates the validity of a selected country at a specific index.
   * 
   * @param {number} index - The index of the country to update.
   * @param {boolean} isValid - The validity status of the country.
   */
  const updateValidity = (index, isValid) => {
    const updatedCountries = [...countries];
    updatedCountries[index].isValid = isValid;
    setCountries(updatedCountries);
  };

  const selectedCountries = countries.map(c => c.country);


  return (
    <div className="view2-container">
      <div className="chart-container">
        <h2 className="view-title">Compare Average Temperatures by Country</h2>
        <p className="view-description">
          Select multiple countries to compare average temperatures over a selected time range.
        </p>
        <BarChart data={chartData} />
      </div>

      <div className="controls-container">
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {countries.map((item, index) =>
          <div key={index} className="country-input-group">
            <SearchFilter
              setCountry={(country) => updateCountry(index, country)}
              setIsValid={(isValid) => updateValidity(index, isValid)}
              excludedCountries={selectedCountries.filter((_, i) => i !== index)}
            />
            <button onClick={() => fetchData(index)}>Fetch Data</button>
            {index > 0 &&
              <button onClick={() => removeCountryField(index)}>Remove</button>
            }
          </div>
        )}

        {countries.length < maxCountries &&
          <button onClick={addCountryField} className="add-country-btn">
            Add Another Country
          </button>
        }

        <select className="year-select" value={startYear} onChange={(e) =>
          setStartYear(e.target.value)}>
          <option value="">Start Year</option>
          {[2008, 2009, 2010, 2011, 2012, 2013].map((year) =>
            <option key={year} value={year}>{year}</option>
          )}
        </select>

        <select className="year-select" value={endYear} onChange={(e) =>
          setEndYear(e.target.value)}>
          <option value="">End Year</option>
          {[2008, 2009, 2010, 2011, 2012, 2013].map((year) =>
            <option key={year} value={year}>{year}</option>
          )}
        </select>

        <button onClick={fetchAllData} className="retrieve-all-btn">Retrieve All Data</button>

      </div>
      <Narrative
        title="Cross-Country Climate Insights"
        // eslint-disable-next-line max-len
        text="This view compares the average temperatures of multiple countries over a selected time range. Such a comparison enables us to understand which regions are experiencing the greatest impact of climate change. For instance, while some countries may see moderate temperature increases, others may face extreme changes due to factors like geographical location or emissions intensity. This analysis provides a foundation for cooperative climate efforts between nations."
      />
    </div>
  );
}
