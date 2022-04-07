import { Cartographic, Math } from 'cesium';

const convertSceneCoordinatesToCartesian = (coords, viewer) => {
  return viewer.camera.pickEllipsoid(
    coords,
    viewer.scene.globe.ellipsoid
  );
};

const convertSceneCoordinatesToDegreesString = (coords, viewer) => {
  const cartesian = convertSceneCoordinatesToCartesian(
    coords,
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

// entity.position = cartesian;
// entity.label.show = true;
// entity.text = text;

export default {
  convertCartesian2Cartographic,
  convertCartesian2Degrees,
  convertCartesian2DegreesString,
  convertSceneCoordinatesToCartesian,
  convertSceneCoordinatesToDegreesString,
};
