import React, { useState, useLayoutEffect } from 'react';
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

    const pointsArray = utils.getDummyPointsArray();

    //alert(pointsArray.length);

    for (let i = 0; i < pointsArray.length; i++) {
      const point = pointsArray[i];

      const cartesianPoint = Cartesian3.fromDegrees(
        point[0],
        point[1]
      );

      utils.myEllipse = cesiumViewer.entities.add({
        position: cartesianPoint,
        ellipse: {
          semiMinorAxis: 25000.0,
          semiMajorAxis: 40000.0,
          material: Color.RED.withAlpha(0.5),
        },
      });
    }

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

    let myEllipse;

    handler.setInputAction((movement) => {
      const cartesian = utils.convertSceneCoordinatesToCartesian(
        movement.endPosition,
        cesiumViewer
      );

      const strs = utils.convertCartesian2DegreesString(cartesian);

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

    handler.setInputAction((pickObject) => {
      const cartesianPoint = cesiumViewer.camera.pickEllipsoid(
        pickObject.position,
        scene.globe.ellipsoid
      );

      //cesiumViewer.camera.lookAt(
      //cartesianPoint,
      //new Cartesian3(0.0, 0.0, 4200000.0)
      //);

      const strs = utils.convertSceneCoordinatesToDegreesString(
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

      const degs = utils.convertCartesian2Degrees(cartesianPoint);

      const found = utils.naiveSearch(degs);

      if (Array.isArray(found) && found.length > 0) {
        for (let i = 0; i < found.length; i++) {
          const point0 = found[i];

          const cartesianPoint = Cartesian3.fromDegrees(
            point0[0],
            point0[1]
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
