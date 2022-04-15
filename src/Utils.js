'use strict';

import { Cartographic, LabelStyle, Math } from 'cesium';

import convert from './classes/Conversions';

let pointsArray;

const getDummyPointsArray = () => {
  if (!pointsArray)
    pointsArray = initDummyPointsArray(
      1000,
      new regionOfInterest(-100, 40, -80, 30)
    );

  return pointsArray;
};

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

// entity.position = cartesian;
// entity.label.show = true;
// entity.text = text;

export default {
  getDummyPointsArray,
};

const CoordsImage = 1;
const CoordsCartographoic = 2;
const CoordsCartesian = 3;

class regionOfInterest {
  constructor(l, t, r, b) {
    this.left = l;
    this.top = t;
    this.right = r;
    this.bottom = b;
  }
}

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
}
