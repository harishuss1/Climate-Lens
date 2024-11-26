/* eslint-disable camelcase */
import { useLayoutEffect } from 'react';
import { Root, color } from '@amcharts/amcharts5';
// eslint-disable-next-line max-len
import { MapChart as Am5MapChart, MapPolygonSeries, geoOrthographic } from '@amcharts/amcharts5/map';
import worldLow from '@amcharts/amcharts5-geodata/worldLow';
import  Animated  from '@amcharts/amcharts5/themes/Animated';




function formatData(data){
  const formattedText = 
  `${data.Country} \n` +
  `Total emissions: ${data.Total} MMT (million metric tons)\n` +
  `Solid fuel: ${data.SolidFuel} MMT\n` +
  `Liquid Fuel: ${data.LiquidFuel} MMT\n` +
  `Gas Fuel: ${data.GasFuel} MMT\n` +
  `Cement: ${data.Cement} MMT\n` +
  `Gas Flaring: ${data.GasFlaring} MMT\n` +
  `\n` +
  `Bunker fuels (not included in total): ${data.BunkerfuelsNotInTotal} MMT\n` +
  `Per Capita:      ${data.PerCapita} MMT\n` +
  `\n` +
  `AverageTemp ${data.AverageTemp} °C`;
  return formattedText;
}


function MapChart({data}) {
  useLayoutEffect(() => {
    const root = Root.new('chartdiv');

    root.setThemes([
      Animated.new(root)
    ]);

    const chart = root.container.children.push(
      Am5MapChart.new(root, {
        panX: 'rotateX',
        panY: 'rotateY',
        projection: geoOrthographic()
      })
    );
    
    const templateData = data.map((value) => {
      return {
        id: value.CountryCode, 
        polygonSettings: {
          fill: color(0x1e88e5)
        },
        Country: value['Country'],
        Total: value['Total'],
        SolidFuel: value['Solid Fuel'],
        LiquidFuel: value['Liquid Fuel'],
        GasFuel: value['Gas Fuel'],
        Cement: value['Cement'],
        GasFlaring: value['Gas Flaring'],
        PerCapita: value['Per Capita'],
        BunkerfuelsNotInTotal: value['Bunker fuels (Not in Total)'],
        AverageTemp: value['averageTemp'],

        get text(){
          return formatData(this);
        }
      };
    });
    
    // Create polygon series
    const polygonSeries = chart.series.push(
      MapPolygonSeries.new(root, {
        geoJSON: worldLow,
        // exclude: excluded,
        useGeodata: true,
        fill: color(0x808080)
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      templateField: 'polygonSettings', 
    });

    
    polygonSeries.mapPolygons.template.adapters.add('tooltipText', (text, target) => {
      const dataContext = target.dataItem.dataContext;
      
      if(dataContext.text){
        return dataContext.text;
      } else {
        return 'No data for this country';
      }
    });

    polygonSeries.data.setAll(templateData);
      
    polygonSeries.mapPolygons.template.states.create('hover', {
      fill: color(0xffca28)
    });

    return () => {
      root.dispose();
    };
  }, [data]);

  return (
    <div id="chartdiv" className="map-chart-container"></div>
  );
}
export default MapChart;