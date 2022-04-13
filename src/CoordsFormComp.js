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
    <div>
      Longtiude:
      <input type="text" value={coords.lon} onChange={setLon}></input>
      <br />
      Latitude:
      <input type="text" value={coords.lat} onChange={setLat}></input>
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
