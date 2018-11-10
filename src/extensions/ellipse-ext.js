import {
  Ellipse,
  Vector,
  Point,
  Polygon,
} from '../geometric-entities';
import { testParametricForm as testLines } from '../intersection/line-tests';

Ellipse.prototype.inscribe = function inscribe(depth = 3) {
  const len = 2 ** depth;
  const verts = new Array(len * 4);
  const dcx = 2 * this.center.x;
  const dcy = 2 * this.center.y;

  let idx = 0;

  // recursive subdivide ellipse into sectors
  const subDivide = (r1, r2, target, level = 0) => {
    const u = new Vector(this.center, r1).add(new Vector(this.center, r2), true);
    const v = this.vectorAtAngle(u.angle());
    const np = this.center.translate(v.x, v.y);
    if (level < target) {
      subDivide(r1, np, target, level + 1);
      subDivide(np, r2, target, level + 1);
    } else {
      const i = idx++;
      verts[i] = np;
      verts[len + (len - 1 - i)] = new Point(dcx - np.x, np.y);
      verts[2 * len + i] = new Point(dcx - np.x, dcy - np.y);
      verts[3 * len + (len - 1 - i)] = new Point(np.x, dcy - np.y);
    }
  };

  const r1 = new Point(this.center.x - this.radiusX, this.center.y);
  const r2 = new Point(this.center.x, this.center.y - this.radiusY);

  subDivide(r1, r2, depth);

  return new Polygon(verts);
};

Ellipse.prototype.escribe = function escribe(depth = 3) {
  const len = 2 * 2 ** (depth - 1);
  const verts = new Array(len * 4);

  const a2 = this.radiusX ** 2;
  const b2 = this.radiusY ** 2;

  const dcx = 2 * this.center.x;
  const dcy = 2 * this.center.y;

  let idx = 0;

  // recursive subdivide ellipse into sectors and find tangent
  // intersection points
  const subDivide = (r1, r2, t1, t2, target, level = 0) => {
    const u = new Vector(this.center, r1).add(new Vector(this.center, r2), true);
    const v = this.vectorAtAngle(u.angle());
    const np = this.center.translate(v.x, v.y);
    const tv = new Vector(-v.y / b2, v.x / a2).unit(true);
    if (level < target) {
      subDivide(r1, np, t1, tv, target, level + 1);
      subDivide(np, r2, tv, t2, target, level + 1);
    } else {
      const ip1 = testLines(r1, t1, np, tv);
      const ip2 = testLines(np, tv, r2, t2);
      const idx1 = idx++;
      const idx2 = idx++;
      verts[idx1] = ip1;
      verts[idx2] = ip2;
      verts[len + (len - 1 - idx1)] = new Point(dcx - ip1.x, ip1.y);
      verts[len + (len - 1 - idx2)] = new Point(dcx - ip2.x, ip2.y);
      verts[2 * len + idx1] = new Point(dcx - ip1.x, dcy - ip1.y);
      verts[2 * len + idx2] = new Point(dcx - ip2.x, dcy - ip2.y);
      verts[3 * len + (len - 1 - idx1)] = new Point(ip1.x, dcy - ip1.y);
      verts[3 * len + (len - 1 - idx2)] = new Point(ip2.x, dcy - ip2.y);
    }
  };

  const r1 = new Point(this.center.x - this.radiusX, this.center.y);
  const r2 = new Point(this.center.x, this.center.y - this.radiusY);

  const t1 = new Vector(0, -1);
  const t2 = new Vector(1, 0);

  subDivide(r1, r2, t1, t2, depth - 1);

  return new Polygon(verts);
};
