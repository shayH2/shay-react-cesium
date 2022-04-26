'use strict';

import point from './Point';

const val = "val";
const Id = "Id";
const Row = "Row";
const Col = "Col";
const Comment0 = "Comment";

const hitTest = (row, col, arrayOfArrays, threshold = {
    Distance: 4,
    Squared: 16
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

            result = searchArray(arrRows, obj, pointBegin, pointEnd, checkedObjects); //, (obj, obj0, threshold) => distanceRow(obj, obj0));
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
            return pointMiddle;

        result = sequentialBypass(arr, searchPoint, pointMiddle, checkedObjects);

        if (result)
            return result;
    }

    pointBegin.distance = xDistance(searchPoint, pointBegin);

    if (Math.abs(pointBegin.distance) < Math.abs(threshold.Distance)) {
        const pointDistBegin = pointDistance(searchPoint, pointBegin);

        if (pointDistBegin < threshold.Squared)
            return objBegin;

        result = sequentialBypass(arr, searchPoint, pointBegin, checkedObjects);

        if (result)
            return result;
    }

    pointEnd.distance = xDistance(searchPoint, pointEnd);

    if (Math.abs(pointEnd.distance) < Math.abs(threshold.Distance)) {
        const pointDistEnd = pointDistance(searchPoint, pointEnd);

        if (pointDistEnd < threshold.Squared)
            return objEnd;

        result = sequentialBypass(arr, searchPoint, pointEnd, checkedObjects);

        if (result)
            return result;
    }

    if (pointMiddle.index < pointEnd.index) {
        const productUpper = pointMiddle.distance * pointEnd.distance;

        if (productUpper < 0) {
            pointBeginNew = {
                index: pointMiddle.index + 1,
                distance: null
            };

            result = searchArray(list, obj, pointBeginNew, pointEnd, checkedObjects);

            if (result)
                return result;
        }
    }

    if (pointMiddle.index > pointBegin.index) {
        const productLower = pointBegin.distance * pointMiddle.distance;

        if (productLower < 0) {
            pointEndNew = {
                index: pointMiddle.index - 1,
                distance: null
            };

            result = searchArray(list, obj, pointBegin, pointEndNew, checkedObjects);

            if (result)
                return result;
        }
    }
}










const searchArray0 = (list, obj, b, e, prevPoint = null, minPoint = null, checkedObjects = null) => {
    let result = null;

    if (e < b)
        return null;

    const middle = Math.floor((b + e) / 2);

    const objMiddle = list.arr[middle];

    const rowDistMiddle = rowDistance(obj, objMiddle);

    if (Array.isArray(checkedObjects))
        checkedObjects.push({
            index: middle,
            row: objMiddle.val.Row,
            col: objMiddle.val.Col,
            dist: rowDistMiddle
        });

    if (Math.abs(rowDistMiddle) < Math.abs(threshold.Distance)) {
        const pointDistMiddle = pointDistance(obj, objMiddle);

        if (pointDistMiddle < threshold.Squared)
            return objMiddle;

        prevPoint = setPoint(middle, rowDistMiddle);

        minPoint = setDoubleIndexPoint(minPoint, prevPoint.index, prevPoint.distance, threshold.Distance);

        if (middle > b)
            result = searchArray(list, obj, b, middle - 1, prevPoint, minPoint, checkedObjects);

        if (result)
            return result;

        if (middle < e)
            result = searchArray(list, obj, middle + 1, e, prevPoint, minPoint, checkedObjects);

        if (result)
            return result;
    } else {
        if (prevPoint === null) {
            prevPoint = setPoint(middle, rowDistMiddle);

            minPoint = setDoubleIndexPoint(minPoint, prevPoint.index, prevPoint.distance, threshold.Distance);

            if (middle > b)
                result = searchArray(list, obj, b, middle - 1, prevPoint, minPoint, checkedObjects);

            if (result)
                return result;

            if (middle < e)
                result = searchArray(list, obj, middle + 1, e, prevPoint, minPoint, checkedObjects);

            if (result)
                return result;
        } else {
            const prevPointTemp = prevPoint;
            const minPointTemp = minPoint;

            prevPoint = setPoint(middle, rowDistMiddle);

            let prevMin = null;
            let currMin = null;

            if (minPoint && "min" in minPoint)
                prevMin = minPoint.min;

            minPoint = setDoubleIndexPoint(minPoint, prevPoint.index, prevPoint.distance);

            if (minPoint && "min" in minPoint)
                currMin = minPoint.min;

            if (Math.abs(currMin) && Math.abs(prevMin)) {
                if (middle > b) // && middle > prevPointTemp.index)
                    result = searchArray(list, obj, b, middle - 1, prevPoint, minPoint, checkedObjects);

                if (result)
                    return result;

                if (middle < e) // && middle < prevPointTemp.index)
                    result = searchArray(list, obj, middle + 1, e, prevPoint, minPoint, checkedObjects);

                if (result)
                    return result;
            } else {
                if (Math.abs(rowDistMiddle) > Math.abs(prevPointTemp.distance)) {
                    if (middle > b && middle > prevPointTemp.index)
                        result = searchArray(list, obj, b, middle - 1, prevPoint, minPoint, checkedObjects);

                    if (result)
                        return result;

                    if (middle < e && middle < prevPointTemp.index)
                        result = searchArray(list, obj, middle + 1, e, prevPoint, minPoint, checkedObjects);

                    if (result)
                        return result;
                } else {
                    if (minPoint.distance > 0 && rowDistMiddle > minPoint.distance) {
                        const a = 0;
                    } else if (minPoint.distance < 0 && rowDistMiddle < minPoint.distance) {
                        const a = 0;
                    } else {
                        if (middle > b)
                            result = searchArray(list, obj, b, middle - 1, prevPoint, minPoint, checkedObjects);

                        if (result)
                            return result;

                        if (middle < e)
                            resulot = searchArray(list, obj, middle + 1, e, prevPoint, minPoint, checkedObjects);

                        if (result)
                            return result;
                    }













                    /*
                                        if (middle < e && middle > prevPointTemp.index) {
                                            if (middle < minPointTemp.min)
                                                searchArray(arrCols, list, obj, middle + 1, e, prevPoint, minPoint, checkedObjects);
                                            else if (middle > b)
                                                searchArray(arrCols, list, obj, b, middle - 1, prevPoint, minPoint, checkedObjects);
                                        }
                                        if (middle > b && middle < prevPointTemp.index) {
                                            if (middle > minPointTemp.max)
                                                searchArray(arrCols, list, obj, b, middle - 1, prevPoint, minPoint, checkedObjects);
                                            else if (e < middle)
                                                searchArray(arrCols, list, obj, middle + 1, e, prevPoint, minPoint, checkedObjects);
                                        }
                                        */
                }
            }
        }
    }

    return result;
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