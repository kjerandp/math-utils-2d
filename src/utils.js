import Const from './constants';

export default class Util {
  static isNumeric(n) {
    const isit = (!Number.isNaN(parseFloat(n)) && Number.isFinite(n));
    return isit;
  }

  // Check if obj is an object with x and y properties
  static isPointLike(obj) {
    const isit = (Util.isNumeric(obj.x) && Util.isNumeric(obj.y));
    // console.log('point check', isit, obj);
    return isit;
  }

  static approxTo(v, to, eps = Const.EPS) {
    return (Math.abs(v - to) < eps);
  }

  static approxZero(v, eps = Const.EPS) {
    return (Math.abs(v) < eps);
  }

  static cycleIterator(length) {
    return ({
      nextFrom: j => (j + 1) % length,
      prevFrom: j => (j <= 0 ? length - 1 + (j % length) : j - 1),
    });
  }

  static toDecimals(value, decimals) {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
  }

  static equallySigned(tests) {
    const t1 = tests[0];
    const f = typeof t1 === 'function';

    const first = (f ? t1() : t1) < 0;
    for (let i = 1; i < tests.length; i++) {
      if ((f ? tests[i]() : tests[i]) < 0 !== first) return false;
    }
    return true;
  }

  static allTrue(tests) {
    const t1 = tests[0];
    const f = typeof t1 === 'function';

    for (let i = 0; i < tests.length; i++) {
      if ((f ? tests[i]() : tests[i]) !== true) return false;
    }
    return true;
  }

  static allFalse(tests) {
    const t1 = tests[0];
    const f = typeof t1 === 'function';

    for (let i = 0; i < tests.length; i++) {
      if ((f ? tests[i]() : tests[i]) !== false) return false;
    }
    return true;
  }

  static anyTrue(tests) {
    const t1 = tests[0];
    const f = typeof t1 === 'function';

    for (let i = 0; i < tests.length; i++) {
      if ((f ? tests[i]() : tests[i]) === true) return true;
    }
    return false;
  }

  static anyFalse(tests) {
    const t1 = tests[0];
    const f = typeof t1 === 'function';

    for (let i = 0; i < tests.length; i++) {
      if ((f ? tests[i]() : tests[i]) === false) return true;
    }
    return false;
  }

  static allSame(tests) {
    const t1 = tests[0];
    const f = typeof t1 === 'function';

    const first = f ? t1() : t1;
    for (let i = 1; i < tests.length; i++) {
      if ((f ? tests[i]() : tests[i]) !== first) return false;
    }
    return true;
  }
}
