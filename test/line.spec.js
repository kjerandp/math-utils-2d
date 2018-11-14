import { expect } from 'chai';
import {
  Line,
  Point,
} from '../src/geometric-entities';

describe('line class tests', () => {
  it('should know if a point is on the line', () => {
    const p1 = new Point(1, 1);
    const p2 = new Point(4, -3);
    const l = Line.fromPoints(p1, p2);
    expect(l.pointOnLine(p1)).eq(true);
    expect(l.pointOnLine(p2)).eq(true);
    expect(l.pointOnLine({ x: 0, y: 0 })).eq(false);
    expect(l.pointOnLine({ x: 2.5, y: -1 })).eq(true);
  });
});
