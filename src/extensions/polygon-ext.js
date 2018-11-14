import {
  Polygon,
  Point,
  Angle,
  Vector,
  Line,
} from '../geometric-entities';
import Types from '../common/types';
import { test as testLines } from '../intersection/line-tests';

Polygon.rectangle = (x = -1, y = 1, width = 2, height = 2) => {
  const verts = [
    new Point(x, y),
    new Point(x, y - height),
    new Point(x + width, y - height),
    new Point(x + width, y),
  ];

  return new Polygon(verts);
};

Polygon.equilateral = (edges = 3, radius = 1, center = Point.ORIGO, startAngle) => {
  const verts = [];
  const step = Angle.TAU / edges;
  const start = startAngle || Angle.SPI;
  const end = Angle.TAU + start;

  for (let x = start; x < end; x += step) {
    const angle = x;

    verts.push(new Point(
      center.x + (radius * Math.cos(angle)),
      center.y + (radius * Math.sin(angle)),
    ));
  }
  return new Polygon(verts);
};

Polygon.outlinePolyLine = (
  points,
  thickness = 1,
  cap = Types.CAP_PROJECTED,
  join = Types.JOIN_BEVEL,
) => {
  const halfWidth = thickness / 2;
  const lverts = [];
  const rverts = [];

  let prev = null;
  points.forEach((pt, i) => {
    const np = i < points.length - 1 ? points[i + 1] : null;

    if (np) {
      const v = new Vector(pt, np);
      const n = v.normal();

      const p1 = pt.translateByVector(n, halfWidth);
      const p2 = pt.translateByVector(n, -halfWidth);
      const l1 = new Line(v, p1);
      const l2 = new Line(v, p2);

      if (prev) {
        const p3 = testLines(prev.l1, l1);
        const p4 = testLines(prev.l2, l2);

        if (join === Types.JOIN_BEVEL) {
          const a = Vector.angle(v.invert(), prev.v);
          if (a.value < 0) {
            lverts.push(pt.translateByVector(prev.n, halfWidth), p1);
            rverts.push(p4);
          } else {
            lverts.push(p3);
            rverts.push(pt.translateByVector(prev.n, -halfWidth), p2);
          }
        } else {
          lverts.push(p3);
          rverts.push(p4);
        }
      } else if (cap === Types.CAP_PROJECTED) {
        const vu = v.unit();
        lverts.push(p1.translateByVector(vu, -halfWidth));
        rverts.push(p2.translateByVector(vu, -halfWidth));
      } else {
        lverts.push(p1);
        rverts.push(p2);
      }
      prev = { n, v, l1, l2 };
    } else {
      const { n, v } = prev;
      const p1 = pt.translateByVector(n, halfWidth);
      const p2 = pt.translateByVector(n, -halfWidth);

      if (cap === Types.CAP_PROJECTED) {
        const vu = v.unit();
        lverts.push(p1.translateByVector(vu, halfWidth));
        rverts.push(p2.translateByVector(vu, halfWidth));
      } else {
        lverts.push(p1);
        rverts.push(p2);
      }
    }
  });

  return new Polygon(lverts.concat(rverts.reverse()));
};
