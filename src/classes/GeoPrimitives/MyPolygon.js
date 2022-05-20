'use strict';

import regionOfInterest from "./MyRegion";

export default class MyPolygon {
    constructor(arr) {
        this.pointsArray = arr;
    }

    toFlatPolygon = () => {
        const arr = [this.pointsArray.length * 2];

        for (let i = 0; i < this.pointsArray.length; i++) {
            const point = this.pointsArray[i];

            const index = 2 * i;

            arr[index] = point.x;
            arr[index + 1] = point.y;
        }

        return arr;
    }

    toRegion = () => {
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

                if (right === null || x > right)
                    right = x;

                if (bottom === null || y < bottom)
                    bottom = y;
            });

            this.region = new regionOfInterest(left, top, right, bottom);
        }

        return this.region;
    };
}