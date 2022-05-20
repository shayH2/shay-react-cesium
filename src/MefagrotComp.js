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
  const [question, setQuestion] = useState([]);
  const [answer, setAnswer] = useState([]);

  const getDigit = (canBeZero) => {
    const first = canBeZero ? 0 : 1;

    const maxDigit = 9 - first;

    return first + parseInt(Math.nextRandomNumber() * maxDigit);
  };

  const getNumber = (maxDigits) => {
    maxDigits = max(1, maxDigits);

    const len = parseInt(Math.nextRandomNumber() * maxDigits);

    const arr = Array(len);

    for (let i = 0; i < len; i++)
      arr[i] = getDigit(true);

    return arr;
  };

  const setTheQuestion = (maxNumbers, maxDigits) => {
    maxNumbers = max(2, maxNumbers);

    const len = parseInt(Math.nextRandomNumber() * maxNumbers);

    const arr = Array(len);

    for (let i = 0; i < len; i++)
      arr[i] = getNumber(maxDigits);

    setQuestion(arr);

    return arr;
  };

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
    setTheQuestion(10, 4);
  }, []);

  return (
    <div>
      <div>{question}</div>
      <div>{answer}</div>
    </div>
  );
};

export default MefagrotComp;
