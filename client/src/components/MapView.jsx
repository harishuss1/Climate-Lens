import  { useState, useEffect, lazy, Suspense } from 'react';
import { getCode } from 'country-list';
import { useInView } from 'react-intersection-observer';
import Narrative from './Narrative';

const MapChart = lazy(() => import('./MapChart'));


export default function MapView() {

  const [year, setYear] = useState(0);
  const [data, setData] = useState([]);
  const { ref, inView } = useInView({
    triggerOnce: true, 
    threshold: 0.1, 
  });
  
  useEffect(() =>  {
    async function getData(){
      //Makes it not run while year is unselected
      if(year){
        const [emmisonsData, tempuratureData] = await Promise.all([
          (await fetch(`/api/emissions/${year}`)).json(),
          (await fetch(`/api/temp/${year}`)).json()
        ]);
        setData(formatData(emmisonsData, tempuratureData));
      }
    }
    getData();
  }, [year, setData]);


  return (
    <div className="map-view-container" ref={ref}>
      <h2 className="view-title">Global Emissions and Temperature Map</h2>
      <p className="view-description">
        Explore the global CO2 emissions and temperature averages by selecting a year below.
      </p>
      <select value={year} onChange={(e) => setYear(e.target.value)} className="year-select">
        <option value="">Select Year</option>
        <option value="2008">2008</option>
        <option value="2009">2009</option>
        <option value="2010">2010</option>
        <option value="2011">2011</option>
        <option value="2012">2012</option>
        <option value="2013">2013</option>
      </select>

      {inView && 
          <Suspense fallback={<div>Loading Map...</div>}>
            <MapChart data={data} />
          </Suspense>
      }

      <Narrative
        title="Visualizing Global Climate Patterns"
        // eslint-disable-next-line max-len
        text="The global map provides a holistic view of CO2 emissions and average temperatures across different countries and regions. By observing these patterns, we can identify hotspots of emissions and regions most affected by rising temperatures. This visualization underscores the interconnected nature of climate change, emphasizing the need for a global response to mitigate its effects. It also helps identify countries requiring more support to combat climate-related challenges."
      />
    </div>
  );
}


function formatData(emmisonsData, tempuratureData){
  return emmisonsData.map((value) => {
    const filteredTemp = tempuratureData.filter(
      (data) => data.Country.toLowerCase() === value.Country.toLowerCase());
  
    const averageTemp = filteredTemp.reduce(
      (sum, currentValue) => sum + currentValue.AverageTemperature, 0) / filteredTemp.length;
    if(averageTemp){
      value.averageTemp = Math.round(averageTemp * 100) / 100;
    } else {
      value.averageTemp = 'Data missing, ?';
    }
    // lazy way to repalce the all-caps country with the properly capitalized one
    if(filteredTemp[0] && filteredTemp[0].Country){
      value.Country = filteredTemp[0].Country;
    }
    value.CountryCode = getCode(value.Country);
    return value;
  });
}
