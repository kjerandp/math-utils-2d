import {
  Point,
  Vector,
} from '../geometric-entities';

/**
 * Find intersection point between two lines, represented
 * in parametric form
 * @param {Point} p1
 * @param {Vector} v1
 * @param {Point} p2
 * @param {Vector} v2
 */
export function testParametricForm(p1, v1, p2, v2) {
  const c = v1.cross(v2);
  if (c === 0) return false;
  const t = new Vector(p1, p2).cross(v2) / c;
  return new Point(p1.x + t * v1.x, p1.y + t * v1.y);
}

/**
 * Find intersection point between two lines
 * @param {Line} lineA
 * @param {Line} lineB
 */
export function test(lineA, lineB) {
  return testParametricForm(lineA.point, lineA.vector, lineB.point, lineB.vector);
}
