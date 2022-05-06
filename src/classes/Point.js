'use strict';

export default class point {
    constructor(x, y, z, coordsType, idx) {
        this.coordX = x;
        this.coordY = y;
        this.z = z;
        this.coordsType = coordsType;
        this.index = idx;
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
        if (index === 1)
            return this.coordX;

        if (index === 2)
            return this.coordY;
    }
}