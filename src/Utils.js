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

    const newPoint = new point(x, y);

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

const min = (a, b) => (a < b ? a : b);

const max = (a, b) => (a > b ? a : b);

// entity.position = cartesian;
// entity.label.show = true;
// entity.text = text;

export default {
  getDummyPointsArray,
};

const CoordsImage = 1;
const CoordsCartographoic = 2;
const CoordsCartesian = 3;
