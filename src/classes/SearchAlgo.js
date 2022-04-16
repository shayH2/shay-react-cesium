'use strict';

import { utils } from './Conversions';

const naiveSearch = (
  pointsArray,
  found,
  pickedPoint,
  nearestDevices = 10,
  dist = 0.5,
  delta = 0.1
) => {
  const lon = pickedPoint.x;
  const lat = pickedPoint.y;

  let index = 0;

  while (found.size < nearestDevices && index < pointsArray.length) {
    const currentIndex = index;

    const point0 = pointsArray[index++];

    if (!found.has(currentIndex) && abs(point0.x - lon) < dist && abs(point0.y - lat) < dist) 
      found.set(currentIndex, point0);
  }

  //if (found.length > foundLength && found.length < num)
  //naiveSearch(found, points, pickedPoint, num);
};

const abs = (num) => {
  if (num < 0) num *= -1;

  return num;
};

export default {
  naiveSearch,
};
