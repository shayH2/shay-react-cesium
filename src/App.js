import React, { useState, useLayoutEffect, StrictMode } from 'react';
import convert from './classes/Conversions';
import search from './classes/SearchAlgo';
import searchBinary from './classes/SearchAlgoBinary';
import MyPoint from './classes/Point';
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
    PolylineGlowMaterialProperty
} from 'cesium';
//import { Cesium } from cesium-react;
import '../node_modules/cesium/Build/Cesium/Widgets/widgets.css';
import CoordsFormComp from './CoordsFormComp';
import CitiesComp from './CitiesComp';

let cesiumViewer;

let somePoint, centerPoint;

//latitude(width) longitude(length)

const App = ({ title }) => {
        const [moving, setMoving] = useState({ lon: null, lat: null });
        const [regionEntity, setRegionEntity] = useState();
        const [arrMap, setArrayMap] = useState(new Map());
        const [foundArray, setFoundArray] = useState();

        let foundEntities = [];
        let foundPolygon;

        //israel
        const roi = new regionOfInterest(33.9, 32.87, 35.55, 29.5);

        useLayoutEffect(() => {
                    Ion.defaultAccessToken =
                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiMmZkNDMyOC0wOWM3LTQyOTQtYWU2ZS0yMjc2NGRjNGJlY2UiLCJpZCI6ODc5MjgsImlhdCI6MTY0OTAxNjU2NX0.abaJS2YS9TNnqSBxrUu8BEjtu_qq8eTagE-moYQrc4g';
                    window.CESIUM_BASE_URL = './cesium';
                    if (cesiumViewer) {
                        return;
                    }

                    cesiumViewer = new Viewer('CesiumMap');

                    cesiumViewer.infoBox.frame.removeAttribute('sandbox');

                    // So does this if you want to limit other things but allow scripts
                    //viewer.infoBox.frame.setAttribute("sandbox", "allow-same-origin allow-popups allow-forms allow-scripts");

                    // In both cases, you need to do this to force a reload for the change to take affect.
                    cesiumViewer.infoBox.frame.src = 'about:blank';

                    const numOfPoints = 500;

                    const centerPoint = roi.center;

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
                    const pointsArrayCoord1 = utils.getDummyPointsArray(
                        numOfPoints,
                        roi,
                        1
                    );

                    const pointsArrayCoord2 = utils.initSortedPointsArray(
                        pointsArrayCoord1,
                        2
                    );

                    const pointsArrayCoord3 = utils.initSortedPointsArray(
                        pointsArrayCoord2,
                        3
                    );

                    const groups = utils.groupByDistance(pointsArrayCoord3, 4.85);

                    if (false && Array.isArray(groups) && groups.length > 0) {
                        let refPoint = pointsArrayCoord3[0].referencePoint;

                        if (!refPoint)
                            refPoint = new MyPoint(0, 0);

                        for (let i = 0; i < groups.length; i++) {
                            const lastInGroup = groups[i] - 1;

                            if (lastInGroup >= 0) {
                                const maxInGroup = pointsArrayCoord3[lastInGroup];
                                const squaredDistance = maxInGroup.getCoord(3);

                                let dx = roi.right - refPoint.x;
                                let dx2 = dx * dx;
                                let dy2 = squaredDistance - dx2;
                                let dy = utils.sqrt(dy2);
                                const y1 = refPoint.y + dy;
                                dx = roi.left - refPoint.x;
                                dx2 = dx * dx;
                                dy2 = squaredDistance - dx2;
                                dy = utils.sqrt(dy2);
                                const y2 = refPoint.y + dy;

                                const arr = [6];

                                arr[0] = roi.right;
                                arr[1] = utils.max(utils.min(y1, roi.top), roi.bottom);
                                arr[2] = maxInGroup.x;
                                arr[3] = maxInGroup.y;
                                arr[4] = roi.left;
                                arr[5] = utils.max(utils.min(y2, roi.top), roi.bottom);

                                const redLine = cesiumViewer.entities.add({
                                    name: "Red line on terrain",
                                    polyline: {
                                        positions: Cartesian3.fromDegreesArray(arr),
                                        width: 2,
                                        material: Color.RED,
                                        clampToGround: true,
                                    },
                                });
                            }
                        }
                    }

                    arrMap.set(1, pointsArrayCoord1);
                    arrMap.set(2, pointsArrayCoord2);
                    arrMap.set(3, pointsArrayCoord3);

                    const pointsArray = pointsArrayCoord1;

                    let toDrawPointsArray = true;

                    const pinBuilder = new PinBuilder();

                    if (toDrawPointsArray) {
                        Promise.resolve(
                            pinBuilder.fromMakiIconId('hospital', Color.RED, 48)
                        ).then(function(canvas) {
                            for (let i = 0; i < pointsArray.length; i++) {
                                const point = pointsArray[i];

                                const cartesianPoint = Cartesian3.fromDegrees(
                                    point.x,
                                    point.y
                                );

                                if (false)
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
                                            text: point.indices[3].toString(),
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

      const coordIndex = 2;

      const found = searchBinary.searchPointsArray(
        arrMap,
        coordIndex,
        degs,
        0
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
          if (false) {
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

    if (Array.isArray(foundArray) && foundArray.length > 0)
      foundArray.forEach((entity) =>
        cesiumViewer.entities.remove(entity)
      );

    const searchPolygon = region.toPolygon();

    const coordIndex = 1;

    const arr = arrMap.get(coordIndex);

    const regionX = (region.right - region.left) / 2;
    const regionY = (region.top - region.bottom) / 2;

    let radius1 = regionX, radius2 = regionY;

    if (radius1 > radius2) {
      radius1 = regionY;
      radius2 = regionX;
    }

    const threshold1 = {
      Distance: radius1,
      Squared: radius1 * radius1
    };

    const threshold2 = {
      Distance: radius2,
      Squared: radius2 * radius2
    };

    centerPoint && cesiumViewer.entities.remove(centerPoint);

    const cartesianPoint1 = Cartesian3.fromDegrees(
      region.center.x,
      region.center.y
    );
 
    const pinBuilder1 = new PinBuilder();

    Promise.resolve(
      pinBuilder1.fromMakiIconId('hospital', Color.GREEN, 48)
    ).then(function (canvas) {
      centerPoint = cesiumViewer.entities.add({
        position: cartesianPoint1,

        billboard: {
          image: canvas.toDataURL(),
          verticalOrigin: VerticalOrigin.BOTTOM,
        },
      });
    });

    let foundPoint = searchBinary.searchPointsArray(
      arrMap,
      coordIndex,
      region.center,
      1,
      roi,
      threshold1
    );

    if (!foundPoint)
      foundPoint = searchBinary.searchPointsArray(
        arrMap,
        coordIndex,
        region.center,
        1,
        roi,
        threshold2
      );

    somePoint && cesiumViewer.entities.remove(somePoint);

    if (foundPoint) {
      const point = foundPoint[0];

      const cartesianPoint = Cartesian3.fromDegrees(
        point.x,
        point.y
      );

      const pinBuilder0 = new PinBuilder();

      Promise.resolve(
        pinBuilder0.fromMakiIconId('hospital', Color.RED, 48)
      ).then(function (canvas) {
        somePoint = cesiumViewer.entities.add({
          position: cartesianPoint,

          billboard: {
            image: canvas.toDataURL(),
            verticalOrigin: VerticalOrigin.BOTTOM,
          },
        });
      });
    }

    //const pointFound = searchBinary.searchPointsArrayForMinDistance(arrMap, coordIndex, region.center);

    let found = [];

    for (let i = 0; i < arr.length; i++) {
      const point = arr[i];

      const inPolygon = utils.pointInPolygon(point, searchPolygon, region);

      if (inPolygon)
        found.push(point);
    }

    found = [];

    /*
    const found = [pointFound];

    let i = pointFound.indices[coordIndex] + 1;

    let notInPolygon = false;

    while (!notInPolygon && i < arr.length) {
      const point = arr[i++];

      const inPolygon = utils.pointInPolygon(point, searchPolygon, region);

      if (inPolygon)
        found.push(point);

      notInPolygon = !inPolygon;
    }

    i = pointFound.indices[coordIndex] - 1;

    notInPolygon = false;

    while (!notInPolygon && i >= 0) {
      const point = arr[i--];

      const inPolygon = utils.pointInPolygon(point, searchPolygon, region);

      if (inPolygon)
        found.push(point);

      notInPolygon = !inPolygon;
    }
    */

    if (found.length > 0) {
      const fa = Array(found.length).fill(null);

      const pinBuilder = new PinBuilder();

      Promise.resolve(
        pinBuilder.fromMakiIconId('hospital', Color.RED, 48)
      ).then(function (canvas) {
        for (let i = 0; i < found.length; i++) {
          const point = found[i];

          const cartesianPoint = Cartesian3.fromDegrees(
            point.x,
            point.y
          );

          fa[i] = cesiumViewer.entities.add({
            position: cartesianPoint,

            billboard: {
              image: canvas.toDataURL(),
              verticalOrigin: VerticalOrigin.BOTTOM,
            },
          });
        }
      });

      setFoundArray(fa);
    }

    //alert(found.length);
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

          <CoordsFormComp callback={setCoordsByForm} />
        </div>
      </div>
    </div>
  );
};

export const getCesiumViewer = () => cesiumViewer;

export default App;