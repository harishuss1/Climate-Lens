import { useState, useEffect } from 'react';

const TemperatureStub = () => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/temp/Afghanistan/2008') 
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch temperature data');
        }
        return response.json();
      })
      .then((data) => setTemperatureData(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <h2>Temperature Data Stub</h2>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <ul>
          {temperatureData.map((temp, index) => (
            <li key={index}>
              {temp.Country} - {temp.dt}: {temp.AverageTemperature}°C
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TemperatureStub;
