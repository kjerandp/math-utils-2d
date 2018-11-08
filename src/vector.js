import Util from './utils';
import Angle from './angle';

class Vector {
  constructor(a, b) {
    if (Util.isPointLike(a) && Util.isPointLike(b)) {
      this.x = b.x - a.x;
      this.y = b.y - a.y;
    } else if (Util.isNumeric(a) && Util.isNumeric(b)) {
      this.x = a;
      this.y = b;
    } else {
      throw new Error(`Vector constructor. Expected points or numeric values, but got '${a}' and '${b}'`);
    }
  }

  // Get unit vector from p2, centered between p1 and p3
  static centralTo(p1, p2, p3) {
    if (!Util.isPointLike(p1) || !Util.isPointLike(p2) || !Util.isPointLike(p3)) {
      throw new Error('Invalid arguments!');
    }
    const u = new Vector(p2, p1).unit();
    const v = new Vector(p2, p3).unit();
    return u.add(v).unit();
  }

  static fromAngle(angle) {
    const rad = angle.value !== undefined ? angle.value : angle;
    const x = Math.cos(rad);
    const y = Math.sin(rad);

    return new Vector(x, y);
  }

  static angle(u, v) {
    return new Angle(Math.atan2(u.cross(v), u.dot(v)));
  }

  get isNull() {
    return this.x === 0 && this.y === 0;
  }

  clone() { return new Vector(this.x, this.y); }

  equals(v) {
    return Util.approxZero(this.x - v.x) && Util.approxZero(this.y - v.y);
  }

  length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  unit() {
    const l = this.length();

    return l === 0 ? new Vector(0, 0) : new Vector(this.x / l, this.y / l);
  }

  normal() {
    const l = this.length();
    return l === 0 ? new Vector(0, 0) : new Vector(-(this.y / l), this.x / l);
  }

  angle() {
    return new Angle(Math.atan2(this.y, this.x));
  }

  add(V, mutate = false) {
    if (mutate) {
      this.x += V.x;
      this.y += V.y;
      return this;
    }
    return new Vector(this.x + V.x, this.y + V.y);
  }

  sub(V, mutate = false) {
    if (mutate) {
      this.x -= V.x;
      this.y -= V.y;
      return this;
    }
    return new Vector(this.x - V.x, this.y - V.y);
  }

  scale(m, mutate = false) {
    if (mutate) {
      this.x *= m;
      this.y *= m;
      return this;
    }
    return new Vector(this.x * m, this.y * m);
  }

  scaleXY(mx, my, mutate = false) {
    if (mutate) {
      this.x *= mx;
      this.y *= my;
      return this;
    }
    return new Vector(this.x * mx, this.y * my);
  }

  cross(V) {
    return (this.x * V.y) - (this.y * V.x);
  }

  dot(V) {
    return (this.x * V.x) + (this.y * V.y);
  }

  projectOnto(V, limit = true) {
    const vl = V.length();
    const proj = this.dot(V) / vl;
    if (limit && proj <= 0) return Vector.NULL;
    if (limit && proj > vl) return V.clone();

    return V.unit().scale(proj);
  }

  rejectionFrom(V, limit = true) {
    const vl = V.length();
    const proj = this.dot(V) / vl;
    if (limit && proj >= 0) return Vector.NULL;
    if (limit && proj > vl) return V.invert();

    return V.unit().scale(proj);
  }

  invert(mutate = false) {
    if (mutate) {
      this.x = -this.x;
      this.y = -this.y;
      return this;
    }
    return new Vector(-this.x, -this.y);
  }

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
