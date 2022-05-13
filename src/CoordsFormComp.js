'use strict';
import TextField from '@material-ui/core/TextField';

import React, { useState } from 'react';

const CoordsFormComp = (props) => {
  const [coords, setCoords] = useState({ lon: 0, lat: 0 });

  const setLon = (e) => {
    setCoords({
      lon: e.target.value,
      lat: coords.lat,
    });
  };

  const setLat = (e) => {
    setCoords({
      lon: coords.lon,
      lat: e.target.value,
    });
  };

  const focusCoords = () => {
    props.callback && props.callback(coords);
  };

  return (
    <div class="class-coords">
      <TextField
        label="Longtiude"
        variant="outlined"
        fullWidth
        value={coords.lon}
        onChange={setLon}
      />
      <TextField
        label="Latitude"
        variant="outlined"
        fullWidth
        value={coords.lat}
        onChange={setLat}
      />
      <br />
      <input
        type="button"
        value="Focus"
        onClick={focusCoords}
      ></input>
      <br />
    </div>
  );
};

export default CoordsFormComp;
