import { useState } from 'react';
import countries from '../../data/countries.json';

export default function SearchFilter({ setCountry, setIsValid }) {
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

    if (query && !filtered.includes(query)) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  };


  const handleSelect = (country) => {
    setSearchCountry(country);
    setCountry(country);
    setIsDropdownOpen(false);
    setIsValid(true);
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
