'use strict';

import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import regionOfInterest from './classes/Region';

const CitiesComp = (props) => {
  const [city, setCity] = useState(1);

  // TODO: to be fetched from db
  const cities = [
    {
      id: 1,
      name: 'Petah Tikva (black hole)',
      region: new regionOfInterest(34.86, 32.1, 34.9, 32.07),
    },
    {
      id: 2,
      name: 'Givat Shmuel (millionaires)',
      region: new regionOfInterest(34.85, 32.09, 34.86, 32.07),
    },
    {
      id: 3,
      name: 'Bnei Brak (pinguins)',
      region: new regionOfInterest(34.82, 32.1, 34.85, 32.07),
    },
  ];

  const cityPicked = (event) => {
    const pickedCity = event.target.value;

    setCity(pickedCity);

    const pCity = cities[pickedCity - 1];

    props.callback(pickedCity, pCity.region);
  };

  return (
    <div style={{ marginLeft: '0%', marginTop: '60px' }}>
      <h3>Choose a city</h3>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={city}
        label="Age"
        onChange={cityPicked}
      >
        {cities.map((elem) => (
          <MenuItem key={elem.id} value={elem.id}>
            {`(${elem.id}) ${elem.name}`}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default CitiesComp;
