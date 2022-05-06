import React, { useState, useLayoutEffect, StrictMode } from 'react';
import convert from './classes/Conversions';
import search from './classes/SearchAlgo';
import searchBinary from './classes/SearchAlgoBinary';
import point from './classes/Point';
import regionOfInterest from './classes/Region';
import utils from './Utils';
import './App.css';

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
    PinBuilder,
} from 'cesium';
//import { Cesium } from cesium-react;
import '../node_modules/cesium/Build/Cesium/Widgets/widgets.css';
import CoordsFormComp from './CoordsFormComp';
import CitiesComp from './CitiesComp';

let cesiumViewer;

//latitude(width) longitude(length)

const App = ({ title }) => {
        const [moving, setMoving] = useState({ lon: null, lat: null });
        const [regionEntity, setRegionEntity] = useState();

        let foundEntities = [];
        let foundPolygon;

        useLayoutEffect(() => {
                    Ion.defaultAccessToken =
                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiMmZkNDMyOC0wOWM3LTQyOTQtYWU2ZS0yMjc2NGRjNGJlY2UiLCJpZCI6ODc5MjgsImlhdCI6MTY0OTAxNjU2NX0.abaJS2YS9TNnqSBxrUu8BEjtu_qq8eTagE-moYQrc4g';
                    window.CESIUM_BASE_URL = './cesium';
                    if (cesiumViewer) {
                        return;
                    }

                    cesiumViewer = new Viewer('CesiumMap');

                    const numOfPoints = 500;

                    //israel
                    const roi = new regionOfInterest(31.74, 32.87, 35.49, 28.48);

                    const centerPoint = roi.Center;

                    var cartesianCenter = Cartesian3.fromDegrees(
                        centerPoint.x,
                        centerPoint.y
                    );

                    cesiumViewer.camera.lookAt(
                        cartesianCenter,
                        new Cartesian3(0.0, 0.0, 4200000.0)
                    );

                    //draw polygon
                    const roiEntity = cesiumViewer.entities.add({
                        polygon: {
                            hierarchy: Cartesian3.fromDegreesArray(roi.toFlatPolygon()),
                            height: 0,
                            material: Color.YELLOWGREEN.withAlpha(0.125),
                            outline: true,
                            outlineColor: Color.YELLOW,
                        },
                    });

                    //get dummy points
                    const pointsArray = utils.getDummyPointsArray(numOfPoints, roi);

                    let toDrawPointsArray = true;

                    const pinBuilder = new PinBuilder();

                    if (toDrawPointsArray) {
                        Promise.resolve(
                            pinBuilder.fromMakiIconId('hospital', Color.RED, 48)
                        ).then(function(canvas) {
                            for (let i = 0; i < pointsArray.length; i++) {
                                const degs = pointsArray[i];

                                const cartesianPoint = Cartesian3.fromDegrees(
                                    degs.x,
                                    degs.y
                                );

                                if (true)
                                //add points to viewer
                                    utils.myEllipse = cesiumViewer.entities.add({
                                    position: cartesianPoint,

                                    billboard: {
                                        image: canvas.toDataURL(),
                                        verticalOrigin: VerticalOrigin.BOTTOM,
                                    },
                                });

                                if (false)
                                    utils.myEllipse = cesiumViewer.entities.add({
                                        position: cartesianPoint,
                                        label: {
                                            //id: 'my label',
                                            text: degs.index.toString(),
                                        },
                                    });
                            }
                        });
                    }

                    //label of moving
                    const tooltip = cesiumViewer.entities.add({
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

                                tooltip.label.show = validMoving;

                                if (validMoving) {
                                    tooltip.position = cartesian;
                                    /*new Cartesian3(
                                                                         cartesian.x,
                                                                         cartesian.y,
                                                                         0
                                                                       );*/
                                    tooltip.label.text =
                                        `Lon: ${`   ${strs[0]}`.slice(-7)}\u00B0` +
          `\nLat: ${`   ${strs[1]}`.slice(-7)}\u00B0`;
      }

      //   //alert(movement);
    }, ScreenSpaceEventType.MOUSE_MOVE);

    let myInterval;

    //left down
    handler.setInputAction((pickObject) => {
      foundEntities.forEach((ent) =>
        cesiumViewer.entities.remove(ent)
      );

      const cartesianPoint = cesiumViewer.camera.pickEllipsoid(
        pickObject.position,
        scene.globe.ellipsoid
      );

      const strs = convert.convertSceneCoordinatesToDegreesString(
        pickObject.position,
        cesiumViewer
      );

      foundPolygon && cesiumViewer.entities.remove(foundPolygon);

      myEllipse && cesiumViewer.entities.remove(myEllipse);

      myEllipse = cesiumViewer.entities.add({
        position: cartesianPoint,
        ellipse: {
          semiMinorAxis: 25000.0,
          semiMajorAxis: 40000.0,
          material: Color.BLUE.withAlpha(0.5),
        },
      });
      //viewer.zoomTo(cesiumViewer.entities);

      var ellipse = tooltip.ellipse; // For upcoming examples

      const degs = convert.convertCartesian2Degrees(cartesianPoint);

      ////////const found = new Map(); //points that found
      ////////search.naiveSearch(pointsArray, found, degs, 100, 1, 1); //0.01);

      const found = searchBinary.searchPointsArray(
        pointsArray,
        degs,
        pointsArray[0],
        pointsArray[pointsArray.length - 1],
        null
      );

      //if (found.size > 0) {
      if (Array.isArray(found) && found.length > 0) {
        //alert(`found length = ${found.length}`);
        found.sort((p1, p2) => p1.x - p2.x);

        let convex;

        try {
          convex = utils.convexHull(found);
        } catch (e) {
          //alert(`exception = ${e}`);
        }

        if (Array.isArray(convex) && convex.length > 2) {
          //alert(`convex length = ${convex.length}`);

          let flat = [];

          for (let i = 0; i < convex.length; i++) {
            const point0 = convex[i];

            flat.push(point0.x);
            flat.push(point0.y);
          }

          foundPolygon = cesiumViewer.entities.add({
            polygon: {
              hierarchy: Cartesian3.fromDegreesArray(flat),
              height: 0,
              material: Color.YELLOWGREEN.withAlpha(0.01),
              outline: true,
              outlineColor: Color.RED,
            },
          });
        }

        myInterval && window.clearInterval(myInterval);

        let opac = 0.5;

        myInterval = window.setInterval(() => {
          //alert(myEllipse.material);
          opac *= 0.9;

          myEllipse.ellipse.material = Color.BLUE.withAlpha(opac);

          if (opac < 0.25) {
            window.clearInterval(myInterval);

            myInterval = null;
          }
        }, 850);

        for (let i = 0; i < found.length; i++) {
          const point0 = found[i];
          //alert(`x = ${point0.x}, y = ${point0.y}, d = ${point0.distance}`);

          const cartesianPoint = Cartesian3.fromDegrees(
            point0.x,
            point0.y
          );

          //myEllipse && cesiumViewer.entities.remove(myEllipse);

          //add found points
          if (true) {
            const myEllipse0 = cesiumViewer.entities.add({
              position: cartesianPoint,
              ellipse: {
                semiMinorAxis: 2500.0,
                semiMajorAxis: 4000.0,
                material: Color.BLACK.withAlpha(0.5),
              },
              label: {
                //id: 'my label',
                text: point0.index.toString(),
                fillColor: Color.YELLOW.withAlpha(0.85),
                outline: true,
                outlineColor: Color.RED,
              },
            });

            foundEntities.push(myEllipse0);
          }
        }
      }

      //alert(strs[0]);
    }, ScreenSpaceEventType.LEFT_DOWN);
  }, []);

  //form callbak setCoordsByForm
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

  const cityPicked = (id, region) => {
    setCity(id);

    regionEntity && cesiumViewer.entities.remove(regionEntity);

    //draw polygon
    setRegionEntity(
      cesiumViewer.entities.add({
        polygon: {
          hierarchy: Cartesian3.fromDegreesArray(
            region.toFlatPolygon()
          ),
          height: 0,
          material: Color.PURPLE.withAlpha(0.325),
          outline: true,
          outlineColor: Color.ORANGERED,
        },
      })
    );
  };

  const [city, setCity] = useState();

  return (
    <div>
      {city}
      {moving.lon}, {moving.lat}
      <div>
        <div
          id="CesiumMap"
          style={{ width: '80%', float: 'left' }}
        ></div>
        <div style={{ width: '20%', float: 'right' }}>
          <CitiesComp callback={cityPicked} />
        </div>
      </div>
      <div>
        <CoordsFormComp callback={setCoordsByForm} />
      </div>
    </div>
  );
};

export const getCesiumViewer = () => cesiumViewer;

export default App;