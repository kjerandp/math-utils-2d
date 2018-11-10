import Line from './line';
import Vector from './vector';
import Point from './point';

export default class Ray extends Line {
  /**
   * Test if a point is behind the origin of the ray
   * @param {Point} p
   */
  isBehind(p) {
    const u = new Vector(this.origin, p);
    return this.vector.dot(u) < 0;
  }

  get origin() {
    return this.point;
  }

  set origin(p) {
    this.point = p;
  }

  /**
   * Get a value of the proximity (0 - 1) indicating how close the point
   * is in relation to the ray
   * @param {Point} p
   */
  proximityToPoint(p) {
    const u = new Vector(this.origin, p);
    return this.vector.dot(u) / u.length();
  }

  /**
   * Get the the corresponding x value for the given y value along the ray.
   * Returns null if point is behind the ray's origin or a range from the
   * origin to infinity if the ray is horizontal and is situated at the given y.
   * @param {Number} y
   */
  x(y) {
    if (this.vector.y === 0) {
      if (y === this.origin.y) {
        return [this.origin.x, this.vector.x < 0 ? -Infinity : +Infinity];
      }
      return undefined;
    }
    const t = this.ty(y);
    if (t === undefined) return undefined;
    const x = this.point.x + t * this.vector.x;
    return this.isBehind(new Point(x, y)) ? null : x;
  }

  /**
   * Get the the corresponding y value for the given x value along the ray.
   * Returns null if point is behind the ray's origin or a range from the
   * origin to infinity if the ray is vertical and is situated at the given x.
   * @param {Number} x
   */
  y(x) {
    if (this.vector.x === 0) {
      if (x === this.origin.x) {
        return [this.origin.y, this.vector.y < 0 ? -Infinity : +Infinity];
      }
      return undefined;
    }
    const t = this.tx(x);
    if (t === undefined) return undefined;
    const y = this.point.y + t * this.vector.y;
    return this.isBehind(new Point(x, y)) ? null : y;
  }
}
