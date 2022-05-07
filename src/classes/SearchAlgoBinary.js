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

    let i = relatedPoint.indices[coordIndex] + 1;

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

    i = relatedPoint.indices[coordIndex] - 1;

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


const searchSequential = (arr, searchPoint, foundPoint, coordIndex, number = 0) => {
    let foundArray = [foundPoint];

    let up = foundPoint.indices[coordIndex] + 1;
    let down = foundPoint.indices[coordIndex] - 1;

    let notFoundUp = false;
    let notFoundDown = false;

    while ((number < 1 || foundArray.length < number) && !notFoundUp && up < arr.length) {
        const pointUp = arr[up++];

        pointUp.distance = xDistance(searchPoint, pointUp, coordIndex);

        const foundUp = Math.abs(pointUp.distance) < Math.abs(threshold.Distance);

        if (foundUp) {
            const pointDistMiddle = pointDistance(searchPoint, pointUp);

            if (pointDistMiddle < threshold.Squared)
                foundArray.push(pointUp);
        }
    }

    while ((number < 1 || foundArray.length < number) && !notFoundDown && down >= 0) {
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

const searchPointsArray = (arrMap, coordIndex, searchPoint, number = 0) => {
    const arr = arrMap.get(coordIndex);

    const pointBegin = arr[0];
    const pointEnd = arr[arr.length - 1];

    return searchPointsArrayImplementation(arr, coordIndex, searchPoint, pointBegin, pointEnd, number);
}

const searchPointsArrayImplementation = (arr, coordIndex, searchPoint, pointBegin, pointEnd, number = 0) => {
    if (!searchPoint)
        return;

    let result = null;

    if (pointEnd.indices[coordIndex] < pointBegin.indices[coordIndex])
        return null;

    const middle = Math.floor((pointBegin.indices[coordIndex] + pointEnd.indices[coordIndex]) / 2);

    const pointMiddle = arr[middle];

    pointMiddle.distance = xDistance(searchPoint, pointMiddle, coordIndex);

    if (Math.abs(pointMiddle.distance) < Math.abs(threshold.Distance)) {
        const pointDistMiddle = pointDistance(searchPoint, pointMiddle);

        if (pointDistMiddle < threshold.Squared)
            return searchSequential(arr, searchPoint, pointMiddle, coordIndex, number);

        result = sequentialBypass(arr, searchPoint, pointMiddle, coordIndex);

        if (Array.isArray(result))
            return result;
    }

    pointBegin.distance = xDistance(searchPoint, pointBegin, coordIndex);

    if (Math.abs(pointBegin.distance) < Math.abs(threshold.Distance)) {
        const pointDistBegin = pointDistance(searchPoint, pointBegin);

        if (pointDistBegin < threshold.Squared)
            return searchSequential(arr, searchPoint, pointBegin, coordIndex, number);

        result = sequentialBypass(arr, searchPoint, pointBegin, coordIndex);

        if (Array.isArray(result))
            return result;
    }

    pointEnd.distance = xDistance(searchPoint, pointEnd, coordIndex);

    if (Math.abs(pointEnd.distance) < Math.abs(threshold.Distance)) {
        const pointDistEnd = pointDistance(searchPoint, pointEnd);

        if (pointDistEnd < threshold.Squared)
            return searchSequential(arr, searchPoint, pointEnd, coordIndex, number);

        result = sequentialBypass(arr, searchPoint, pointEnd, coordIndex);

        if (Array.isArray(result))
            return result;
    }

    if (pointMiddle.indices[coordIndex] < pointEnd.indices[coordIndex]) {
        const productUpper = pointMiddle.distance * pointEnd.distance;

        if (productUpper < 0) {
            const indexUp = pointMiddle.indices[coordIndex] + 1;
            const pointBeginNew = arr[indexUp];
            pointBeginNew.indices[coordIndex] = pointMiddle.indices[coordIndex] + 1; //TODO:

            result = searchPointsArrayImplementation(arr, coordIndex, searchPoint, pointBeginNew, pointEnd, number);

            if (Array.isArray(result))
                return result;
        }
    }

    if (pointMiddle.indices[coordIndex] > pointBegin.indices[coordIndex]) {
        const productLower = pointBegin.distance * pointMiddle.distance;

        if (productLower < 0) {
            const indexDown = pointMiddle.indices[coordIndex] - 1;
            const pointEndNew = arr[indexDown];
            pointEndNew.indices[coordIndex] = indexDown; //TODO:

            result = searchPointsArrayImplementation(arr, coordIndex, searchPoint, pointBegin, pointEndNew, number);

            if (Array.isArray(result))
                return result;
        }
    }
}

export default { searchPointsArray };