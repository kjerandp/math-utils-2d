import { isPointLike, isNumeric, approxZero } from '../common/utils';
import Angle from './angle';

class Vector {
  /**
   * Create an instance of the Vector class
   * @param {Point/Number} a point or dx
   * @param {Point/Number} b point or dy
   */
  constructor(a, b) {
    if (isPointLike(a) && isPointLike(b)) {
      this.x = b.x - a.x;
      this.y = b.y - a.y;
    } else if (isNumeric(a) && isNumeric(b)) {
      this.x = a;
      this.y = b;
    } else {
      throw new Error(`Vector constructor. Expected points or numeric values, but got '${a}' and '${b}'`);
    }
  }

  /**
   * Get unit vector from p2, centered between p1 and p3
   * @param {Point} p1
   * @param {Point} p2
   * @param {Point} p3
   */
  static centralTo(p1, p2, p3) {
    if (!isPointLike(p1) || !isPointLike(p2) || !isPointLike(p3)) {
      throw new Error('Invalid arguments!');
    }
    const u = new Vector(p2, p1).unit();
    const v = new Vector(p2, p3).unit();
    return u.add(v).unit();
  }

  /**
   * Create a unit vector with the given angle
   * @param {Angle/Number} angle
   */
  static fromAngle(angle) {
    const rad = angle.value !== undefined ? angle.value : angle;
    const x = Math.cos(rad);
    const y = Math.sin(rad);

    return new Vector(x, y);
  }

  /**
   * Get the angle between two vectors
   * @param {Vector} u
   * @param {Vector} v
   */
  static angle(u, v) {
    return new Angle(Math.atan2(u.cross(v), u.dot(v)));
  }

  get isNull() {
    return this.x === 0 && this.y === 0;
  }

  /**
   * Clone vector
   */
  clone() { return new Vector(this.x, this.y); }

  /**
   * Test if two vectors are equal
   * @param {Vector} v other vector
   */
  equals(v) {
    return approxZero(this.x - v.x) && approxZero(this.y - v.y);
  }

  /**
   * Get the magnitude/length of the vector
   */
  length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  /**
   * Create a copy of this vector with unit length
   */
  unit() {
    const l = this.length();

    return l === 0 ? new Vector(0, 0) : new Vector(this.x / l, this.y / l);
  }

  /**
   * Create a new vector perpendicular to this vector with unit length
   */
  normal() {
    const l = this.length();
    return l === 0 ? new Vector(0, 0) : new Vector(-(this.y / l), this.x / l);
  }

  /**
   * Get the vector's angle relative to the x axis
   */
  angle() {
    return new Angle(Math.atan2(this.y, this.x));
  }

  /**
   * Add two vectors and return a new vector (default) or mutate left hand vector
   * @param {Vector} V vector to be added
   * @param {bool} mutate
   */
  add(V, mutate = false) {
    if (mutate) {
      this.x += V.x;
      this.y += V.y;
      return this;
    }
    return new Vector(this.x + V.x, this.y + V.y);
  }

  /**
   * Subtract two vectors and return a new vector (default) or mutate left hand vector
   * @param {Vector} V vector to be subtracted
   * @param {bool} mutate
   */
  sub(V, mutate = false) {
    if (mutate) {
      this.x -= V.x;
      this.y -= V.y;
      return this;
    }
    return new Vector(this.x - V.x, this.y - V.y);
  }

  /**
   * Return a scaled vector (default) or mutate the existing vector
   * @param {Number} m scale factor
   * @param {bool} mutate
   */
  scale(m, mutate = false) {
    if (mutate) {
      this.x *= m;
      this.y *= m;
      return this;
    }
    return new Vector(this.x * m, this.y * m);
  }

  /**
   * Scale vector using seperate factors for x and y direction
   * @param {Number} mx scale factor in x direction
   * @param {Number} my scale factor in y direction
   * @param {bool} mutate
   */
  scaleXY(mx, my, mutate = false) {
    if (mutate) {
      this.x *= mx;
      this.y *= my;
      return this;
    }
    return new Vector(this.x * mx, this.y * my);
  }

  /**
   * Calculate the cross product scalar (signed area) between two vectors
   * @param {Vector} V
   */
  cross(V) {
    return (this.x * V.y) - (this.y * V.x);
  }

  /**
   * Calculate the dot product scalar between two vectors
   * @param {Vector} V
   */
  dot(V) {
    return (this.x * V.x) + (this.y * V.y);
  }

  /**
   * Get a vector that is a projection of the left hand vector onto the
   * right hand vector.
   * @param {Vector} V vector to project onto
   * @param {bool} limit limit the result to the magnitude of V (default true)
   */
  projectOnto(V, limit = true) {
    const vl = V.length();
    const proj = this.dot(V) / vl;
    if (limit && proj <= 0) return Vector.NULL;
    if (limit && proj > vl) return V.clone();

    return V.unit().scale(proj);
  }

  /**
   * Invert the vector by switching sign of both x and y components
   * @param {bool} mutate
   */
  invert(mutate = false) {
    if (mutate) {
      this.x = -this.x;
      this.y = -this.y;
      return this;
    }
    return new Vector(-this.x, -this.y);
  }

  /**
   * Get a new vector that is perpendicular to the vector, by
   * swapping x and y component and flipping the sign of the y
   * component.
   * @param {bool} mutate
   */
  orthogonal(mutate = false) {
    const _x = -this.y;
    const _y = this.x;
    if (mutate) {
      this.x = _x;
      this.y = _y;
      return this;
    }
    return new Vector(_x, _y);
  }

  /**
   * Rotate vector by an angle
   * @param {Angle/Number} r rotation angle
   * @param {bool} mutate
   */
  rotate(r, mutate = false) {
    r = r instanceof Angle ? r.value : r;
    // x' = x cos r - y sin r
    // y' = y cos r + x sin r
    const sr = Math.sin(r);
    const cr = Math.cos(r);

    const newX = this.x * cr - this.y * sr;
    const newY = this.y * cr + this.x * sr;

    if (mutate) {
      this.x = newX;
      this.y = newY;
      return this;
    }
    return new Vector(newX, newY);
  }
}

Vector.UVX = new Vector(1, 0);
Vector.UVY = new Vector(0, 1);
Vector.NULL = new Vector(0, 0);

export default Vector;
