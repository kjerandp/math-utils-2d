import { equallySigned } from '../common/utils';
import Vector from '../geometric-entities/vector';

export default class BoundingBox {
  constructor(minX = null, minY = null, maxX = null, maxY = null) {
    this.x1 = minX;
    this.y1 = minY;
    this.x2 = maxX;
    this.y2 = maxY;
  }

  static fromPoints(points) {
    return points.reduce((box, p) => {
      if (p.x < box.x1 || box.x1 === null) box.x1 = p.x;
      if (p.x > box.x2 || box.x2 === null) box.x2 = p.x;
      if (p.y < box.y1 || box.y1 === null) box.y1 = p.y;
      if (p.y > box.y2 || box.y2 === null) box.y2 = p.y;
      return box;
    }, new BoundingBox());
  }

  test(other) {
    const a = this;
    const b = other;
    return (
      a.x2 > b.x1 &&
      a.x1 < b.x2 &&
      a.y2 > b.y1 &&
      a.y1 < b.y2
    );
  }

  testPoint(point) {
    const p = point;
    const box = this;
    return (
      p.x >= box.x1 &&
      p.x <= box.x2 &&
      p.y >= box.y1 &&
      p.y <= box.y2
    );
  }

  testLine(line) {
    const box = this;
    const testY = y => y >= box.y1 && y <= box.y2;
    const testX = x => x >= box.x1 && x <= box.x2;

    // slope is 0, test y intersect of line
    if (line.m === 0) return testY(line.b);

    if (testY(line.y(box.x1)) || testY(line.y(box.x2))) return true;
    if (testX(line.x(box.y1)) || testX(line.x(box.y2))) return true;

    return false;
  }

  testSegment(segment) {
    const box = this;
    if (!box.test(segment.boundingBox())) return false;

    const bl = { x: box.x1, y: box.y2 };
    const br = { x: box.x2, y: box.y2 };
    const tr = { x: box.x2, y: box.y1 };
    const tl = { x: box.x1, y: box.y1 };

    const { p1, p2 } = segment;

    const testPointRelationToLine = (p, q, r) =>
      new Vector(q, r).cross(new Vector(q, p));

    const tests = [
      () => testPointRelationToLine(bl, p1, p2),
      () => testPointRelationToLine(br, p1, p2),
      () => testPointRelationToLine(tr, p1, p2),
      () => testPointRelationToLine(tl, p1, p2),
    ];
    if (equallySigned(tests)) return false;

    return true;
  }
}
