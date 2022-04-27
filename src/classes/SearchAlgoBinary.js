'use strict';

import point from './Point';

const val = "val";
const Id = "Id";
const Row = "Row";
const Col = "Col";
const Comment0 = "Comment";

const hitTest = (row, col, arrayOfArrays, threshold = {
    Distance: 0.1,
    Squared: 0.01
}, maxList = 1) => {
    let obj0;

    if (Array.isArray(arrayOfArrays) && arrayOfArrays.length == 2) {
        let result = null;

        const obj = { Row: row, Col: col };

        const arrRows = arrayOfArrays[0];
        const arrCols = arrayOfArrays[1];

        const checkedObjects = [];

        if (arrRows && Array.isArray(arrRows.arr) && arrRows.arr.length > 0 &&
            arrCols && Array.isArray(arrCols.arr)) {

            //result = searchArray(arrRows, obj, 0, arrRows.getLength() - 1, null, null, checkedObjects); //, (obj, obj0, threshold) => distanceRow(obj, obj0));

            const pointBegin = {
                index: 0,
                distance: null
            };

            const pointEnd = {
                index: arrRows.arr.length - 1,
                distance: null
            };

            result = searchPointsArray(arrRows, obj, pointBegin, pointEnd, checkedObjects); //, (obj, obj0, threshold) => distanceRow(obj, obj0));
        }

        return result;
    }
}

const pointDistance = (p1, p2) => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;

    return dx * dx + dy * dy;
};

const xDistance = (p1, p2) => p1.x - p2.x;

const threshold = {
    Distance: 4,
    Squared: 16
};

const setPoint = (index, distance) => {
    return {
        index: index,
        distance: distance
    };
};

const copyPoint = (point) => {
    return {
        index: point.index,
        distance: point.distance
    };
};

const setDoubleIndexPoint = (point, index, distance, threshold = null) => {
    if (point === null)
        point = {
            min: index,
            max: index,
            distance: distance
        };

    if (Math.abs(distance) < Math.abs(threshold)) {
        if (index < point.min)
            point.min = index;

        if (index > point.max)
            point.max = index;

        distance = 0;
    } else {
        if (Math.abs(distance) < Math.abs(point.distance) || index < point.min)
            point.min = index;

        if (Math.abs(distance) < Math.abs(point.distance) || index > point.max)
            point.max = index;

        point.distance = distance;
    }

    return point;
}




const sequentialBypass = (arr, searchPoint, relatedPoint, checkedObjects = null) => {
    let result = null;

    let i = relatedPoint.index + 1;

    let distance = 0;

    while (result === null && distance < threshold.Distance && i < arr.length) {
        let point0 = arr[i];

        distance = xDistance(searchPoint, point0);

        if (Array.isArray(checkedObjects))
            checkedObjects.push({
                index: i,
                row: obj0.val.Row,
                col: obj0.val.Col,
                dist: distance
            });

        i++;

        if (Math.abs(distance) < Math.abs(threshold.Distance)) {
            const squared = pointDistance(searchPoint, point0);

            if (squared < threshold.Squared)
                result = point0;
        }
    }

    i = point.index - 1;

    while (result === null && distance < threshold.Distance && i >= 0) {
        let obj0 = list.arr[i];

        distance = xDistance(obj, obj0);

        if (Array.isArray(checkedObjects))
            checkedObjects.push({
                index: i,
                row: obj0.val.Row,
                col: obj0.val.Col,
                dist: distance
            });

        i--;

        if (Math.abs(distance) < Math.abs(threshold.Distance)) {
            const squared = pointDistance(obj, obj0);

            if (squared < threshold.Squared)
                result = obj0;
        }
    }

    return result;
}





const searchPointsArray = (arr, searchPoint, pointBegin, pointEnd, checkedObjects = null) => {
    if (!searchPoint)
        return;

    let result = null;

    if (pointEnd.index < pointBegin.index)
        return null;

    const middle = Math.floor((pointBegin.index + pointEnd.index) / 2);

    ////////const objMiddle = list.arr[pointMiddle.index];
    const pointMiddle = arr[middle];

    pointMiddle.distance = xDistance(searchPoint, pointMiddle);

    if (Array.isArray(checkedObjects))
        checkedObjects.push({
            index: pointMiddle.index,
            row: objMiddle.val.Row,
            col: objMiddle.val.Col,
            dist: pointMiddle.distance
        });

    if (Math.abs(pointMiddle.distance) < Math.abs(threshold.Distance)) {
        const pointDistMiddle = pointDistance(searchPoint, pointMiddle);

        if (pointDistMiddle < threshold.Squared)
            return [pointMiddle];

        result = sequentialBypass(arr, searchPoint, pointMiddle, checkedObjects);

        if (result)
            return [result];
    }

    pointBegin.distance = xDistance(searchPoint, pointBegin);

    if (Math.abs(pointBegin.distance) < Math.abs(threshold.Distance)) {
        const pointDistBegin = pointDistance(searchPoint, pointBegin);

        if (pointDistBegin < threshold.Squared)
            return [pointBegin];

        result = sequentialBypass(arr, searchPoint, pointBegin, checkedObjects);

        if (result)
            return [result];
    }

    pointEnd.distance = xDistance(searchPoint, pointEnd);

    if (Math.abs(pointEnd.distance) < Math.abs(threshold.Distance)) {
        const pointDistEnd = pointDistance(searchPoint, pointEnd);

        if (pointDistEnd < threshold.Squared)
            return [pointEnd];

        result = sequentialBypass(arr, searchPoint, pointEnd, checkedObjects);

        if (result)
            return [result];
    }

    if (pointMiddle.index < pointEnd.index) {
        const productUpper = pointMiddle.distance * pointEnd.distance;

        if (productUpper < 0) {
            pointBeginNew = new point(null, null, null, null, pointMiddle.index + 1);

            result = searchPointsArray(list, obj, pointBeginNew, pointEnd, checkedObjects);

            if (result)
                return [result];
        }
    }

    if (pointMiddle.index > pointBegin.index) {
        const productLower = pointBegin.distance * pointMiddle.distance;

        if (productLower < 0) {
            pointEndNew = new point(null, null, null, null, pointMiddle.index - 1);

            result = searchArray(list, obj, pointBegin, pointEndNew, checkedObjects);

            if (result)
                return [result];
        }
    }
}

// Naive method, to be replaced with a proper one.
const hitTest0 = (col, row, arr) => {
    let dist = 0;
    let obj = null;

    if (Array.isArray(arr) && arr.length > 0)
        arr.forEach(element => {
            const x2 = element[2];
            const y2 = element[3];

            const d = distance(col, row, x2, y2);

            if (d < dist || obj === null) {
                obj = element;

                dist = d;
            }
        });

    return obj;
}

export default { searchPointsArray };