import { isNumeric, approxZero } from '../common/utils';
import Vector from './vector';
import Angle from './angle';
import Types from '../common/types';

class Point {
  /**
   * Creates a new Point instance
   * @param {Number} x
   * @param {Number} y
   */
  constructor(x = 0, y = 0) {
    if (!isNumeric(x) || !isNumeric(y)) {
      throw new Error(`Point: Expected arguments x and y to be numbers, but got ${x} and ${y}`);
    }
    this.x = x;
    this.y = y;
  }

  /**
   * Get distance between two points
   * @param {Point} p1
   * @param {Point} p2
   */
  static distance(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx ** 2 + dy ** 2);
  }

  /**
   * Find the orientation of three points
   * @param {Point} p
   * @param {Point} q
   * @param {Point} r
   */
  static orientation(p, q, r) {
    const val = (q.y - p.y) * (r.x - q.x) -
              (q.x - p.x) * (r.y - q.y);

    if (val === 0) return Types.COLLINEAR;

    return (val > 0) ? Types.CLOCKWISE : Types.COUNTERCLOCKWISE;
  }

  /**
   * p1, p2 and p3:  Angle formed between p1 and p3 at p2
   * p1 and p2:      Angle formed between the line p1 -> p2 and the x axis
   * p1:             Angle between p1 and the origin
   * @param {Point} p1
   * @param {Point} p2
   * @param {Point} p3
   */
  static angle(p1, p2, p3) {
    if (p1 && p2 && p3) {
      const u = new Vector(p2, p3);
      const v = new Vector(p2, p1);

      return Vector.angle(u, v);
    }

    if (p1 && p2) {
      return new Angle(Math.atan2(p2.y - p1.y, p2.x - p1.x));
    }

    return new Angle(Math.atan2(p1.y, p1.x));
  }

  /**
   * Get point from polar coordinates
   * @param {Number} r
   * @param {Angle/Number} angle
   */
  static fromPolarCoords(r, angle) {
    const a = angle instanceof Angle ? angle.value : angle;

    return new Point(
      r * Math.cos(a),
      r * Math.sin(a),
    );
  }

  /**
   * Convert array of x and y value to Point instance
   * @param {Array} arr
   */
  static fromArray(arr) {
    return new Point(arr[0], arr[1]);
  }

  /**
   * Comparison function
   * @param {Point} p1
   * @param {Point} p2
   */
  static equals(p1, p2) {
    return approxZero(p1.x - p2.x) &&
      approxZero(p1.y - p2.y);
  }

  /**
   * Get the delta x of two points
   * @param {Point} p1
   * @param {Point} p2
   */
  static dx(p1, p2) { return p2.x - p1.x; }

  /**
   * Get the delta y of two points
   * @param {Point} p1
   * @param {Point} p2
   */
  static dy(p1, p2) { return p2.y - p1.y; }

  /**
   * Get the slope, defined as dy/dx, between two points
   * @param {Point} p1
   * @param {Point} p2
   */
  static slope(p1, p2) {
    const dx = Point.dx(p1, p2);
    if (dx === 0) return undefined;
    return Point.dy(p1, p2) / Point.dx(p1, p2);
  }

  /**
   * Calculate the average point from a set of points
   * @param {Array[Point]} points
   */
  static average(points) {
    const sum = points.reduce((s, p) => ({
      x: s.x + p.x,
      y: s.y + p.y,
    }), { x: 0, y: 0 });

    return new Point(sum.x / points.length, sum.y / points.length);
  }

  /**
   * Order a set of points counter clockwise
   * @param {Array[Point]} points
   */
  static order(points) {
    const center = Point.average(points);

    return points.sort((a, b) => {
      if (a.x - center.x >= 0 && b.x - center.x < 0) return 1;
      if (a.x - center.x < 0 && b.x - center.x >= 0) return -1;
      if (a.x - center.x === 0 && b.x - center.x === 0) {
        if (a.y - center.y >= 0 || b.y - center.y >= 0) return a.y > b.y ? 1 : -1;
        return b.y - a.y;
      }

      // compute the cross product of vectors (center -> a) x (center -> b)
      const det = (a.x - center.x) * (b.y - center.y) -
                  (b.x - center.x) * (a.y - center.y);
      if (det < 0) return 1;
      if (det > 0) return -1;

      // points a and b are on the same line from the center
      // check which point is closer to the center
      const d1 = (a.x - center.x) * (a.x - center.x) +
                 (a.y - center.y) * (a.y - center.y);
      const d2 = (b.x - center.x) * (b.x - center.x) +
                 (b.y - center.y) * (b.y - center.y);
      return d1 - d2;
    });
  }

  /**
   * Compare to other point
   * @param {Point} p
   */
  equals(p) {
    return Point.equals(this, p);
  }

  /**
   * Transform point instance to polar coordinates
   */
  toPolarCoords() {
    return ({
      r: Math.sqrt(this.x ** 2 + this.y ** 2),
      a: Point.angle(this),
    });
  }

  /**
   * Transform point instance to array
   */
  toArray() {
    return [this.x, this.y];
  }

  /**
   * Clone point instance
   */
  clone() {
    return new Point(this.x, this.y);
  }

  /**
   * Set new positon
   * @param {Number} x
   * @param {Number} y
   */
  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }
  /**
   * Translate/move point
   * @param {Number} dx
   * @param {Number} dy
   * @param {bool} mutate
   */
  translate(dx, dy, mutate = false) {
    if (mutate) {
      this.x += dx;
      this.y += dy;
      return this;
    }
    return new Point(this.x + dx, this.y + dy);
  }

  /**
   * Translate/move point along a vector with an optional scale factor
   * @param {Vector} V
   * @param {Number} factor
   * @param {bool} mutate
   */
  translateByVector(V, factor = 1, mutate = false) {
    if (mutate) {
      this.x += V.x * factor;
      this.y += V.y * factor;
      return this;
    }
    return new Point(this.x + V.x * factor, this.y + V.y * factor);
  }

  /**
   * Represent point instance as a vector
   */
  asVector() {
    return new Vector(this.x, this.y);
  }

  /**
   * Rotate point around q by angle r
   * @param {Angle/Number} r
   * @param {Point} q
   * @param {bool} mutate
   */
  rotate(r, q = { x: 0, y: 0 }, mutate = false) {
    const v = new Vector(q, this);
    v.rotate(r, true);
    if (mutate) {
      this.x = v.x + q.x;
      this.y = v.y + q.y;
      return this;
    }
    return new Point(v.x + q.x, v.y + q.y);
  }
}

Point.ORIGO = new Point(0, 0);

export default Point;
