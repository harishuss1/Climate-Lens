# Climate & CO2 Fluctuation

## Data
- **Links to Data:**  
  - [CO2 Emissions by Nation (GitHub)](https://github.com/datasets/co2-fossil-by-nation/blob/main/data/fossil-fuel-co2-emissions-by-nation.csv)  
  - [Climate Change Data (Kaggle)](https://www.kaggle.com/datasets/berkeleyearth/climate-change-earth-surface-temperature-data/data?select=GlobalLandTemperaturesByCountry.csv)  

**Summary:**  
This project will use two datasets to analyze the relationship between CO2 emissions from fossil fuels and surface temperature changes across different countries over time. The CO2 dataset provides annual emission values by nation, while the temperature dataset offers monthly surface temperature data by country. We will create interactive visualizations to explore the impact of fossil fuel emissions on global warming.

---

## API
1. **GET /api/temp/:country?/:year?**  
   - **Description:** Returns temperature data. If `country` or `year` is not provided, it returns all available data.  
   - **Parameters:**  
     - `:country` (optional): Filter data by country (case-insensitive).  
     - `:year` (optional): Filter data by year.  

2. **GET /api/emission/:country?/:year?**  
   - **Description:** Returns CO2 emission data. If `country` or `year` is not provided, it returns all available data.  
   - **Parameters:**  
     - `:country` (optional): Filter data by country (case-insensitive).  
     - `:year` (optional): Filter data by year.  

3. **GET /api/random**  
   - **Description:** Returns data for a random country and year.  
   - **Response:**  
     - A random country and a random year with both temperature and emission data.

---

## Visualizations
- **Description:**  
  - A **line chart** will display temperature trends over time.  
  - A **pie chart** will show the causes of CO2 emissions for a selected country and year.  
  - **Legends** will categorize the different sources of emissions.  

- **User Story:**  
  Users will be able to visualize both climate change and emissions data, with the ability to filter by country and year. The goal is to help users explore trends in global warming and understand the contributions of various countries to CO2 emissions.

---

## Views


---

## Functionality
- Users will be able to:
  - Select specific countries and years to filter data.
  - View temperature trends and emission sources using interactive charts.
  - Hover over charts to see specific data points.
  - Toggle between different countries to compare data.

---

## Features and Priorities
- **Core Features:**  
  - Interactive line chart for temperature data.  
  - Pie chart showing CO2 emission breakdown.  
  - Filter functionality by country and year.

- **Potential Cuts (if needed):**  
  - Advanced filtering for specific fossil fuel categories.  
  - Animations or transitions.

---

## Dependencies


---

This project will explore the relationship between fossil fuel CO2 emissions and climate change. Through interactive visualizations, users will gain insights into the impact of emissions on global temperatures and explore how different countries contribute to climate change.
