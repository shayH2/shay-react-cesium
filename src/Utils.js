import { Cartographic, Math } from 'cesium';

const convertSceneCoordinatesToCartesian = (pixels, viewer) => {
  return viewer.camera.pickEllipsoid(
    pixels,
    viewer.scene.globe.ellipsoid
  );
};

const convertSceneCoordinatesToDegreesString = (pixels, viewer) => {
  const cartesian = convertSceneCoordinatesToCartesian(
    pixels,
    viewer
  );

  return convertCartesian2DegreesString(cartesian);
};

const convertCartesian2Cartographic = (cartesian) => {
  let result = null;

  if (cartesian) {
    const cartographic = Cartographic.fromCartesian(cartesian);

    result = [cartographic.longitude, cartographic.latitude];
  }

  return result;
};

const convertCartesian2Degrees = (cartesian) => {
  let result = null;

  const cartographic = convertCartesian2Cartographic(cartesian);

  if (cartographic)
    result = [
      Math.toDegrees(cartographic[0]),
      Math.toDegrees(cartographic[1]),
    ];

  return result;
};

const convertCartesian2DegreesString = (cartesian) => {
  let result = null;

  const degrees = convertCartesian2Degrees(cartesian);

  if (degrees)
    result = [degrees[0].toFixed(2), degrees[1].toFixed(2)];

  return result;
};

let pointsArray;

const getDummyPointsArray = () => {
  if (!pointsArray) pointsArray = initDummyPointsArray(1000, new regionOfInterest(-100, 40, -80, 30));

  return pointsArray;
};

const initDummyPointsArray = (num, roi) => {
  var arr = [];

  const width = roi.right - roi.left;
  const height = roi.top - roi.bottom;

  for (let i = 0; i < num; i++) {
    const l = roi.left + Math.nextRandomNumber() * width;

    const t = roi.bottom + Math.nextRandomNumber() * height;

    arr.push([l, t]);
  }

//regionOfInterest


    //if (i % 2 === 0) arr.push([-82 + i * 0.1, 37 + i * 0.1]);
    //else arr.push([-82 - i * 0.1, 37 - i * 0.1]);

  return arr;
};

const dummySearch = (cartesian) => {
  if (!pointsArray) pointsArray = initDummyPointsArray();
};

// entity.position = cartesian;
// entity.label.show = true;
// entity.text = text;

export default {
  convertCartesian2Cartographic,
  convertCartesian2Degrees,
  convertCartesian2DegreesString,
  convertSceneCoordinatesToCartesian,
  convertSceneCoordinatesToDegreesString,
  getDummyPointsArray,
  dummySearch,
};

class regionOfInterest{
  constructor(l, t, r, b) {
    this.left = l;
    this.top = t;
    this.right = r;
    this.bottom = b;
  }
};