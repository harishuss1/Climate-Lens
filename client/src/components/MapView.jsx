import MapChart from './MapChart';
import { useState } from 'react';
import { useEffect } from 'react';
import { getCode } from 'country-list';

export default function MapView() {

  const [data, setData] = useState([]);

  
  useEffect(() => {
    setData(fakeData.map((value) => {
      const filteredTemp = tempuratureData.filter(
        (data) => data.Country.toLowerCase() === value.Country.toLowerCase());
        
      console.log('TODO: floor this at like 1 or 2 decimal places');
      const averageTemp = filteredTemp.reduce(
        (sum, currentValue) => sum + currentValue.AverageTemperature, 0) / filteredTemp.length;
      // lazy way to repalce the all-caps country with the properly capitalized one
      value.Country = filteredTemp[0].Country;
      value.averageTemp = averageTemp;
      value.CountryCode = getCode(value.Country);
      return value;
    }));
  }, [setData]);


  return (
    <div>
      <MapChart data={data} />
    </div>
  );
}


// processing steps:
// get all temperature info for that year
// get all emission info for that year.
// for each country in the emission data:
//    .filter() temp data by the country name
//    average it all together
//    attach the average temperature
// average temperature gets calculated
// average tmepuature gets attached to a associated emmisons data object
/* 
emissionData.map((value) => {
  const filteredTemp = tempData
    .filter((data) => data.country.toLowerCase() === value.country.toLowerCase())
  const averageTemp = filteredTemp
    .reduce((accumulator, currentValue) => accumulator + currentValue) / filteredTemp.length
  value.averageTemp = averageTemp;
  value.countryCode = getCountryCode(value.Country); //this is the super annoying part
  return value;
})


*/

const fakeData = [{
  Year: 2008, 
  Country: 'AFGHANISTAN',
  // CountryCode: 'AF',
  Total: 1161,
  SolidFuel: 294,
  LiquidFuel: 781,
  GasFuel: 81,
  Cement: 4,
  GasFlaring: '',
  PerCapita: 0.044834513,
  BunkerfuelsNotInTotal: 41,
  // AverageTemp: 10
}];

const tempuratureData = [
  {
    dt:'2008-12-01',
    AverageTemperature: 6,
    Country: 'Afghanistan'
  },
  {
    dt:'2008-11-01',
    AverageTemperature: 5.5,
    Country: 'Afghanistan'
  },
  {
    dt:'2008-10-01',
    AverageTemperature: 5,
    Country: 'Afghanistan'
  },
  {
    dt:'2008-09-01',
    AverageTemperature: 4.5,
    Country: 'Afghanistan'
  },
  {
    dt:'2008-08-01',
    AverageTemperature: 4,
    Country: 'Afghanistan'
  },
  {
    dt:'2008-07-01',
    AverageTemperature: 4.5,
    Country: 'Afghanistan'
  },
  {
    dt:'2008-06-01',
    AverageTemperature: 4,
    Country: 'Afghanistan'
  },
  {
    dt:'2008-05-01',
    AverageTemperature: 3.5,
    Country: 'Afghanistan'
  },
  {
    dt:'2008-04-01',
    AverageTemperature: 3,
    Country: 'Afghanistan'
  },
  {
    dt:'2008-03-01',
    AverageTemperature: 2.5,
    Country: 'Afghanistan'
  },
  {
    dt:'2008-02-01',
    AverageTemperature: 2,
    Country: 'Afghanistan'
  },
  {
    dt:'2008-01-01',
    AverageTemperature: 1.5,
    Country: 'Afghanistan'
  },
];





