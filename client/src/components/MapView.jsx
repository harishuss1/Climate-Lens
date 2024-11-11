import MapChart from './MapChart';

export default function MapView() {
  const fakeData = [{
    Year: 2008, 
    Country: 'Afganistan',
    CountryCode: 'AF',
    Total: 1161,
    SolidFuel: 294,
    LiquidFuel: 781,
    GasFuel: 81,
    Cement: 4,
    GasFlaring: '',
    PerCapita: 0.044834513,
    BunkerfuelsNotInTotal: 41,
    AverageTemp: 10
  }];


  return (
    <div>
      <MapChart data={fakeData} />
    </div>
  );
}