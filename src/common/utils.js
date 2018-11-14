import Const from '../math/constants';


export function isNumeric(n) {
  const isit = (!Number.isNaN(parseFloat(n)) && Number.isFinite(n));
  return isit;
}

// Check if obj is an object with x and y properties
export function isPointLike(obj) {
  const isit = (isNumeric(obj.x) && isNumeric(obj.y));
  // console.log('point check', isit, obj);
  return isit;
}

export function approxTo(v, to, eps = Const.EPS) {
  return (Math.abs(v - to) < eps);
}

export function approxZero(v, eps = Const.EPS) {
  return (Math.abs(v) < eps);
}

export function cycleIterator(length) {
  return ({
    nextFrom: j => (j + 1) % length,
    prevFrom: j => (j <= 0 ? length - 1 + (j % length) : j - 1),
  });
}

export function cycle(array, cb, reverse = false) {
  if (reverse) {
    return array.map((d, i, arr) => {
      const cur = arr.length - (i + 1);
      const prev = cur + 1 < array.length ? cur + 1 : 0;
      const next = cur - 1 < 0 ? array.length - 1 : cur - 1;
      return cb(array[cur], array[next], array[prev], cur, next, prev, array);
    });
  }
  return array.map((d, i) => {
    const next = i + 1 < array.length ? i + 1 : 0;
    const prev = i - 1 < 0 ? array.length - 1 : i - 1;
    return cb(d, array[next], array[prev], i, next, prev, array);
  });
}

export function intersect(array, other, compareFunc) {
  if (compareFunc) {
    return array.filter(v => other.findIndex(ov => compareFunc(v, ov)) !== -1);
  }
  return array.filter(v => other.indexOf(v) !== -1);
}

export function union(array, other, compareFunc) {
  if (compareFunc) {
    return [...array, ...other.filter(v => array.findIndex(ov => compareFunc(v, ov)) === -1)];
  }
  return [...array, ...other.filter(v => array.indexOf(v) === -1)];
}

export function except(array, other, compareFunc) {
  if (compareFunc) {
    return array.filter(v => other.findIndex(ov => compareFunc(v, ov)) === -1);
  }
  return array.filter(v => other.indexOf(v) === -1);
}

export function toDecimals(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function equallySigned(tests) {
  const t1 = tests[0];
  const f = typeof t1 === 'function';

  const first = (f ? t1() : t1) < 0;
  for (let i = 1; i < tests.length; i++) {
    if ((f ? tests[i]() : tests[i]) < 0 !== first) return false;
  }
  return true;
}

export function allTrue(tests) {
  const t1 = tests[0];
  const f = typeof t1 === 'function';

  for (let i = 0; i < tests.length; i++) {
    if ((f ? tests[i]() : tests[i]) !== true) return false;
  }
  return true;
}

export function allFalse(tests) {
  const t1 = tests[0];
  const f = typeof t1 === 'function';

  for (let i = 0; i < tests.length; i++) {
    if ((f ? tests[i]() : tests[i]) !== false) return false;
  }
  return true;
}

export function anyTrue(tests) {
  const t1 = tests[0];
  const f = typeof t1 === 'function';

  for (let i = 0; i < tests.length; i++) {
    if ((f ? tests[i]() : tests[i]) === true) return true;
  }
  return false;
}

export function anyFalse(tests) {
  const t1 = tests[0];
  const f = typeof t1 === 'function';

  for (let i = 0; i < tests.length; i++) {
    if ((f ? tests[i]() : tests[i]) === false) return true;
  }
  return false;
}

export function allSame(tests) {
  const t1 = tests[0];
  const f = typeof t1 === 'function';

  const first = f ? t1() : t1;
  for (let i = 1; i < tests.length; i++) {
    if ((f ? tests[i]() : tests[i]) !== first) return false;
  }
  return true;
}

