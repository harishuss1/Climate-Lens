import { useState } from 'react';
import BarChart from './BarChart.jsx';
import SearchFilter from './SearchFilter.jsx';

export default function View2() {
  const [countries, setCountries] = useState([{ country: '', data: null, isValid: false }]);
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const maxCountries = 3;
  
  const fetchData = async (index) => {
    const { country } = countries[index];
    if (!country || !startYear || !endYear || !countries[index].isValid) {
      setErrorMessage('Please enter a valid country and select both start and end years.');
      return;
    }

    try {
      const response = await fetch(`/api/temp/${country}/${startYear}/${endYear}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      const updatedCountries = [...countries];
      updatedCountries[index].data = data.length
        ? { country, dataPoints: data }
        : { country, dataPoints: [] };
      setCountries(updatedCountries);
      setErrorMessage(data.length ? '' : `No data found for ${country} in the selected range.`);
    } catch (error) {
      console.error(error);
      setErrorMessage(`Error fetching data for ${country}. Please try again.`);
    }
  };

  const addCountryField = () => {
    if (countries.length < maxCountries) {
      setCountries([...countries, { country: '', data: null, isValid: false }]);
    }
  };

  const removeCountryField = (index) => {
    setCountries(countries.filter((_, i) => i !== index));
  };

  const fetchAllData = () => {
    countries.forEach((_, index) => fetchData(index));
  };

  const updateCountry = (index, country) => {
    const updatedCountries = [...countries];
    updatedCountries[index].country = country;
    setCountries(updatedCountries);
  };

  const updateValidity = (index, isValid) => {
    const updatedCountries = [...countries];
    updatedCountries[index].isValid = isValid;
    setCountries(updatedCountries);
  };

  const chartData = countries
    .filter((c) => c.data && c.data.dataPoints)
    .map((c) => c.data);

  return (
    <div className="view2-container">
      <div className="chart-container">
        <BarChart data={chartData} />
      </div>

      <div className="controls-container">
        {countries.map((item, index) => (
          <div key={index} className="country-input-group">
            <SearchFilter
              setCountry={(country) => updateCountry(index, country)}
              setIsValid={(isValid) => updateValidity(index, isValid)}
            />
            <button onClick={() => fetchData(index)}>Fetch Data</button>
            {index > 0 && (
              <button onClick={() => removeCountryField(index)}>Remove</button>
            )}
          </div>
        ))}
        
        {countries.length < maxCountries && (
          <button onClick={addCountryField} className="add-country-btn">
            Add Another Country
          </button>
        )}

        <select className="year-select" value={startYear} onChange={(e) => 
          setStartYear(e.target.value)}>
          <option value="">Start Year</option>
          {[2008, 2009, 2010, 2011, 2012, 2013].map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select className="year-select" value={endYear} onChange={(e) => 
          setEndYear(e.target.value)}>
          <option value="">End Year</option>
          {[2008, 2009, 2010, 2011, 2012, 2013].map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <button onClick={fetchAllData} className="retrieve-all-btn">Retrieve All Data</button>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
}
