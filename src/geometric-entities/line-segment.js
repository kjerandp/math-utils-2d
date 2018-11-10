import Vector from './vector';
import Point from './point';
import Line from './line';
import BoundingBox from '../intersection/bounding-box-tests';
import { isPointLike, approxZero } from '../common/utils';

export default class LineSegment {
  /**
   * Create a new instance of the LineSegment class
   * @param {Point} p1
   * @param {Point} p2
   */
  constructor(p1, p2) {
    if (!isPointLike(p1) || !isPointLike(p2)) throw new Error('Invalid points!');

    this.p1 = new Point(p1.x, p1.y);
    this.p2 = new Point(p2.x, p2.y);
  }

  /**
   * Test if point pt is on the line segment formed by p1 and p2
   * @param {Point} pt point to test
   * @param {Point} p1 start-point of line segment
   * @param {Point} p2 end-point of line segment
   */
  static pointOnLineSegment(pt, p1, p2) {
    if (p1.x === p2.x && p1.y === p2.y) return false;

    const v1 = new Vector(p1, p2);
    const v2 = new Vector(p1, pt);
    const cp = v1.cross(v2);

    if (!approxZero(cp)) return false;

    const s = v1.dot(v1);
    const p = v1.dot(v2);

    return p === 0 || p === s || (p > 0 && p < s);
  }

  get x1() { return this.p1.x; }
  get y1() { return this.p1.y; }
  get x2() { return this.p2.x; }
  get y2() { return this.p2.y; }

  /**
   * Calculate the length of the line segment
   */
  length() { return Point.getLength(this.p1, this.p2); }

  /**
   * Test if line segment is vertical
   */
  isVertical() { return this.x1 === this.x2; }

  /**
   * Test if line segment is horizontal
   */
  isHorizontal() { return this.y1 === this.y2; }

  /**
   * Get bounding box
   */
  boundingBox() {
    return BoundingBox.fromPoints([this.p1, this.p2]);
  }

  pointOnLineSegment(p) {
    return LineSegment.pointOnLineSegment(p, this.p1, this.p2);
  }

  /**
   * Get the center of this line segment
   */
  centeroid() {
    return new Point(
      (this.x1 + this.x2) / 2,
      (this.y1 + this.y2) / 2,
    );
  }

  /**
   * Get vector between the points forming the line segment
   */
  toVector() {
    return new Vector(Point.dx(this.p1, this.p2), Point.dy(this.p1, this.p2));
  }

  /**
   * Convert line segment to an infinite line
   */
  toLine() {
    if (Point.equals(this.p1, this.p2)) throw Error('Points are equal and cannot form a line!');
    return Line.fromPoints(this.p1, this.p2);
  }

  /**
  *  Clone line segment
  */
  clone() {
    return new LineSegment(this.p1, this.p2);
  }

  /**
   * Compare with other line segment. Orientation may be ignored by setting
   * ignoreOrientation to false.
   * @param {LineSegment} s
   * @param {bool} ignoreOrientation
   */
  equals(s, ignoreOrientation = false) {
    const isEqual = this.p1.equals(s.p1) && this.p2.equals(s.p2);
    if (isEqual) return true;

    if (ignoreOrientation) {
      return this.p1.equals(s.p2) && this.p2.equals(s.p1);
    }
    return false;
  }

  /**
   * Invert the line segment
   * @param {bool} mutate
   */
  invert(mutate = false) {
    const _p1 = this.p2;
    const _p2 = this.p1;

    if (mutate) {
      this.p1 = _p1;
      this.p2 = _p2;
      return this;
    }
    return new LineSegment(_p1, _p2);
  }

  /**
   * Normalizes the direction, so that the segment will point
   * from left to right, or from bottom to top if vertical
   * @param {bool} mutate
   */
  normalizeOrientation(mutate = false) {
    const A = this;
    if (A.x2 < A.x1 || (A.isVertical() && A.y1 > A.y2)) {
      return A.invert(mutate);
    }
    return this;
  }

  /**
   * Translate/move the line segment
   * @param {Number} dx
   * @param {Number} dy
   * @param {bool} mutate
   */
  translate(dx, dy, mutate = false) {
    if (mutate) {
      this.p1.translate(dx, dy, true);
      this.p2.translate(dx, dy, true);
      return this;
    }
    return new LineSegment(
      this.p1.translate(dx, dy),
      this.p2.translate(dx, dy),
    );
  }
}
