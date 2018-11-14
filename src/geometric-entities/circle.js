import Ellipse from './ellipse';
import Vector from './vector';
import Point from './point';
import Angle from './angle';
import LineSegment from './line-segment';

export default class Circle extends Ellipse {
  /**
   * Create new instance of the Circle class
   * @param {Point} center
   * @param {Number} radius
   */
  constructor(center, radius) {
    super(center, radius, radius);
  }

  get radius() { return this.radiusX; }

  get diameter() { return 2 * this.radius; }

  /**
   * Check if a point is inside of the circle
   * @param {Point} point
   */
  isInternal(point) {
    const v = new Vector(this.center, point);
    return v.length() < this.radius;
  }

  /**
   * Calculater the perimeter of the circle
   */
  perimeter() {
    return Angle.TAU * this.radius;
  }

  /**
   * Get point in circle at the given angle
   * @param {Angle/Number} angle
   */
  pointAtAngle(angle) {
    const theta = angle instanceof Angle ? angle.value : angle;

    return new Point(
      this.center.x + this.radius * Math.cos(theta),
      this.center.y + this.radius * Math.sin(theta),
    );
  }

  /**
   * Get the points on the circle where the tangent lines,
   * determined by the given point, intersects the circle.
   * @param {Point} point
   */
  tangentsFromPoint(point) {
    const vc = new Vector(point, this.center);
    const l = vc.length();
    if (l < this.radius) return null;
    if (l === this.radius) return [point];

    const a = Math.asin(this.radius / l);
    const b = Math.atan2(vc.y, vc.x);

    let t = b - a;

    const t1 = new Point(
      this.center.x + this.radius * Math.sin(t),
      this.center.y + this.radius * -Math.cos(t),
    );

    t = b + a;
    const t2 = new Point(
      this.center.x + this.radius * -Math.sin(t),
      this.center.y + this.radius * Math.cos(t),
    );

    return [t1, t2];
  }

  /**
   * Get the points on both circles where the exterior tangents
   * formed between them intersects
   * @param {Circle} circle
   */
  exteriorTangents(circle) {
    const c1 = circle.radius > this.radius ? circle : this;
    const c2 = circle.radius > this.radius ? this : circle;
    const ri = c1.radius - c2.radius;

    if (ri === 0) {
      const v = new Vector(c1.center, c2.center);
      if (v.length() === 0) return null;
      const n = v.normal(true);

      return [
        new LineSegment(
          c1.center.translateByVector(n, c1.radius),
          c2.center.translateByVector(n, c2.radius),
        ),
        new LineSegment(
          c1.center.translateByVector(n, -c1.radius),
          c2.center.translateByVector(n, -c2.radius),
        ),
      ];
    }

    const c3 = new Circle(c1.center, ri);
    const ti = c3.tangentsFromPoint(c2.center);

    const tan = [];
    if (ti) {
      ti.forEach((t) => {
        const v = new Vector(c1.center, t).unit(true);
        const p1 = t.translateByVector(v, c2.radius);
        const p2 = c2.center.translateByVector(v, c2.radius);
        tan.push(new LineSegment(p1, p2));
      });
    }

    return tan.length > 0 ? tan : null;
  }

  /**
   * Get the points on both circles where the interior tangents
   * formed between them intersects
   * @param {Circle} circle
   */
  interiorTangents(circle) {
    const c1 = circle.radius > this.radius ? circle : this;
    const c2 = circle.radius > this.radius ? this : circle;
    const ri = c1.radius + c2.radius;
    const c3 = new Circle(c1.center, ri);
    const ti = c3.tangentsFromPoint(c2.center);

    const tan = [];
    if (ti) {
      ti.forEach((t) => {
        const v = new Vector(c1.center, t).unit(true);
        const p1 = t.translateByVector(v, -c2.radius);
        const p2 = c2.center.translateByVector(v, -c2.radius);
        tan.push(new LineSegment(p1, p2));
      });
    }

    return tan.length > 0 ? tan : null;
  }

  /**
   * Scale the circle by a factor
   * @param {Number} factor
   * @param {bool} mutate
   */
  scale(factor, mutate = false) {
    const r = this.radius * factor;

    if (mutate) {
      this.radius = r;
      return this;
    }

    return new Circle(this.center, r);
  }
}
