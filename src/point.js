import Util from './utils';
import Vector from './vector';
import Angle from './angle';
import Types from './types';

class Point {
  constructor(x, y) {
    if (!Util.isNumeric(x) || !Util.isNumeric(y)) {
      throw new Error(`Point: Expected arguments x and y to be numbers, but got ${x} and ${y}`);
    }
    this.x = x;
    this.y = y;
  }

  // The distance between two points
  static distance(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx ** 2 + dy ** 2);
  }

  // Find the orientation of three points
  static orientation(p, q, r) {
    const val = (q.y - p.y) * (r.x - q.x) -
              (q.x - p.x) * (r.y - q.y);

    if (val === 0) return Types.COLLINEAR;

    return (val > 0) ? Types.CLOCKWISE : Types.COUNTERCLOCKWISE;
  }

  /*
    p1, p2 and p3:  Angle formed between p1 and p3 at p2
    p1 and p2:      Angle formed between the line p1p2 and the x axis
    p1:             Angle between p1 and the origin
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

  static fromPolarCoords(r, angle) {
    const a = angle instanceof Angle ? angle.value : angle;

    return new Point(
      r * Math.cos(a),
      r * Math.sin(a),
    );
  }

  static fromArray(arr) {
    return new Point(arr[0], arr[1]);
  }

  static equals(p1, p2) {
    return Util.approxZero(p1.x - p2.x) &&
      Util.approxZero(p1.y - p2.y);
  }

  static dx(p1, p2) { return p2.x - p1.x; }

  static dy(p1, p2) { return p2.y - p1.y; }

  static slope(p1, p2) {
    const dx = Point.dx(p1, p2);
    if (dx === 0) return undefined;
    return Point.dy(p1, p2) / Point.dx(p1, p2);
  }

  static average(points) {
    const sum = points.reduce((s, p) => ({
      x: s.x + p.x,
      y: s.y + p.y,
    }), { x: 0, y: 0 });

    return new Point(sum.x / points.length, sum.y / points.length);
  }

  // order a set of points counter clockwise
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

  equals(p) {
    return Point.equals(this, p);
  }

  toPolarCoords() {
    return ({
      r: Math.sqrt(this.x ** 2 + this.y ** 2),
      a: Point.angle(this),
    });
  }

  toArray() {
    return [this.x, this.y];
  }

  clone() {
    return new Point(this.x, this.y);
  }

  translate(dx, dy, mutate = false) {
    if (mutate) {
      this.x += dx;
      this.y += dy;
      return this;
    }
    return new Point(this.x + dx, this.y + dy);
  }

  translateByVector(V, factor = 1, mutate = false) {
    if (mutate) {
      this.x += V.x * factor;
      this.y += V.y * factor;
      return this;
    }
    return new Point(this.x + V.x * factor, this.y + V.y * factor);
  }

  asVector() {
    return new Vector(this.x, this.y);
  }

  // rotate point around q
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
