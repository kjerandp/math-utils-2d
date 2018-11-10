import Vector from '../geometric-entities/vector';
import Point from '../geometric-entities/point';
import * as segmentTests from '../intersection/line-segment-tests';
import * as circleTests from '../intersection/circle-tests';

export function fastTest(a, b, skipBBoxTest = false) {
  console.log(a, b);
  if (!skipBBoxTest && !a.boundingBox().test(b.boundingBox())) {
    return false;
  }

  if (segmentTests.fastTestSets(a.edges(), b.edges())) return true;

  // check if a is completely inside b or b is completely inside a
  if (b.isInternal(a.vertices[0])) return true;
  if (a.isInternal(b.vertices[0])) return true;
  return false;
}

export function fastTestLine(polygon, line) {
  const bbox = polygon.boundingBox();
  if (!bbox.testLine(line)) return false;

  // convert line to segment
  const [p1, p2] = line.points(bbox.x1 - 1, bbox.x2 + 1);
  const seg = { p1, p2 };

  return segmentTests.fastTestSets(polygon.edges(), [seg]);
}

export function fastTestCircle(polygon, circle) {
  if (!polygon.boundingBox().test(circle.boundingBox())) {
    return false;
  }

  if (polygon.isInternal(circle.center)) {
    return true;
  }

  return circleTests.fastTestSegmentSet(circle, polygon.edges());
}


export function testSegment(polygon, segment, skipBBoxTest = false) {
  if (!skipBBoxTest && !polygon.boundingBox().test(segment.boundingBox())) {
    return false;
  }

  const ips = [
    ...segmentTests.testSets([segment], polygon.edges()),
    ...polygon.filterInternal([segment.p1, segment.p2]),
  ];

  if (ips.length === 0) return false;

  if (ips.length % 2 !== 0) {
    // debugger;
    return undefined;
  }

  ips.sort((a, b) => {
    const dx = a.x - b.x;
    if (dx === 0) {
      return a.y - b.y;
    }
    return dx;
  });

  const segments = [];

  for (let i = 0; i < ips.length - 1; i += 2) {
    segments.push(new LineSegment(ips[i], ips[i + 1]));
  }
  return segments;
}

export function testLine(polygon, line) {
  const bbox = polygon.boundingBox();
  if (!bbox.testLine(line)) return false;

  // convert line to segment
  const seg = new LineSegment(...line.points(bbox.x1 - 1, bbox.x2 + 1));

  return testSegment(polygon, seg, true);
}

// return all intersecting points between two polygons
export function findIntersectionPoints(a, b) {
  if (!a.boundingBox().test(b.boundingBox())) {
    return false;
  }

  const intersects = segmentTests.testSets(a.edges(), b.edges());
  const pointsInA = a.filterInternal(b.vertices);
  const pointsInB = b.filterInternal(a.vertices);

  const ips = [
    ...intersects,
    ...pointsInA,
    ...pointsInB,
  ];

  return ips.length > 0 ? ips : false;
}

// return polygon(s) representing intersections
export function test(a, b) {
  const intersects = [];
  const aIsConvex = a.isConvex();
  const bIsConvex = b.isConvex();

  if (aIsConvex && bIsConvex) {
    const verts = findIntersectionPoints(a, b);
    if (verts)
      intersects.push(new Polygon(Point.order(verts), false));
  } else if (aIsConvex) {
    const tb = b.triangulate();
    for (let i = 0; i < tb.length; i++) {
      const verts = findIntersectionPoints(a, tb[i]);
      if (verts)
        intersects.push(new Polygon(Point.order(verts), false));
    }
  } else if (bIsConvex) {
    const ta = a.triangulate();
    for (let i = 0; i < ta.length; i++) {
      const verts = findIntersectionPoints(b, ta[i]);
      if (verts)
        intersects.push(new Polygon(Point.order(verts), false));
    }
  } else {
    const ta = a.triangulate();
    const tb = b.triangulate();

    for (let i = 0; i < ta.length; i++) {
      for (let j = 0; j < tb.length; j++) {
        const verts = findIntersectionPoints(ta[i], tb[j]);
        if (verts)
          intersects.push(new Polygon(Point.order(verts), false));
      }
    }
  }

  return intersects.length === 0 ? false :
    Polygon.merge(intersects).map(p => p.clean(true));
}

