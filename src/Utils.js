'use strict';

import { Cartographic, LabelStyle, Math } from 'cesium';

import convert from './classes/Conversions';

let pointsArray;

const getDummyPointsArray = () => {
    if (!pointsArray)
        pointsArray = initDummyPointsArray(
            5,
            new regionOfInterest(-120, 60, -60, 10)
        );

    return pointsArray;
};

const initDummyPointsArray = (num, roi) => {
    const arr = Array(num).fill(null);

    const width = roi.right - roi.left;
    const height = roi.top - roi.bottom;

    let num0 = num;

    if ((num0 % 2) === 1)
        num0 -= 1;

    const middle = num0 / 2;

    let begin = middle;
    let end = begin;

    for (let i = 0; i < num; i++) {
        const l = roi.left + Math.nextRandomNumber() * width;

        const t = roi.bottom + Math.nextRandomNumber() * height;

        const newPoint = new point(l, t);

        let index = middle;

        let currentPoint = arr[index];

        if (currentPoint) {
            let found = -1;

            if (newPoint.x < currentPoint.x) {
                let k = index - 1;

                while (found < 0 && k >= begin) {
                    currentPoint = arr[k];

                    if (newPoint.x > currentPoint.x)
                        found = k;

                    k--;
                }

                if (found < 0)
                    found = begin;
            } else {
                let k = index + 1;

                while (found < 0 && k <= end) {
                    currentPoint = arr[k];

                    if (newPoint.x < currentPoint.x)
                        found = k;

                    k++;
                }

                if (found < 0)
                    found = end;
            }

            if (found >= 0)
                index = found;

            if (index > end) {
                //alert(`end  ${end}`);
                arr[index] = newPoint;

                end = index;
                //alert(`end  ${end}`);
            } else if (index < begin) {
                //alert(`begin  ${begin}`);
                arr[index] = newPoint;

                begin = index;
                //alert(`begin  ${begin}`);
            } else {
                const distFromBegin = index - begin;
                const distToEnd = end - index;

                //alert(`index = ${index}, begin = ${begin}, end = ${end}`);

                let j;

                if (distFromBegin > distToEnd) {
                    if (end < arr.length - 1)
                        end++;

                    for (let j = end; j > index; j--)
                        arr[j] = arr[j - 1];
                } else {
                    if (begin > 0)
                        begin--;

                    for (let j = begin; j < index; j++)
                        arr[j] = arr[j + 1];
                }

                arr[index] = newPoint;
            }
        } else {
            arr[index] = newPoint;
        }
    }

    //regionOfInterest

    //if (i % 2 === 0) arr.push([-82 + i * 0.1, 37 + i * 0.1]);
    //else arr.push([-82 - i * 0.1, 37 - i * 0.1]);

    return arr;
};

const min = (a, b) => a < b ? a : b;

const max = (a, b) => a > b ? a : b;

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