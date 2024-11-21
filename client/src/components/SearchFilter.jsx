import { useState } from 'react';
import countries from '../../data/countries.json';

export default function SearchFilter({ setCountry, setIsValid, excludedCountries = [] }) {
  const [searchCountry, setSearchCountry] = useState('Canada'); 
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  useState(() => {
    setCountry('Canada');
    setIsValid(true);
  }, []);
  
  /**
   * Handles the search input and filters the list of countries based on the query.
   * Updates the dropdown visibility and validity status.
   * 
   * @param {Object} event - The input event containing the user's search query.
   */
  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchCountry(query);

    // Filter the countries based on the query and exclude specified countries
    const filtered = countries.filter((country) =>
      country.toLowerCase().includes(query.toLowerCase()) &&
      !excludedCountries.includes(country)
    );

    // Update the filtered countries and dropdown visibility
    setFilteredCountries(filtered);
    setIsDropdownOpen(query.length > 0);

    // Validate the input based on whether it's found in the filtered list
    if (query && !filtered.includes(query)) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  };

  /**
  * Handles the selection of a country from the dropdown.
  * Sets the selected country and closes the dropdown.
  * 
  * @param {string} country - The country selected from the dropdown list.
  */
  const handleSelect = (country) => {
    setSearchCountry(country);
    setCountry(country);
    setIsDropdownOpen(false);
    setIsValid(true);
  };

  /**
  * Handles the "Enter" key press to select a country from the filtered list.
  * If the input matches a filtered country, it's selected. Otherwise, the input is cleared.
  * 
  * @param {Object} event - The keyboard event triggered by the "Enter" key press.
  */
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      //console.log('pressed');
      const selectedCountry = filteredCountries.find(
        (country) => country.toLowerCase() === searchCountry.toLowerCase()
      );

      if (selectedCountry) {
        setSearchCountry(selectedCountry);
        setCountry(selectedCountry);
        setIsValid(true);
      } else {
        //Clear the input if the input isnt in the filtered list
        setSearchCountry('');
        setIsValid(false);
      }
      setIsDropdownOpen(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for a country"
        value={searchCountry}
        onChange={handleSearch}
        onClick={() => setIsDropdownOpen(true)}
        onKeyDown={handleKeyDown}
      />
      {/* display dropdown list */}
      {isDropdownOpen && searchCountry &&
        <ul className="dropdown">
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country, index) => (
              <li key={index} onClick={() => handleSelect(country)}>
                {country}
              </li>
            ))
          ) :
            <li>No results</li>
          }
        </ul>
      }
    </div>
  );
}
