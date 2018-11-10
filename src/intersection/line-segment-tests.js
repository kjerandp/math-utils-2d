import Vector from '../geometric-entities/vector';
import Point from '../geometric-entities/point';
import LineSegment from '../geometric-entities/line-segment';
import * as lineTests from './line-tests';

function testSegmentOrientation(p1, q1, p2, q2) {
  return (
    Point.orientation(p1, q1, p2) !== Point.orientation(p1, q1, q2) &&
    Point.orientation(q2, p2, q1) !== Point.orientation(q2, p2, p1)
  );
}

export function fastTest(segA, segB) {
  return testSegmentOrientation(segA.p1, segA.p2, segB.p1, segB.p2);
}

export function fastTestSets(setA, setB) {
  for (let i = 0; i < setA.length; i++) {
    for (let j = 0; j < setB.length; j++) {
      const test = fastTest(setA[i], setB[j]);
      if (test) {
        return true;
      }
    }
  }
  return false;
}

// Two line segments
export function test(s1, s2) {
  if (!s1.boundingBox().test(s2.boundingBox())) {
    return false;
  }

  const p = s1.p1;
  const q = s2.p1;
  const r = s1.toVector();
  const s = s2.toVector();
  const pq = new Vector(p, q); // q - p

  const r_x_s = r.cross(s);
  const pq_x_r = pq.cross(r);


  if (r_x_s === 0) {
    if (pq_x_r !== 0) return false; // parallell and not overlapping
    if (pq_x_r === 0) { // segments are collinear, check for overlap
      // t0 = (q − p) · r / (r · r)
      // t1 = (q + s − p) · r / (r · r) = t0 + s · r / (r · r)
      const rr = r.dot(r);
      const sr = s.dot(r);
      let t0 = pq.dot(r) / rr;
      let t1 = t0 + sr / rr;

      if (sr < 0) {
        const tmp = t1;
        t1 = t0;
        t0 = tmp;
      }
      if (t1 >= 0 && t0 <= 1) {
        t0 = Math.max(0, t0);
        t1 = Math.min(1, t1);
        return new LineSegment(
          new Point(p.x + t0 * r.x, p.y + t0 * r.y),
          new Point(p.x + t1 * r.x, p.y + t1 * r.y),
        );
      }
      return false;
    }
  }
  // t = (q − p) × s / (r × s)
  // u = (q − p) × r / (r × s)
  const pq_x_s = pq.cross(s);

  const t = pq_x_s / r_x_s;
  const u = pq_x_r / r_x_s;

  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return new Point(p.x + t * r.x, p.y + t * r.y);
  }
  return false;
}

// test two sets of segments
export function testSets(setA, setB) {
  const ips = [];
  for (let i = 0; i < setA.length; i++) {
    for (let j = 0; j < setB.length; j++) {
      if (setA[i].boundingBox().test(setB[j].boundingBox())) {
        const ip = test(setA[i], setB[j]);
        if (ip && ip instanceof Point) {
          ips.push(ip);
        }
      }
    }
  }
  return ips;
}

export function testLine(seg, line) {
  if (seg.isVertical()) {
    const y = line.y(seg.x1);
    if (y <= Math.max(seg.y1, seg.y2) && y >= Math.min(seg.y1, seg.y2)) {
      return new Point(seg.x1, y);
    }
  } else {
    const l = seg.toLine();
    const ip = lineTests.test(l, line);
    if (ip instanceof Point) {
      if (seg.pointOnLineSegment(ip)) {
        return ip;
      }
    } else if (ip instanceof Line) {
      return seg;
    }
  }
  return false;
}
