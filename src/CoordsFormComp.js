'use strict';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

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
    <div className="class-coords">
      <TextField
        inputProps={{
          className: 'class-coord',
          pattern: '[a-z]{1,15}',
        }}
        label="Longtiude"
        variant="outlined"
        fullWidth
        value={coords.lon}
        onChange={setLon}
      />
      <TextField
        inputProps={{
          className: 'class-coord',
          pattern: '[a-r]{4,9}',
        }}
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
