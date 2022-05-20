'use strict';

import React, { useLayoutEffect, useState } from 'react';
import { Math } from 'cesium';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import regionOfInterest from './classes/Region';
import axios from 'axios';
//import max from './Utils';

//const sitesUrl = "https://shay-israel-maps.vercel.app/sites";
const sitesUrl = "http://localhost:5000/sites";

const MefagrotComp = (props) => {
  const [question, setQuestion] = useState();
  const [answer, setAnswer] = useState();
  const [flow, setFlow] = useState("");

  const getDigit = (canBeZero) => {
    const first = canBeZero ? 0 : 1;

    const maxDigit = 9 - first;

    return first + parseInt(Math.nextRandomNumber() * maxDigit);
  };

  const getNumber = (maxDigits) => {
    maxDigits = max(1, maxDigits);

    const len = parseInt(Math.nextRandomNumber() * maxDigits) + 1;

    const arr = Array(len);

    for (let i = 0; i < len; i++)
      arr[i] = getDigit(true);

    return arr;
  };

  const setTheQuestion = (minNumbers, maxNumbers, maxDigits) => {
    minNumbers = max(2, minNumbers);
    maxNumbers = max(minNumbers, maxNumbers);

    const len = minNumbers + parseInt(Math.nextRandomNumber() * (maxNumbers - minNumbers)) + 1;

    let arr = Array(len);

    for (let i = 0; i < len; i++)
      arr[i] = getNumber(maxDigits);

    arr = [[9],[9,1,2,3],[9,5]];

    setQuestion(JSON.stringify(arr));

    setAnswer(JSON.stringify(sortArray(arr)));

    return arr;
  };

  const sortArray = (arr) => {
    return arr.sort((num1, num2) => {
      const arrCopy = arr;

      const len1 = num1.length;
      const len2 = num2.length;

      const len = min(len1, len2);

      let i = 0;

      let diff = 0;

      while (diff === 0 && i < len) {
        const d1 = num1[i];
        const d2 = num2[i++];

        console.log(`i = ${i}, d1 = ${d1}, d2 = ${d2}`);

        diff = d1 - d2;
      }

      if (diff === 0)
        diff = len2 - len1;

      const operat = diff === 0 ? "=" :
        diff > 0 ? ">" : "<";

      const str = `${JSON.stringify(num1)} ${operat} ${JSON.stringify(num2)}`;

      console.log(str);

      setFlow(`${flow}\n${str}`);

      diff *= -1;

      return diff;
    });
  }

  const min = (a, b) => (a < b ? a : b);

  const max = (a, b) => (a > b ? a : b);

  const abs = (val) => (val < 0 ? val * -1 : val);

  const floorDivision = (num, denom) => {
    let remainder = num % denom;

    while (remainder-- > 0)
      num--;

    return num / denom;
  };

  useLayoutEffect(() => {
    setTheQuestion(3, 3, 8);
  }, []);

  return (
    <div>
      <div>{question}</div>
      <div>{answer}</div>
      <div>{flow}</div>
    </div>
  );
};

export default MefagrotComp;