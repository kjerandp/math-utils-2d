import { expect } from 'chai';
import {
  Line,
  LineSegment,
  Ellipse,
  Circle,
  Polygon,
  Point,
  Vector,
} from '../src/geometric-entities';
import '../src/extensions';
import BoundingBox from '../src/intersection/bounding-box-tests';

describe('bounding box tests', () => {
  it('should create correct bounding boxes for all shapes', () => {
    const ls = new LineSegment({ x: 2, y: 1 }, { x: 5, y: 7 });
    const lsBox = ls.boundingBox();
    expect(lsBox).to.deep.equal({
      x1: 2,
      y1: 1,
      x2: 5,
      y2: 7,
    });
    const el = new Ellipse({ x: -2, y: -4 }, 8, 5);
    const elBox = el.boundingBox();
    expect(elBox).to.deep.equal({
      x1: -10,
      y1: -9,
      x2: 6,
      y2: 1,
    });
    const cl = new Circle({ x: 2, y: -4 }, 6);
    const clBox = cl.boundingBox();
    expect(clBox).to.deep.equal({
      x1: -4,
      y1: -10,
      x2: 8,
      y2: 2,
    });
    const rect = Polygon.rectangle(2, 2, 10, 8);
    const rectBox = rect.boundingBox();
    expect(rectBox).to.deep.equal({
      x1: 2,
      y1: -6,
      x2: 12,
      y2: 2,
    });
    const oct = Polygon.equilateral(8, 4);
    expect(oct.vertices.length).to.equal(8);
    const octBox = oct.boundingBox();
    expect(octBox).to.deep.equal({
      x1: -4,
      y1: -4,
      x2: 4,
      y2: 4,
    });
  });

  it('should detect overlaps/intersections', () => {
    const box1 = new BoundingBox(2, 2, 4, 4);
    const box2 = new BoundingBox(1, 1, 5, 5);
    const box3 = new BoundingBox(4, 2, 8, 4);

    const l1 = new Line(new Vector(1, 0), new Point(0, 1.5));
    const l2 = new Line(new Vector(1, 1), new Point(0, 0));

    const s1 = new LineSegment({ x: 1, y: 1 }, { x: 2, y: 2 });
    const s2 = new LineSegment({ x: 1, y: 1 }, { x: 8, y: 4 });

    expect(box1.test(box1)).to.equal(true);
    expect(box1.test(box2)).to.equal(true);
    expect(box2.test(box1)).to.equal(true);

    expect(box1.testPoint({ x: 0, y: 0 })).to.equal(false);
    expect(box1.testPoint({ x: 2, y: 2 })).to.equal(true);
    expect(box1.testPoint({ x: 4, y: 4 })).to.equal(true);
    expect(box1.testPoint({ x: 5, y: 5 })).to.equal(false);

    expect(box1.test(box3)).to.equal(false);
    expect(box2.test(box3)).to.equal(true);

    expect(box1.testLine(l1)).to.equal(false);
    expect(box2.testLine(l1)).to.equal(true);
    expect(box3.testLine(l1)).to.equal(false);

    expect(box1.testLine(l2)).to.equal(true);
    expect(box2.testLine(l2)).to.equal(true);
    expect(box3.testLine(l2)).to.equal(true);

    expect(box1.testSegment(s1)).to.equal(false);
    expect(box2.testSegment(s1)).to.equal(true);
    expect(box3.testSegment(s1)).to.equal(false);

    expect(box1.testSegment(s2)).to.equal(true);
    expect(box2.testSegment(s2)).to.equal(true);
    expect(box3.testSegment(s2)).to.equal(true);
  });
});
