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
  Cartesian3,
  HorizontalOrigin,
  VerticalOrigin,
} from 'cesium';
//import { Cesium } from cesium-react;
import '../node_modules/cesium/Build/Cesium/Widgets/widgets.css';
import CoordsFormComp from './CoordsFormComp';

let cesiumViewer;

const App = ({ title }) => {
  const [moving, setMoving] = useState({ lon: null, lat: null });

  useLayoutEffect(() => {
    Ion.defaultAccessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiMmZkNDMyOC0wOWM3LTQyOTQtYWU2ZS0yMjc2NGRjNGJlY2UiLCJpZCI6ODc5MjgsImlhdCI6MTY0OTAxNjU2NX0.abaJS2YS9TNnqSBxrUu8BEjtu_qq8eTagE-moYQrc4g';
    window.CESIUM_BASE_URL = './cesium';
    if (cesiumViewer) {
      return;
    }
    cesiumViewer = new Viewer('CesiumMap');

    const entity = cesiumViewer.entities.add({
      label: {
        show: false,
        showBackground: true,
        font: '14px monospace',
        horizontalOrigin: HorizontalOrigin.LEFT,
        verticalOrigin: VerticalOrigin.TOP,
        pixelOffset: new Cartesian2(15, 0),
      },
    });

    const scene = cesiumViewer.scene;

    console.log(`scene = ${scene}`);

    console.log(`canvas = ${scene.canvas}`);

    const handler = new ScreenSpaceEventHandler(scene.canvas);

    handler.setInputAction((movement) => {
      //   console.log(`endPosition = ${movement.endPosition}`);

      //   console.log(`scene.globe.ellipsoid = ${scene.globe.ellipsoid}`);

      //   console.log(JSON.stringify(movement));
      const cartesian = utils.convertSceneCoordinatesToCartesian(
        movement.endPosition,
        cesiumViewer
      );

      const strs = utils.convertCartesian2DegreesString(cartesian);

      //setMoving({ lon: strs[0], lat: strs[1] });

      entity.position = cartesian;
      entity.label.show = true;
      entity.label.text =
        `Lon: ${`   ${strs[0]}`.slice(-7)}\u00B0` +
        `\nLat: ${`   ${strs[1]}`.slice(-7)}\u00B0`;

      //   //alert(movement);
    }, ScreenSpaceEventType.MOUSE_MOVE);

    handler.setInputAction((pickObject) => {
      //const cartesian = cesiumViewer.camera.pickEllipsoid(
      //  pickObject.position,
      //  scene.globe.ellipsoid
      //);
      const strs = utils.convertSceneCoordinatesToDegreesString(
        pickObject.position,
        cesiumViewer
      );
      //alert(strs[0]);
    }, ScreenSpaceEventType.LEFT_DOWN);
  }, []);

  const setCoordsByForm = (coords) => {
    // alert(`${coords.lon} ----- ${coords.lat}`);
    var center = Cartesian3.fromDegrees(
      parseFloat(coords.lon),
      parseFloat(coords.lat)
    );
    cesiumViewer.camera.lookAt(
      center,
      new Cartesian3(0.0, 0.0, 4200000.0)
    );
  };

  return (
    <div>
      {moving.lon}, {moving.lat}
      <div
        id="CesiumMap"
        style={{ width: '850px', height: '850px' }}
      ></div>
      <div>
        <CoordsFormComp callback={setCoordsByForm} />
      </div>
    </div>
  );
};

export const getCesiumViewer = () => cesiumViewer;

export default App;
