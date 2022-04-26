'use strict';

import { utils } from './Conversions';

const naiveSearch = (
    pointsArray,
    found,
    pickedPoint,
    nearestDevices = 10,
    dist = 0.1,
    delta = 0.1,
    max = 3
) => {
    const lon = pickedPoint.x;
    const lat = pickedPoint.y;

    let index = 0;

    const dist2 = dist * dist;

    while (found.size < nearestDevices && index < pointsArray.length) {
        const currentIndex = index;

        const point0 = pointsArray[index++];

        if (!found.has(currentIndex)) {
            const dx = point0.x - lon;
            const dy = point0.y - lat;

            const c2 = dx * dx + dy * dy;

            if (c2 < dist2) found.set(currentIndex, point0);
        }
    }

    if (delta > 0 && found.size < nearestDevices && dist < max)
        naiveSearch(
            pointsArray,
            found,
            pickedPoint,
            nearestDevices,
            dist + delta,
            delta
        );
};

const abs = (num) => {
    if (num < 0) num *= -1;

    return num;
};

export default {
    naiveSearch,
};