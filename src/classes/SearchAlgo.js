'use strict';

import { utils } from './Conversions';

const naiveSearch = (
  pointsArray,
  found,
  points,
  pickedPoint,
  nearestDevices = 10,
  dist = 0.5,
  delta = 0.1
) => {
  if (!points) {
    points = new Map();

    pointsArray.forEach((point) =>
      points.set(point.id, point.coords)
    );
  }

  const lon = pickedPoint.x;
  const lat = pickedPoint.y;

  let index = 0;

  let keys = [...points.keys()];

  const foundLength = found.length;

  while (found.length < nearestDevices && index < points.size) {
    const key = keys[index++];

    const point0 = points.get(key);

    if (abs(point0.x - lon) < dist && abs(point0.y - lat) < dist) {
      found.push(point0);

      points.delete(key);
      //map1.delete('b');
      //points
    }
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
