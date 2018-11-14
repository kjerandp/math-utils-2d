import Vector from './vector';
import Point from './point';
import Cache from '../common/cache';
import { approxZero } from '../common/utils';


export default class Line {
  /**
   * Create an instance of the Line class
   * @param {Vector} vector slope of line
   * @param {Point} point a point the line should intersect
   * @param {bool} cache cache calculated values
   */
  constructor(vector, point = Point.ORIGO, cache = true) {
    this.vector = vector.unit();
    this.point = point;

    this.cache = cache ?
      new Cache(() =>
        `${this.vector.x},${this.vector.y},${this.point.x},${this.point.y}`) : undefined;
  }

  /**
   * Create an instance of a line given two points
   * @param {Point} p1
   * @param {Point} p2
   */
  static fromPoints(p1, p2) {
    const v = new Vector(p1, p2).unit();
    return new Line(v, p1);
  }

  /**
   * Create a line from the standard form: y(x) = mx + b
   * @param {Number} m slope (dy/dx)
   * @param {Number} b y-intersect
   */
  static fromStandardForm(m, b) {
    const p1 = new Point(0, b);
    const p2 = new Point(1, m + b);
    return this.fromPoints(p1, p2);
  }

  static pointOnLine(pt, lp, lv) {
    const v = new Vector(pt, lp);
    return approxZero(lv.cross(v));
  }

  get m() {
    if (this.vector.x === 0) return undefined;
    if (this.cache) {
      const m = this.cache.get('m');
      if (m !== undefined) return m;
    }
    const m = this.vector.y / this.vector.x;
    if (this.cache) {
      this.cache.set('m', m);
    }
    return m;
  }

  get b() {
    if (this.cache) {
      const b = this.cache.get('b');
      if (b !== undefined) return b;
    }
    const b = this.y(0);
    if (this.cache) {
      this.cache.set('b', b);
    }
    return b;
  }

  /**
   * Check if a point is on the line
   * @param {Point} p point to test
   */
  pointOnLine(p) {
    return Line.pointOnLine(p, this.point, this.vector);
  }

  /**
   * Get the angle of the line's slope
   */
  angle() {
    return this.vector.angle().normalize(true);
  }

  /**
   * Find the time from the start (reference point) of the line to the
   * position matching the given x value (0-1)
   * @param {Number} x
   */
  tx(x) {
    if (this.vector.x === 0) return undefined;
    const t = (x - this.point.x) / this.vector.x;
    return t;
  }

  /**
   * Find the time from the start (reference point) of the line to the
   * position matching the given y value (0-1)
   * @param {Number} x
   */
  ty(y) {
    if (this.vector.y === 0) return undefined;
    const t = (y - this.point.y) / this.vector.y;
    return t;
  }

  /**
   * Get the line's x value corresponding to the given y value
   * @param {Number} y
   */
  x(y) {
    const t = this.ty(y);
    if (t === undefined) return undefined;
    return this.point.x + t * this.vector.x;
  }

  /**
   * Get the line's y value corresponding to the given x value
   * @param {Number} x
   */
  y(x) {
    const t = this.tx(x);
    if (t === undefined) return undefined;
    return this.point.y + t * this.vector.y;
  }

  /**
   * Get the corresponding y values for the given set of x values
   * @param  {...Number} xs
   */
  ys(...xs) {
    return xs.map(x => this.y(x));
  }

  /**
   * Get the corresponding points for the given set of x values
   * @param  {...Point} xs
   */
  points(...xs) {
    return xs.map(x => new Point(x, this.y(x)));
  }

  /**
   * Clone line instance
   */
  clone() {
    return new Line(this.vector, this.point);
  }
}
