'use strict';

export default class point {
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
