/* eslint-disable camelcase */
import { useLayoutEffect } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';

import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

function MapChart(props) {
  useLayoutEffect(() => {
    let root = am5.Root.new('chartdiv');

    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    let chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: 'rotateX',
        projection: am5map.geoNaturalEarth1()
      })
    );
    
    let active = ['US', 'CA', 'AF', 'JP',];

    let templateData = active.map((value) => {
      return {
        id: value, 
        polygonSettings: {
          fill: am5.color(0x0000FF)
        },
        gaming: '100',
        get text(){
          return this.gaming;
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
      tooltipText: '{text}',
      templateField: 'polygonSettings', 
    });

    polygonSeries.data.setAll(templateData);
      
    polygonSeries.mapPolygons.template.states.create('hover', {
      fill: am5.color(0x677935)
    });

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <div id="chartdiv" style={{ width: '1000px', height: '500px' }}></div>
  );
}
export default MapChart;