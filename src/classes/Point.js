'use strict';

export default class MyPoint {
    constructor(x, y, z, coordsType) {
        this.coordX = x;
        this.coordY = y;
        this.z = z;
        this.coordsType = coordsType;
        this.indices = new Map();
        this.distance = null;

        this.referencePoint = null;
        this.squaredDistanceFromPoint = null;
    }

    squaredDistance(refPoint = null) {
        if (refPoint !== this.referencePoint || !this.squaredDistanceFromPoint) {
            this.referencePoint = refPoint;

            if (!refPoint)
                refPoint = new MyPoint(0, 0);

            const dx = this.coordX - refPoint.coordX;
            const dy = this.coordY - refPoint.coordY;

            this.squaredDistanceFromPoint = dx * dx + dy * dy;
        }

        return this.squaredDistanceFromPoint;
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

        if (index === 3) return this.squaredDistance();
    };
}