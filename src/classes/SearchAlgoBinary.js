'use strict';

import MyPoint from './Point';

const val = "val";
const Id = "Id";
const Row = "Row";
const Col = "Col";
const Comment0 = "Comment";

const pointDistance = (p1, p2) => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;

    return dx * dx + dy * dy;
};

const xDistance = (p1, p2, coordIndex) => p1.getCoord(coordIndex) - p2.getCoord(coordIndex);

const threshold = {
    Distance: 0.5,
    Squared: 0.25
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




const sequentialBypass = (arr, searchPoint, relatedPoint, coordIndex) => {
    let result = null;

    let i = relatedPoint.index + 1;

    let distance = 0;

    while (result === null && distance < threshold.Distance && i < arr.length) {
        let point0 = arr[i];

        distance = xDistance(searchPoint, point0, coordIndex);

        i++;

        if (Math.abs(distance) < Math.abs(threshold.Distance)) {
            const squared = pointDistance(searchPoint, point0);

            if (squared < threshold.Squared)
                result = point0;
        }
    }

    i = relatedPoint.index - 1;

    while (result === null && distance < threshold.Distance && i >= 0) {
        let point0 = arr[i];

        distance = xDistance(searchPoint, point0, coordIndex);

        i--;

        if (Math.abs(distance) < Math.abs(threshold.Distance)) {
            const squared = pointDistance(searchPoint, point0);

            if (squared < threshold.Squared)
                result = point0;
        }
    }

    return result;
}


const searchSequential = (arr, searchPoint, foundPoint, coordIndex) => {
    let foundArray = [foundPoint];

    let up = foundPoint.index + 1;
    let down = foundPoint.index - 1;

    let notFoundUp = false;
    let notFoundDown = false;

    while (!notFoundUp && up < arr.length) {
        const pointUp = arr[up++];

        pointUp.distance = xDistance(searchPoint, pointUp, coordIndex);

        const foundUp = Math.abs(pointUp.distance) < Math.abs(threshold.Distance);

        if (foundUp) {
            const pointDistMiddle = pointDistance(searchPoint, pointUp);

            if (pointDistMiddle < threshold.Squared)
                foundArray.push(pointUp);
        }
    }

    while (!notFoundDown && down >= 0) {
        const pointDown = arr[down--];

        pointDown.distance = xDistance(searchPoint, pointDown, coordIndex);

        const foundDown = Math.abs(pointDown.distance) < Math.abs(threshold.Distance);

        if (foundDown) {
            const pointDistMiddle = pointDistance(searchPoint, pointDown);

            if (pointDistMiddle < threshold.Squared)
                foundArray.push(pointDown);
        }
    }

    return foundArray;
};

const searchPointsArray = (arr, searchPoint, pointBegin, pointEnd, coordIndex) => {
    if (!searchPoint)
        return;

    let result = null;

    if (pointEnd.index < pointBegin.index)
        return null;

    const middle = Math.floor((pointBegin.index + pointEnd.index) / 2);

    const pointMiddle = arr[middle];

    pointMiddle.distance = xDistance(searchPoint, pointMiddle, coordIndex);

    if (Math.abs(pointMiddle.distance) < Math.abs(threshold.Distance)) {
        const pointDistMiddle = pointDistance(searchPoint, pointMiddle);

        if (pointDistMiddle < threshold.Squared)
            return searchSequential(arr, searchPoint, pointMiddle, coordIndex);

        result = sequentialBypass(arr, searchPoint, pointMiddle, coordIndex);

        if (Array.isArray(result))
            return result;
    }

    pointBegin.distance = xDistance(searchPoint, pointBegin, coordIndex);

    if (Math.abs(pointBegin.distance) < Math.abs(threshold.Distance)) {
        const pointDistBegin = pointDistance(searchPoint, pointBegin);

        if (pointDistBegin < threshold.Squared)
            return searchSequential(arr, searchPoint, pointBegin, coordIndex);

        result = sequentialBypass(arr, searchPoint, pointBegin, coordIndex);

        if (Array.isArray(result))
            return result;
    }

    pointEnd.distance = xDistance(searchPoint, pointEnd, coordIndex);

    if (Math.abs(pointEnd.distance) < Math.abs(threshold.Distance)) {
        const pointDistEnd = pointDistance(searchPoint, pointEnd);

        if (pointDistEnd < threshold.Squared)
            return searchSequential(arr, searchPoint, pointEnd, coordIndex);

        result = sequentialBypass(arr, searchPoint, pointEnd, coordIndex);

        if (Array.isArray(result))
            return result;
    }

    if (pointMiddle.index < pointEnd.index) {
        const productUpper = pointMiddle.distance * pointEnd.distance;

        if (productUpper < 0) {
            const indexUp = pointMiddle.index + 1;
            const pointBeginNew = arr[indexUp];
            pointBeginNew.index = pointMiddle.index + 1; //TODO:

            result = searchPointsArray(arr, searchPoint, pointBeginNew, pointEnd, coordIndex);

            if (Array.isArray(result))
                return result;
        }
    }

    if (pointMiddle.index > pointBegin.index) {
        const productLower = pointBegin.distance * pointMiddle.distance;

        if (productLower < 0) {
            const indexDown = pointMiddle.index - 1;
            const pointEndNew = arr[indexDown];
            pointEndNew.index = indexDown; //TODO:

            result = searchPointsArray(arr, searchPoint, pointBegin, pointEndNew, coordIndex);

            if (Array.isArray(result))
                return result;
        }
    }
}

export default { searchPointsArray };