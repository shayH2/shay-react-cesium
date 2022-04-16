import React, { useState, useLayoutEffect, StrictMode } from 'react';
import convert from './classes/Conversions';
import search from './classes/SearchAlgo';
import point from './classes/Point';
import utils from './Utils';

import {
  Ion,
  Viewer,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Color,
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

    //get dummy points
    const pointsArray = utils.getDummyPointsArray();

    for (let i = 0; i < pointsArray.length; i++) {
      const degs = pointsArray[i];

      const cartesianPoint = Cartesian3.fromDegrees(degs.x, degs.y);

      //add points to viewer
      utils.myEllipse = cesiumViewer.entities.add({
        position: cartesianPoint,
        ellipse: {
          semiMinorAxis: 25000.0,
          semiMajorAxis: 40000.0,
          material: Color.RED.withAlpha(0.5),
        },
      });
    }

    //label of moving
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

    //scene -render screen
    const scene = cesiumViewer.scene;

    console.log(`scene = ${scene}`);

    console.log(`canvas = ${scene.canvas}`);

    const handler = new ScreenSpaceEventHandler(scene.canvas);

    let myEllipse;

    //mouse move
    handler.setInputAction((movement) => {
      const cartesian = convert.convertSceneCoordinatesToCartesian(
        movement.endPosition,
        cesiumViewer
      );

      const strs = convert.convertCartesian2DegreesString(cartesian);

      //setMoving({ lon: strs[0], lat: strs[1] });
      const validMoving = Array.isArray(strs) && strs.length === 2;

      entity.label.show = validMoving;

      if (validMoving) {
        entity.position = cartesian;
        entity.label.text =
          `Lon: ${`   ${strs[0]}`.slice(-7)}\u00B0` +
          `\nLat: ${`   ${strs[1]}`.slice(-7)}\u00B0`;
      }

      //   //alert(movement);
    }, ScreenSpaceEventType.MOUSE_MOVE);

    //left down
    handler.setInputAction((pickObject) => {
      const cartesianPoint = cesiumViewer.camera.pickEllipsoid(
        pickObject.position,
        scene.globe.ellipsoid
      );

      //cesiumViewer.camera.lookAt(
      //cartesianPoint,
      //new Cartesian3(0.0, 0.0, 4200000.0)
      //);

      const strs = convert.convertSceneCoordinatesToDegreesString(
        pickObject.position,
        cesiumViewer
      );

      myEllipse && cesiumViewer.entities.remove(myEllipse);

      myEllipse = cesiumViewer.entities.add({
        position: cartesianPoint,
        ellipse: {
          semiMinorAxis: 250000.0,
          semiMajorAxis: 400000.0,
          material: Color.BLUE.withAlpha(0.5),
        },
      });
      //viewer.zoomTo(cesiumViewer.entities);

      var ellipse = entity.ellipse; // For upcoming examples

      const degs = convert.convertCartesian2Degrees(cartesianPoint);

      const found = new Map();

      search.naiveSearch(pointsArray, found, degs, 100, 0.01, 0.01);

      if (found.size > 0) {
        let arr = Array.from(found);

        arr = arr.map(arr0 => arr0[1]);

        for (let i = 0; i < arr.length; i++) {
          const point0 = arr[i];

          const cartesianPoint = Cartesian3.fromDegrees(
            point0.x,
            point0.y
          );

          myEllipse && cesiumViewer.entities.remove(myEllipse);

          const myEllipse0 = cesiumViewer.entities.add({
            position: cartesianPoint,
            ellipse: {
              semiMinorAxis: 25000.0,
              semiMajorAxis: 40000.0,
              material: Color.BLACK.withAlpha(0.5),
            },
          });
        }
      }

      //alert(strs[0]);
    }, ScreenSpaceEventType.LEFT_DOWN);
  }, []);

  //form callbak
  const setCoordsByForm = (coords) => {
    var cartesianPoint = Cartesian3.fromDegrees(
      parseFloat(coords.lon),
      parseFloat(coords.lat)
    );
    cesiumViewer.camera.lookAt(
      cartesianPoint,
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
