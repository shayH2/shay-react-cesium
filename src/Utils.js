'use strict';

import { Cartographic, LabelStyle, Math } from 'cesium';

import convert from './classes/Conversions';

let pointsArray;

const getDummyPointsArray = () => {
  if (!pointsArray)
    pointsArray = initDummyPointsArray(
      2850,
      new regionOfInterest(-120, 60, -60, 10)
    );

  return pointsArray;
};

const initDummyPointsArray = (num, roi) => {
  const width = roi.right - roi.left;
  const height = roi.top - roi.bottom;

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

        if (index <= end)
          currentPoint = arr[index];
      }

      if (index === middle)
        while (index >= begin && newPoint.x <= currentPoint.x) {
          index--;

          if (index >= begin)
            currentPoint = arr[index];
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

        if ((distFromBegin < distToEnd || end >= (arr.length - 1)) && begin > 0) {
          begin--;

          if (arr[index].x > newPoint.x)
            newIndex--;

          for (let j = begin; j < newIndex; j++)
            arr[j] = arr[j + 1];
        } else {
          end++;

          if (arr[index].x < newPoint.x)
            newIndex++;

          for (let j = end; j > newIndex; j--)
            arr[j] = arr[j - 1];
        }

        arr[newIndex] = newPoint;
      }

      //alert(`begin = ${begin}, end= ${end}`);
    }
  }

  return arr;
};



const kuku = () => {
  

  let max = null;

  let i = 0;

  let errorIndex = 0;

  while (errorIndex < 1 && i < arr.length) {
    let x = arr[i].x;

    console.log(`arr[${i}]: ${x}`);

    if (max === null)
      max = x;

    if (x < max)
      errorIndex = i;

    i++;
  }

  if (errorIndex > 0)
    alert(`error index = ${errorIndex}`);

}



const floorDivision = (num, denom) => {
  let remainder = num % denom;

  while (remainder > 0) {
    remainder--;
    num--;
  }

  return num / denom;
}

const min = (a, b) => a < b ? a : b;

const max = (a, b) => a > b ? a : b;

// entity.position = cartesian;
// entity.label.show = true;
// entity.text = text;

export default {
  getDummyPointsArray,
};

const CoordsImage = 1;
const CoordsCartographoic = 2;
const CoordsCartesian = 3;

class regionOfInterest {
  constructor(l, t, r, b) {
    this.left = l;
    this.top = t;
    this.right = r;
    this.bottom = b;
  }
}

class point {
  constructor(x, y, z, coordsType) {
    this.coordX = x;
    this.coordY = y;
    this.z = z;
    this.coordsType = coordsType;
  }

  get x() {
    return this.coordX;
  }

  set x(val) {
    this.coordX = val;
  }

  get y() {
    return this.coordY;
  }

  set y(val) {
    this.coordY = val;
  }
}