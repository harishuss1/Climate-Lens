import { useState } from 'react';
import countries from '../../data/countries.json';

export default function SearchFilter({ setCountry }) {
  const [searchCountry, setSearchCountry] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchCountry(query);

    const filtered = countries.filter((country) =>
      country.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCountries(filtered);
    setIsDropdownOpen(query.length > 0);
  };


  const handleSelect = (country) => {
    setSearchCountry(country);
    setCountry(country);
    setIsDropdownOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      //console.log('pressed');
      const selectedCountry = filteredCountries.find(
        (country) => country.toLowerCase() === searchCountry.toLowerCase()
      );

      if (selectedCountry) {
        setSearchCountry(selectedCountry);
        setCountry(selectedCountry);
      } else {
        //Clear the input if the input isnt in the filtered list
        setSearchCountry('');
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

      {isDropdownOpen && searchCountry &&
        <ul style={{ maxHeight: '100px', color: '#000', overflowY: 'auto' }}>
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
