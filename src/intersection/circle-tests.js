import Vector from '../geometric-entities/vector';
import Point from '../geometric-entities/point';
import LineSegment from '../geometric-entities/line-segment';
import Polynomials from '../math/polynomials';
import { approxZero } from '../common/utils';

export function fastTest(a, b) {
  const v = new Vector(a.center, b.center);
  return v.length() < a.radius + b.radius;
}

export function fastTestSegment(circle, segment) {
  const v = new Vector(segment.p1, segment.p2);
  const u = new Vector(segment.p1, circle.center);
  const s = u.projectOnto(v);
  const l = u.sub(s).length();
  return l < circle.radius;
}

export function fastTestLine(circle, line) {
  const bbox = circle.boundingBox();
  // convert line to segment
  const [p1, p2] = line.points(bbox.x1 - 1, bbox.x2 + 1);
  const seg = { p1, p2 };
  return fastTestSegment(circle, seg);
}

export function fastTestSegmentSet(circle, set) {
  for (let i = 0; i < set.length; i++) {
    const test = fastTestSegment(circle, set[i]);
    if (test) {
      return true;
    }
  }
  return false;
}


export function testLine(circle, line, skipBBoxTest = false) {
  if (!skipBBoxTest && !fastTestLine(circle, line)) {
    return false;
  }
  const r = circle.radius;
  const cx = circle.center.x;
  const cy = circle.center.y;
  const lm = line.m;
  const lb = line.b;

  const a = lm ** 2 + 1;
  const b = 2 * (lm * lb - lm * cy - cx);
  const c = cy ** 2 - r ** 2 + cx ** 2 - 2 * lb * cy + lb ** 2;

  const quad = Polynomials.quadratic(a, b, c);

  if (quad.discriminant >= 0) {
    const roots = quad.roots();
    if (approxZero(roots[0] - roots[1])) {
      return new Point(roots[0], line.y(roots[0]));
    }
    return new LineSegment(
      new Point(roots[0], line.y(roots[0])),
      new Point(roots[1], line.y(roots[1])),
    );
  }
  return false;
}

export function testSegment(circle, segment, skipBBoxTest = false) {
  if (
    !skipBBoxTest &&
    !circle.boundingBox().test(segment.boundingBox())
  ) {
    return false;
  }
  const s = segment.normalizeOrientation();
  const v = s.toVector();
  const u = new Vector(circle.center, s.p1);
  // coefficients
  const a = v.dot(v);
  const b = 2 * u.dot(v);
  const c = u.dot(u) - (circle.radius ** 2);

  const quad = Polynomials.quadratic(a, b, c);
  if (quad.discriminant >= 0) {
    const [t1, t2] = quad.roots();
    if ((t1 > 1 && t2 > 1) || (t1 < 0 && t2 < 0)) {
      return false;
    }
    // segment is completely inside
    if (t1 < 0 && t2 > 1) {
      return s;
    }
    // p2 of s is inside
    if (t2 > 1) {
      return new LineSegment(
        s.p1.translateByVector(v, t1),
        s.p2,
      );
    }
    // p1 of s is inside
    if (t1 < 0) {
      return new LineSegment(
        s.p1,
        s.p1.translateByVector(v, t2),
      );
    }
    // segment is a tangent to the circle if t2 - t1 ~ 0
    if (approxZero(t2 - t1)) {
      return s.p1.translateByVector(v, t1);
    }

    return new LineSegment(
      s.p1.translateByVector(v, t1),
      s.p1.translateByVector(v, t2),
    );
  }
  return false;
}
