import { expect } from 'chai';
import {
  LineSegment,
  Point,
} from '../src/geometric-entities';

describe('line class tests', () => {
  it('should know if a point is on the line', () => {
    const p1 = new Point(1, 1);
    const p2 = new Point(4, -3);
    const ls = new LineSegment(p1, p2);
    const v = ls.toVector();
    const p3 = p1.translateByVector(v, 0.5);
    const p4 = p1.translateByVector(v, 1.01);
    const p5 = p2.translateByVector(v, -1.01);
    expect(ls.pointOnLineSegment(p1)).eq(true);
    expect(ls.pointOnLineSegment(p2)).eq(true);
    expect(ls.pointOnLineSegment(p3)).eq(true);
    expect(ls.pointOnLineSegment(p4)).eq(false);
    expect(ls.pointOnLineSegment(p5)).eq(false);
    expect(ls.pointOnLineSegment({ x: 0, y: 0 })).eq(false);
    expect(ls.pointOnLineSegment({ x: 2.5, y: -1 })).eq(true);
  });
});
