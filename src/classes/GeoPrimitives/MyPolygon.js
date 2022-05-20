'use strict';

import regionOfInterest from "./MyRegion";

export default class MyPolygon {
    constructor(arr) {
        this.pointsArray = arr;
    }

    getRegion = () => {
        if (!this.region) {
            let left = null,
                top = null,
                right = null,
                bottom = null;

            this.pointsArray.forEach(point => {
                const x = point.x;
                const y = point.y;

                if (left === null || x < left)
                    left = x;

                if (top === null || y > top)
                    top = y;

                if (right === null || y > right)
                    right = y;

                if (bottom === null || y < bottom)
                    bottom = y;
            });

            this.region = new regionOfInterest(left, top, bottom, right);
        }

        return this.region;
    };
}