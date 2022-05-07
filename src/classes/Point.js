'use strict';

export default class MyPoint {
    constructor(x, y, z, coordsType) {
        this.coordX = x;
        this.coordY = y;
        this.z = z;
        this.coordsType = coordsType;
        this.indices = new Map();
        this.distance = null;
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

    getCoord = (index) => {
        if (index === 1) return this.coordX;

        if (index === 2) return this.coordY;
    };
}