import {
  Circle,
  Angle,
  Polygon,
  Vector,
} from '../geometric-entities';
import { testParametricForm as testLines } from '../intersection/line-tests';

Circle.prototype.inscribe = function inscribe(depth = 3) {
  const verts = [];

  const step = Angle.QPI / depth;

  let angle = 0;
  while (angle < Angle.TAU) {
    verts.push(this.pointAtAngle(angle));
    angle += step;
  }

  return new Polygon(verts);
};

Circle.prototype.escribe = function escribe(depth = 3) {
  const verts = [];

  const step = Angle.QPI / depth;

  let angle = step;
  let pp = this.center.translate(this.radius, 0);
  let pt = new Vector(0, 1);
  while (angle < Angle.TAU + step) {
    const cp = this.pointAtAngle(angle);
    const t = new Vector(this.center, cp).orthogonal(true);

    const ip = testLines(pp, pt, cp, t);
    verts.push(ip);
    pp = cp;
    pt = t;
    angle += step;
  }

  return new Polygon(verts);
};

