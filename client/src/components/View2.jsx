import { useState } from 'react';
import BarChart from './BarChart.jsx';

export default function View2() {
  const [countries, setCountries] = useState([{ country: '', data: null }]);
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const maxCountries = 3;

  const fetchData = async (index) => {
    const { country } = countries[index];
    if (!country || !startYear || !endYear) {
      setErrorMessage('Please enter a country and select both start and end years.');
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
      } else {
        setErrorMessage('');
        const updatedCountries = [...countries];
        updatedCountries[index].data = {
          country,
          dataPoints: data,
        };
        setCountries(updatedCountries);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage(`An error occurred while fetching data for ${country}. Please try again.`);
    }
  };

  const handleCountryChange = (index, value) => {
    const updatedCountries = [...countries];
    updatedCountries[index].country = value;
    setCountries(updatedCountries);
  };

  const addCountryField = () => {
    if (countries.length < maxCountries) {
      setCountries([...countries, { country: '', data: null }]);
    }
  };

  const removeCountryField = (index) => {
    const updatedCountries = countries.filter((_, i) => i !== index);
    setCountries(updatedCountries);
  };

  const fetchAllData = () => {
    countries.forEach((_, index) => fetchData(index));
  };

  return (
    <div className="flex">
      <BarChart data={countries.map(c => c.data).filter(Boolean)} />

      <div>
        {countries.map((item, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder={`Country ${index + 1}`}
              value={item.country}
              onChange={(e) => handleCountryChange(index, e.target.value)}
            />
            <button onClick={() => fetchData(index)}>Fetch Data</button>
            {index > 0 && (
              <button onClick={() => removeCountryField(index)}>Remove</button>
            )}
          </div>
        ))}
        {countries.length < maxCountries && (
          <button onClick={addCountryField}>Add Another Country</button>
        )}
      </div>

      <select value={startYear} onChange={(e) => setStartYear(e.target.value)}>
        <option value="">Start Year</option>
        <option value="2008">2008</option>
        <option value="2009">2009</option>
        <option value="2010">2010</option>
        <option value="2011">2011</option>
        <option value="2012">2012</option>
        <option value="2013">2013</option>
      </select>
      <select value={endYear} onChange={(e) => setEndYear(e.target.value)}>
        <option value="">End Year</option>
        <option value="2008">2008</option>
        <option value="2009">2009</option>
        <option value="2010">2010</option>
        <option value="2011">2011</option>
        <option value="2012">2012</option>
        <option value="2013">2013</option>
      </select>

      <button onClick={fetchAllData}>Retrieve All Data</button>

      {/* Display error message if there is one */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}
