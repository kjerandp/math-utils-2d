import { expect } from 'chai';
import Point from '../src/geometric-entities/point';
import Types from '../src/common/types';
import Angle from '../src/geometric-entities/angle';

describe('Point class - static methods', () => {
  it('should be able to measure distance between two points', () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(2, 0);
    expect(Point.distance(p1, p2)).eq(2);
    p2.x = -2;
    expect(Point.distance(p1, p2)).eq(2);
    p1.y = 2;
    expect(Point.distance(p1, p2)).closeTo(2.828, 0.001);
  });

  it('should be able to determine the orientation of three points', () => {
    const p1 = new Point(0, 2);
    const p2 = new Point(2, 0);
    const p3 = new Point(0, -2);
    expect(Point.orientation(p1, p2, p3)).eq(Types.CLOCKWISE);
    p2.moveTo(-2, 0);
    expect(Point.orientation(p1, p2, p3)).eq(Types.COUNTERCLOCKWISE);
    p1.moveTo(0, 0);
    p2.moveTo(2, 0);
    p3.moveTo(4, 0);
    expect(Point.orientation(p1, p2, p3)).eq(Types.COLLINEAR);
  });

  it('should be able to determine the angle of a single point', () => {
    const p = new Point(0, 0);
    expect(Point.angle(p).value).eq(0);
    p.moveTo(2, 2);
    expect(Point.angle(p).degrees).eq(45);
    p.moveTo(0, 2);
    expect(Point.angle(p).degrees).eq(90);
    p.moveTo(0, -2);
    expect(Point.angle(p).degrees).eq(-90);
    p.moveTo(-2, 0);
    expect(Point.angle(p).degrees).eq(180);
    p.moveTo(-2, -0.1);
    expect(Point.angle(p).degrees).lessThan(180);
    p.moveTo(-2, +0.1);
    expect(Point.angle(p).degrees).lessThan(180);
  });

  it('should be able to determine the angle between two points', () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(0, 0);
    expect(Point.angle(p1, p2).value).eq(0);
    p1.moveTo(-2, 0);
    p2.moveTo(2, 0);
    expect(Point.angle(p1, p2).value).eq(0);
    p1.moveTo(-2, -2);
    p2.moveTo(2, 2);
    expect(Point.angle(p1, p2).degrees).eq(45);
    p1.moveTo(2, 0);
    p2.moveTo(2, 2);
    expect(Point.angle(p1, p2).degrees).eq(90);
    p1.moveTo(2, 0);
    p2.moveTo(2, -2);
    expect(Point.angle(p1, p2).degrees).eq(-90);
  });

  it('should be able to determine the angle between three points', () => {
    const p1 = new Point(2, 0);
    const p2 = new Point(0, 0);
    const p3 = new Point(2, 0);
    expect(Point.angle(p1, p2, p3).value).eq(0);
    p1.moveTo(2, 2);
    p3.moveTo(2, -2);
    expect(Point.angle(p1, p2, p3).degrees).eq(90);
    p1.moveTo(2, -2);
    p3.moveTo(2, 2);
    expect(Point.angle(p1, p2, p3).degrees).eq(-90);
    p1.moveTo(2, 1);
    p3.moveTo(3, -1);
    expect(Point.angle(p1, p2, p3).degrees).eq(45);
  });

  it('should be able to create cartesian point from polar coordinates', () => {
    expect(Point.fromPolarCoords(1, 0)).to.deep.equal(new Point(1, 0));
    const r = 5;
    const t = Math.PI / 3;
    const x = r * Math.cos(t);
    const y = r * Math.sin(t);
    expect(Point.fromPolarCoords(5, Angle.fromDegrees(60))).to.deep.equal(new Point(x, y));
  });

  it('should be able to create a new point instance from an array', () => {
    const arr = [2, 4];
    const p = Point.fromArray(arr);
    expect(p).to.deep.equal(new Point(2, 4));
    expect(p.x).to.equal(arr[0]);
    expect(p.y).to.equal(arr[1]);
    expect(p.toArray()).to.deep.equal(arr);
  });

  it('should be able to compare two points', () => {
    const p1 = new Point(2, 7);
    const p2 = new Point(3, 4);
    expect(Point.equals(p1, p2)).to.eq(false);
    p1.x = 3;
    expect(Point.equals(p1, p2)).to.eq(false);
    p1.y = 4;
    expect(Point.equals(p1, p2)).to.eq(true);
  });

  it('should be able to find dx, dy and slope between two points', () => {
    const p1 = new Point(2, 7);
    const p2 = new Point(3, 4);
    expect(Point.dx(p1, p2)).to.equal(1);
    expect(Point.dy(p1, p2)).to.equal(-3);
    expect(Point.dx({ x: 2, y: 7 }, p2)).to.equal(1);
    expect(Point.dy(p1, { x: 3, y: 4 })).to.equal(-3);
    expect(Point.dx(p2, p1)).to.equal(-1);
    expect(Point.dy(p2, p1)).to.equal(3);
    expect(Point.slope(p1, p2)).to.equal(-3);
  });
  // it('', () => {});
});
