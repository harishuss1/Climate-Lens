/* eslint-disable camelcase */
import { useLayoutEffect } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';

import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';




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
    let root = am5.Root.new('chartdiv');

    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    let chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: 'rotateX',
        panY: 'rotateY',
        projection: am5map.geoOrthographic()
      })
    );
    
    // let active = ['US', 'CA', 'AF', 'JP',];

    let templateData = data.map((value) => {
      return {
        id: value.CountryCode, 
        polygonSettings: {
          fill: am5.color(0x0000FF)
        },
        Country: value.Country,
        Total: value.Total,
        SolidFuel: value.SolidFuel,
        LiquidFuel: value.LiquidFuel,
        GasFuel: value.GasFuel,
        Cement: value.Cement,
        GasFlaring: value.GasFlaring,
        PerCapita: value.PerCapita,
        BunkerfuelsNotInTotal: value.BunkerfuelsNotInTotal,
        AverageTemp: value.averageTemp,

        get text(){
          return formatData(this);
        }
      };
    });
    
    // Create polygon series
    let polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        // exclude: excluded,
        useGeodata: true,
        fill: am5.color(0x808080)
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
      fill: am5.color(0x677935)
    });

    return () => {
      root.dispose();
    };
  }, [data]);

  return (
    <div id="chartdiv" style={{ width: '1000px', height: '500px' }}></div>
  );
}
export default MapChart;