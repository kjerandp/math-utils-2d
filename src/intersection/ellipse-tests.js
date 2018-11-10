import Line from '../geometric-entities/line';
import Point from '../geometric-entities/point';
import * as circleTests from './circle-tests';
import * as polygonTests from './polygon-tests';

export function fastTest(a, b, depth = 3) {
  if (a.boundingBox().test(b.boundingBox())) {
    const pa = a.inscribe(depth);
    const pb = b.inscribe(depth);
    return polygonTests.fastTest(pa, pb, true);
  }
  return false;
}

export function fastTestSegment(ellipse, segment) {
  const scaleX = ellipse.radiusY / ellipse.radiusX;
  const tls = {
    p1: { x: segment.p1.x * scaleX, y: segment.p1.y },
    p2: { x: segment.p2.x * scaleX, y: segment.p2.y },
  };

  const circle = {
    center: { x: ellipse.center.x * scaleX, y: ellipse.center.y },
    radius: ellipse.radiusY,
  };

  return circleTests.fastTestSegment(circle, tls);
}

export function fastTestLine(ellipse, line) {
  const bbox = ellipse.boundingBox();
  // convert line to segment
  const [p1, p2] = line.points(bbox.x1 - 1, bbox.x2 + 1);
  const seg = { p1, p2 };

  return fastTestSegment(ellipse, seg);
}


// alternative 1: use ellipse and line formula
export function testLine(ellipse, line, skipBBoxTest = false) {
  if (!skipBBoxTest && !ellipse.boundingBox().testLine(line)) {
    return false;
  }

  const aa = ellipse.radiusX ** 2;
  const bb = ellipse.radiusY ** 2;
  const cx = ellipse.center.x;
  const cy = ellipse.center.y;
  const cxx = cx ** 2;
  const cyy = cy ** 2;
  const lm = line.m;
  const lb = line.b;
  const lmm = lm ** 2;
  const lbb = lb ** 2;

  const a = bb + aa * lmm;
  const b = (-2 * bb * cx) + (2 * aa * lm * lb) + (-2 * aa * lm * cy);
  const c = (bb * cxx) + (aa * cyy) - (aa * bb) + (aa * lbb) + (-2 * aa * lb * cy);

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

// alternative 2: scale ellipse to a circle and use circle and line intersection
export function testByTransform(ellipse, line, skipBBoxTest = false) {
  if (!skipBBoxTest && !ellipse.boundingBox().testLine(line)) {
    return false;
  }

  const scaleX = ellipse.radiusY / ellipse.radiusX;
  const [p1, p2] = line.points(0, 1).map(p => new Point(p.x * scaleX, p.y));
  const tl = Line.fromPoints(p1, p2);

  const circle = {
    center: new Point(ellipse.center.x * scaleX, ellipse.center.y),
    radius: ellipse.radiusY,
  };

  const il = circleTests.testLine(circle, tl, true);

  if (il) {
    if (il instanceof Point) {
      return new Point(il.x / scaleX, il.y);
    }
    return new LineSegment(
      new Point(il.x1 / scaleX, il.y1),
      new Point(il.x2 / scaleX, il.y2),
    );
  }

  return false;
}

export function testSegment(ellipse, segment, skipBBoxTest = false) {
  if (
    !skipBBoxTest &&
    !ellipse.boundingBox().test(segment.boundingBox())
  ) {
    return false;
  }

  const scaleX = ellipse.radiusY / ellipse.radiusX;
  const tls = new LineSegment(
    new Point(segment.x1 * scaleX, segment.y1),
    new Point(segment.x2 * scaleX, segment.y2),
  );

  const circle = {
    center: new Point(ellipse.center.x * scaleX, ellipse.center.y),
    radius: ellipse.radiusY,
  };

  const il = circleTests.testSegment(circle, tls, true);

  if (il) {
    if (il instanceof Point) {
      return new Point(il.x / scaleX, il.y);
    }
    return new LineSegment(
      new Point(il.x1 / scaleX, il.y1),
      new Point(il.x2 / scaleX, il.y2),
    );
  }
  return false;
}
