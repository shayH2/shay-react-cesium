'use strict';

import { Cartographic, LabelStyle, Math, Cartesian3 } from 'cesium';

import convert from './classes/Conversions';
import MyPoint from './classes/Point';
import Link from './classes/LinkedList/Link';

let arrayOfArrays;

const getDummyPointsArray = (num, roi, coordIndex, list = null) => {
    let pointsArray;

    if (!Array.isArray(arrayOfArrays))
        arrayOfArrays = Array(2).fill(null);

    //if (Array.isArray(arrayOfArrays) && coordIndex < arrayOfArrays.length)
    pointsArray = arrayOfArrays[coordIndex];

    if (!pointsArray) {
        pointsArray = initDummyPointsArray(num, roi, coordIndex, list);

        arrayOfArrays[coordIndex] = pointsArray;
    }

    return pointsArray;
};

const initDummyPointsArray = (num, roi, coordIndex, list = null) => {
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

    for (let i = 0; i < num; i++) {
        const x = roi.left + Math.nextRandomNumber() * width;

        const y = roi.bottom + Math.nextRandomNumber() * height;

        /*
                let x0 = diameter * Math.nextRandomNumber();

                x0 += left;

                let dx = centerX - x0;

                let dy2 = r2 - dx * dx;

                let dy = sqrt(dy2);

                let y0 = centerY + dy * (Math.nextRandomNumber() * 2 - 1);
                */

        arr[i] = new MyPoint(x, y);
    }

    return initSortedPointsArray(arr, coordIndex, list);
};

const pointInPolygon = (point, polygon, roi = null) => {
    const x = point.x,
        y = point.y;

    let inside = false;

    if (roi) {
        const inRoi = x >= roi.left && x <= roi.right && y >= roi.bottom && y <= roi.top;

        if (!inRoi)
            return false;
    }

    for (
        let i = 0, j = polygon.length - 1; i < polygon.length; j = i++
    ) {
        var xi = polygon[i].x,
            yi = polygon[i].y;
        var xj = polygon[j].x,
            yj = polygon[j].y;

        var intersect =
            yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
    }

    return inside;
};

const initSortedPointsArray = (unordered, coordIndex, list = null) => {
    const num = unordered.length;

    const arr = Array(num).fill(null);

    const middle = floorDivision(num, 2);

    let begin, end;

    begin = end = middle;

    let currLink = null;

    for (let i = 0; i < num; i++) {
        const newPoint = unordered[i];

        const newCoord = newPoint.getCoord(coordIndex)

        const newLink = new Link(newPoint);

        console.log(`[${i}], ${newPoint.toString()}`);

        if (list.isEmpty()) {
            list.init(newLink);
        } else {
            let link = currLink || list.head;

            let inserted = false;

            let forward = null;

            while (!inserted && link) {
                let currPoint = link.value;

                let currCoord = currPoint.getCoord(coordIndex);

                if (forward === null) {
                    forward = newCoord > currCoord;

                    //console.log(`current: ${currCoord}, new: ${newCoord}, forward: ${forward}`);
                }

                if ((forward === true && newCoord <= currCoord) ||
                    (forward === false && newCoord >= currCoord)) {
                    link.insert(newLink, !forward);

                    currLink = link;

                    inserted = true;

                    console.log(`inserted, current: ${currCoord}, new: ${newCoord}, forward: ${forward}`);
                }
                else {
                    link = forward
                        ? link.next
                        : link.prev;
                }
            }

            if (inserted === false && link === null) {
                console.log(`added, new: ${newCoord}, forward: ${forward}`);
                list.add(newLink, forward);
                currLink = newLink;
            }
        }

        console.log(`list = ${list.toString0(coordIndex)}`);

        let index = middle;

        let currentPoint = arr[index];

        if (!currentPoint) {
            arr[index] = newPoint;
            newPoint.indices[coordIndex] = index;
        } else {
            while (
                index <= end &&
                newPoint.getCoord(coordIndex) >=
                currentPoint.getCoord(coordIndex)
            ) {
                index++;

                if (index <= end) currentPoint = arr[index];
            }

            if (index === middle)
                while (
                    index >= begin &&
                    newPoint.getCoord(coordIndex) <=
                    currentPoint.getCoord(coordIndex)
                ) {
                    index--;

                    if (index >= begin) currentPoint = arr[index];
                }

            index = min(arr.length - 1, index);

            index = max(0, index);

            if (index > end) {
                arr[index] = newPoint;
                newPoint.indices[coordIndex] = index;

                end = index;
            } else if (index < begin) {
                arr[index] = newPoint;
                newPoint.indices[coordIndex] = index;

                begin = index;
            } else {
                const distFromBegin = index - begin;
                const distToEnd = end - index;

                let newIndex = index;

                if (
                    (distFromBegin < distToEnd || end >= arr.length - 1) &&
                    begin > 0
                ) {
                    begin--;

                    if (
                        arr[index].getCoord(coordIndex) >
                        newPoint.getCoord(coordIndex)
                    )
                        newIndex--;

                    for (let j = begin; j < newIndex; j++) {
                        arr[j] = arr[j + 1];
                        arr[j].indices[coordIndex] = j;
                    }
                } else {
                    end++;

                    if (
                        arr[index].getCoord(coordIndex) <
                        newPoint.getCoord(coordIndex)
                    )
                        newIndex++;

                    for (let j = end; j > newIndex; j--) {
                        arr[j] = arr[j - 1];
                        arr[j].indices[coordIndex] = j;
                    }
                }

                arr[newIndex] = newPoint;
                newPoint.indices[coordIndex] = newIndex;
            }
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
    let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

    if (val == 0) return 0; // collinear
    return val > 0 ? 1 : 2; // clock or counterclock wise
}

// Prints convex hull of a set of n points.
function convexHull(points) {
    // There must be at least 3 points
    if (points.length < 3) return;

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
            if (orientation(points[p], points[i], points[q]) == 2) q = i;
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

const abs = (val) => (val < 0 ? val * -1 : val);

const sqrt = (num) => {
    let approx = num / 2;

    let close = false;

    let i = 10;

    let prev;

    while (!close && i > 0) {
        i--;

        approx = (approx + num / approx) / 2;

        if (prev && abs(prev - approx) < 0.01) close = true;

        prev = approx;
    }

    return approx;
};

let oneDegreeInMeters;

const getOneDegreeInMeters = () => {
    if (!oneDegreeInMeters) {
        const point0 = Cartesian3.fromDegrees(0, 0);
        const point1 = Cartesian3.fromDegrees(1, 1);

        const dx = point0.x - point1.x;
        const dy = point0.y - point1.y;

        oneDegreeInMeters = sqrt(dx * dx + dy * dy);
    }

    return oneDegreeInMeters;
};

const groupByDistance = (pointsArray, width) => {
    width *= width;

    const arr = [];

    let start = null;

    for (let i = 0; i < pointsArray.length; i++) {
        const current = pointsArray[i];

        if (!start)
            start = current;

        const distStart = start.getCoord(3);
        const distCurrent = current.getCoord(3);

        const subtraction = distCurrent - distStart;

        if (subtraction > width) {
            arr.push(i);

            start = null;
        }
    }

    return arr;
};

// entity.position = cartesian;
// entity.label.show = true;
// entity.text = text;

export default {
    initSortedPointsArray,
    getDummyPointsArray,
    convexHull,
    pointInPolygon,
    groupByDistance,
    getOneDegreeInMeters,
    sqrt, min, max
};

const CoordsImage = 1;
const CoordsCartographoic = 2;
const CoordsCartesian = 3;