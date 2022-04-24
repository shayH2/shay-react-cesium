'use strict';

import { Cartographic, LabelStyle, Math } from 'cesium';

import convert from './classes/Conversions';
import point from './classes/Point';

let pointsArray;

const getDummyPointsArray = (num, roi) => {
    if (!pointsArray) pointsArray = initDummyPointsArray(num, roi);

    return pointsArray;
};

const initDummyPointsArray = (num, roi) => {
    const width = roi.right - roi.left;
    const height = roi.top - roi.bottom;

    const diameter = min(height, width);
    const radius = diameter / 2;

    const r2 = radius * radius;

    const centerX = roi.left + width / 2;
    const centerY = roi.bottom + height / 2;

    const left = roi.left + width / 2 - radius;
    const bottom = roi.bottom + height / 2 - radius;

    const arr = Array(num).fill(null);

    const middle = floorDivision(num, 2);

    let begin, end;

    begin = end = middle;

    for (let i = 0; i < num; i++) {
        const x = roi.left + Math.nextRandomNumber() * width;

        const y = roi.bottom + Math.nextRandomNumber() * height;

        let x0 = diameter * Math.nextRandomNumber();

        x0 += left;

        let dx = centerX - x0;

        let dy2 = r2 - dx * dx;

        let dy = sqrt(dy2);

        let y0 = centerY + dy * (Math.nextRandomNumber() * 2 - 1);

        const newPoint = new point(x0, y0);

        let index = middle;

        let currentPoint = arr[index];

        if (!currentPoint) {
            arr[index] = newPoint;
        } else {
            while (index <= end && newPoint.x >= currentPoint.x) {
                index++;

                if (index <= end) currentPoint = arr[index];
            }

            if (index === middle)
                while (index >= begin && newPoint.x <= currentPoint.x) {
                    index--;

                    if (index >= begin) currentPoint = arr[index];
                }

            index = min(arr.length - 1, index);

            index = max(0, index);

            if (index > end) {
                arr[index] = newPoint;

                end = index;
            } else if (index < begin) {
                arr[index] = newPoint;

                begin = index;
            } else {
                const distFromBegin = index - begin;
                const distToEnd = end - index;

                //alert(`begin = ${begin}, end = ${end}, index = ${index}, distFromBegin = ${distFromBegin}, distToEnd = ${distToEnd}`);

                let newIndex = index;

                if (
                    (distFromBegin < distToEnd || end >= arr.length - 1) &&
                    begin > 0
                ) {
                    begin--;

                    if (arr[index].x > newPoint.x) newIndex--;

                    for (let j = begin; j < newIndex; j++) arr[j] = arr[j + 1];
                } else {
                    end++;

                    if (arr[index].x < newPoint.x) newIndex++;

                    for (let j = end; j > newIndex; j--) arr[j] = arr[j - 1];
                }

                arr[newIndex] = newPoint;
            }

            //alert(`begin = ${begin}, end= ${end}`);
        }
    }

    return arr;
};

const floorDivision = (num, denom) => {
    let remainder = num % denom;

    while (remainder > 0) {
        remainder--;
        num--;
    }

    return num / denom;
};

// To find orientation of ordered triplet (p, q, r).
// The function returns following values
// 0 --> p, q and r are collinear
// 1 --> Clockwise
// 2 --> Counterclockwise
function orientation(p, q, r) {
    let val = (q.y - p.y) * (r.x - q.x) -
        (q.x - p.x) * (r.y - q.y);

    if (val == 0) return 0; // collinear
    return (val > 0) ? 1 : 2; // clock or counterclock wise
}

// Prints convex hull of a set of n points.
function convexHull(points) {
    // There must be at least 3 points
    if (points.length < 3)
        return;

    // Initialize Result
    let hull = [];

    // Start from leftmost point, keep moving
    // counterclockwise until reach the start point
    // again. This loop runs O(h) times where h is
    // number of points in result or output.
    let p = 0,
        q;
    do {

        // Add current point to result
        hull.push(points[p]);

        // Search for a point 'q' such that
        // orientation(p, q, x) is counterclockwise
        // for all points 'x'. The idea is to keep
        // track of last visited most counterclock-
        // wise point in q. If any point 'i' is more
        // counterclock-wise than q, then update q.
        q = (p + 1) % points.length;

        for (let i = 0; i < points.length; i++) {
            // If i is more counterclockwise than
            // current q, then update q
            if (orientation(points[p], points[i], points[q]) ==
                2)
                q = i;
        }

        // Now q is the most counterclockwise with
        // respect to p. Set p as q for next iteration,
        // so that q is added to result 'hull'
        p = q;

    } while (p != 0); // While we don't come to first
    // point

    // Print Result
    ////for (let temp of hull.values())
    ////document.write("(" + temp.x + ", " +
    ////            temp.y + ")<br>");

    return hull;
}

const min = (a, b) => (a < b ? a : b);

const max = (a, b) => (a > b ? a : b);

const abs = val => val < 0 ? val * -1 : val;

const sqrt = (num) => {
    let approx = num / 2;

    let close = false;

    let i = 10;

    let prev;

    while (!close && i > 0) {
        i--;

        approx = (approx + num / approx) / 2;

        if (prev && abs(prev - approx) < 0.01)
            close = true;

        prev = approx;
    }

    return approx;
}

// entity.position = cartesian;
// entity.label.show = true;
// entity.text = text;

export default {
    getDummyPointsArray,
    convexHull
};

const CoordsImage = 1;
const CoordsCartographoic = 2;
const CoordsCartesian = 3;