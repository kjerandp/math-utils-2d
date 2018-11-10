import Vector from './vector';
import Point from './point';
import Angle from './angle';
import BoundingBox from '../intersection/bounding-box-tests';

export default class Ellipse {
  constructor(center, radiusX, radiusY) {
    this.center = new Point(center.x, center.y);
    this.radiusX = radiusX;
    this.radiusY = radiusY;
  }

  get majorSemiAxis() { return Math.max(this.radiusX, this.radiusY); }

  get minorSemiAxis() { return Math.min(this.radiusX, this.radiusY); }

  /**
   * Test if a point is inside the ellipse
   * @param {Point} point
   */
  isInternal(point) {
    const dx = point.x - this.center.x;
    const dy = point.y - this.center.y;

    return (dx ** 2 / this.radiusX ** 2) + (dy ** 2 / this.radiusY ** 2) < 1;
  }

  /**
   * Get the centeroid
   */
  centeroid() { return this.center; }

  /**
   * Calculate the area of the ellipse
   */
  area() {
    return this.radiusX * this.radiusY * Angle.PI;
  }

  /**
   * Calculate the perimeter of the ellipse
   */
  perimeter() {
    return Angle.TAU * Math.sqrt((this.radiusX ** 2 + this.radiusY ** 2) / 2);
  }

  /**
   * Get rectangular bounding box of ellipse
   */
  boundingBox() {
    return new BoundingBox(
      this.center.x - this.radiusX,
      this.center.y - this.radiusY,
      this.center.x + this.radiusX,
      this.center.y + this.radiusY,
    );
  }

  /**
   * vector with direction according to angle and magnitude, equal to the
   * length from the ellipse center to its circumference
   * @param {Angle/Number} angle
   */
  vectorAtAngle(angle) {
    const theta = (angle instanceof Angle ? angle : new Angle(angle)).normalize();
    const sign = theta.value > Angle.SPI || theta.value < -Angle.SPI ? -1 : 1;
    const t = Math.atan(this.radiusX * theta.tan() / this.radiusY);

    return new Vector(
      this.radiusX * Math.cos(t) * sign,
      this.radiusY * Math.sin(t) * sign,
    );
  }

  /**
   * Return the point on the ellipse's circumrerence corresponding
   * to an angle.
   * @param {Angle/Number} angle
   */
  pointAtAngle(angle) {
    const v = this.vectorAtAngle(angle);

    return new Point(
      this.center.x + v.x,
      this.center.y + v.y,
    );
  }

  /**
   * Get the tangent vector corresponding to a given angle
   * @param {Angle/Number} angle
   */
  tangentAtAngle(angle) {
    const aa = this.radiusX ** 2;
    const bb = this.radiusY ** 2;
    const v = this.vectorAtAngle(angle);
    return new Vector(-v.y / bb, v.x / aa).unit();
  }

  /**
   * Get the normal vector corresponding to a given angle
   * @param {Angle/Number} angle
   */
  normalAtAngle(angle) {
    const aa = this.radiusX ** 2;
    const bb = this.radiusY ** 2;
    const v = this.vectorAtAngle(angle);
    return new Vector(v.x / aa, v.y / bb).unit();
  }

  /**
   * Scale the ellipse by a factor
   * @param {Number} factor
   * @param {bool} mutate
   */
  scale(factor, mutate = false) {
    const rx = this.radiusX * factor;
    const ry = this.radiusY * factor;

    if (mutate) {
      this.radiusX = rx;
      this.radiusY = ry;

      return this;
    }

    return new Ellipse(this.center, rx, ry);
  }
}
