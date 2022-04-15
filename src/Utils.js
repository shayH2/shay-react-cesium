import { Cartographic, LabelStyle, Math } from 'cesium';

const convertSceneCoordinatesToCartesian = (pixels, viewer) => viewer.camera.pickEllipsoid(
  pixels,
  viewer.scene.globe.ellipsoid
);

const convertSceneCoordinatesToDegreesString = (pixels, viewer) => {
  const cartesian = convertSceneCoordinatesToCartesian(
    pixels,
    viewer
  );

  return convertCartesian2DegreesString(cartesian);
};

const convertCartographic2Cartesian = carto => {
  let result = null;

  let cartesian;

  if (carto) {
    const carto0 = new Cartographic(carto[0], carto[1]);

    cartesian = Cartographic.toCartesian(carto0);

    //result = [cartesian.longitude, cartesian.latitude];
  }

  return cartesian;// result;
};

const convertCartesian2Degrees = (cartesian) => {
  let result = null;

  if (cartesian) {
    const cartographic = Cartographic.fromCartesian(cartesian);

    if (cartographic)
      result = new point(Math.toDegrees(cartographic.longitude),
        Math.toDegrees(cartographic.latitude), cartographic.z);
  }

  return result;
};

const convertCartesian2DegreesString = (cartesian) => {
  let result = null;

  const degrees = convertCartesian2Degrees(cartesian);

  if (degrees)
    result = [degrees.x.toFixed(2), degrees.y.toFixed(2)];

  return result;
};

let pointsArray;

const getDummyPointsArray = () => {
  if (!pointsArray) pointsArray = initDummyPointsArray(1000, new regionOfInterest(-100, 40, -80, 30));

  return pointsArray;
};

const naiveSearch = (points, pickedPoint, num = 10, dist = 0.5, delta = 0.1) => {
  if (!points) {
    points = new Map();

    pointsArray.forEach(point => points.set(point.id, point.coords));
  }

  const lon = pickedPoint.x;
  const lat = pickedPoint.y;

  let found = [];

  let index = 0;

  let keys = [...points.keys()];

  while (found.length < num && index < points.size) {
    const key = keys[index++];

    const point = points.get(key);

    if (abs(point.x - lon) < dist && abs(point.y - lat) < dist) {
      found.push(point);

      points.delete(key);
      //map1.delete('b');
      //points

      if (found.length < num)
        naiveSearch(points, pickedPoint, num);
    }
  }

  return found;
};

const abs = num => {
  if (num < 0)
    num *= -1;

  return num;
}

const initDummyPointsArray = (num, roi) => {
  var arr = [];

  const width = roi.right - roi.left;
  const height = roi.top - roi.bottom;

  for (let i = 0; i < num; i++) {
    const l = roi.left + Math.nextRandomNumber() * width;

    const t = roi.bottom + Math.nextRandomNumber() * height;

    arr.push({ id: i, coords: new point(l, t) });
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
  convertCartesian2Degrees,
  convertCartesian2DegreesString,
  convertSceneCoordinatesToCartesian,
  convertSceneCoordinatesToDegreesString,
  getDummyPointsArray,
  dummySearch,
  naiveSearch,
  convertCartographic2Cartesian
};

class regionOfInterest {
  constructor(l, t, r, b) {
    this.left = l;
    this.top = t;
    this.right = r;
    this.bottom = b;
  }
};

class point {
  constructor(x, y, z, coordsType) {
    this.coordX = x;
    this.coordY = y;
    this.z = z;
    this.coordsType = coordsType;
  }

  get x() {
    return this.coordX;
  }

  set x(val) {
    this.coordX = val;
  }

  get y() {
    return this.coordY;
  }

  set y(val) {
    this.coordY = val;
  }
};

const CoordsImage = 1;
const CoordsCartographoic = 2;
const CoordsCartesian = 3;