import MapChart from './MapChart';
import { useState } from 'react';
import { useEffect } from 'react';
import { getCode } from 'country-list';

export default function MapView() {

  const [year, setYear] = useState(0);
  const [data, setData] = useState([]);

  
  useEffect(() =>  {
    async function getData(){
      //Makes it not run while year is unselected
      if(year){
        const [emmisonsData, tempuratureData] = await Promise.all([
          (await fetch(`/api/emissions/${year}`)).json(),
          // needs to be replaced with an actual route
          (await fetch(`/api/temp/Canada/${year}`)).json()
        ]);
        
        setData(formatData(emmisonsData, tempuratureData));
      }
    }
    getData();
  }, [year, setData]);


  return (
    <div>
      <select value={year} onChange={(e) => setYear(e.target.value)}>
        <option value="">Select Year</option>
        <option value="2008">2008</option>
        <option value="2009">2009</option>
        <option value="2010">2010</option>
        <option value="2011">2011</option>
        <option value="2012">2012</option>
        <option value="2013">2013</option>
      </select>
      <MapChart data={data} />
    </div>
  );
}


function formatData(emmisonsData, tempuratureData){
  return emmisonsData.map((value) => {
    const filteredTemp = tempuratureData.filter(
      (data) => data.Country.toLowerCase() === value.Country.toLowerCase());
    
    console.log('TODO: floor this at like 1 or 2 decimal places');
    const averageTemp = filteredTemp.reduce(
      (sum, currentValue) => sum + currentValue.AverageTemperature, 0) / filteredTemp.length;
    // lazy way to repalce the all-caps country with the properly capitalized one
    // value.Country = filteredTemp[0].Country;
    value.averageTemp = averageTemp;
    value.CountryCode = getCode(value.Country);
    return value;
  });
}
