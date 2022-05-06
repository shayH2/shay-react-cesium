'use strict';

import React, { useLayoutEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import regionOfInterest from './classes/Region';

const CitiesComp = (props) => {
  const [city, setCity] = useState(0);
  const [mapCities, setMapCities] = useState(new Map());

  // TODO: to be fetched from db
  const cities = [
    {
      name: 'Petah Tikva (black hole)',
      region: new regionOfInterest(34.86, 32.1, 34.9, 32.07),
    },
    {
      name: 'Givat Shmuel (millionaires)',
      region: new regionOfInterest(34.85, 32.09, 34.86, 32.07),
    },
    {
      name: 'Bnei Brak (pinguins)',
      region: new regionOfInterest(34.82, 32.1, 34.85, 32.07),
    },
    {
      name: 'North',
      region: new regionOfInterest(33.9, 32.87, 35.55, 32.3),
    },
    {
      name: 'Center',
      region: new regionOfInterest(33.9, 32.3, 35.55, 31.3),
    },
    {
      name: 'South',
      region: new regionOfInterest(33.9, 31.3, 35.55, 29.5),
    },
  ];

  useLayoutEffect(() => {
  for (let i = 0; i < cities.length; i++)
    mapCities.set(i + 1, cities[i]);

    setCity(mapCities.keys().next().value);
  }, []);

  const cityPicked = (event) => {
    const pickedCity = event.target.value;

    setCity(pickedCity);

    const pCity = mapCities.get(pickedCity);

    props.callback(pickedCity, pCity.region);
  };

  const getCitiesArray = () => {
    const arr = Array(mapCities.size).fill(null);

    let i = 0;

    for (let [key, value] of mapCities) {
      const city = value;

      city.id = key;

      arr[i++] = city;
    }

    return arr;
  };

  return (
    <div style={{ marginLeft: '0%', marginTop: '60px' }}>
      <h3>Choose a city</h3>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={city}
        label="City"
        onChange={cityPicked}
      >
        {getCitiesArray().map((elem) => (
          <MenuItem key={elem.id} value={elem.id}>
            {`(${elem.id}) ${elem.name}`}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default CitiesComp;
