import React, { useState, useLayoutEffect } from 'react';
import utils from './Utils';
import {
  Ion,
  Viewer,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Cartographic,
  Math,
  Cartesian2,
  HorizontalOrigin,
  VerticalOrigin,
} from 'cesium';
//import { Cesium } from cesium-react;
import '../node_modules/cesium/Build/Cesium/Widgets/widgets.css';

let cesiumViewer;

const CoordsFormComp = (props) => {
  const setLon = (e) => {
    setCoords({
      lon: e.target.value, // || 'NA',
      lat: coords.lat, // || 'NA',
    });
  };

  const setLat = (e) => {
    setCoords({
      lon: coords.lon, // || 'NA',
      lat: e.target.value, // || 'NA',
    });
  };

  const focusCoords = () => {
    //alert(`${coords.lon}, ${coords.lat}`);
    props.callback && props.callback(coords);
  };

  const [coords, setCoords] = useState({ lon: null, lat: null });

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

export const getCesiumViewer = () => cesiumViewer;

export default CoordsFormComp;
