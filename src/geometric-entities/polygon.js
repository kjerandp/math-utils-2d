import Point from './point';
import Vector from './vector';
import Angle from './angle';
import LineSegment from './line-segment';
import { cycleIterator, cycle, approxZero } from '../common/utils';
import Types from '../common/types';
import Cache from '../common/cache';
import BoundingBox from '../intersection/bounding-box-tests';

export default class Polygon {
  /**
   * Create a new instance of the Polygon class
   * @param {Array[Point]} vertices array of points
   * @param {bool} cache cache calculation results
   */
  constructor(vertices, cache = true) {
    if (!vertices || vertices.length <= 2) {
      throw new Error('A minimum of 3 vertices are required to form a polygon!');
    }

    this.cache = cache ?
      new Cache(() => JSON.stringify(this.vertices)) : undefined;

    this.vertices = vertices.map(v => new Point(v.x, v.y));
  }

  static mapIndices(polygons) {
    const mapToIndices = new Array(polygons.length);
    const verts = [];
    const mapToPolygon = [];

    for (let i = 0; i < polygons.length; i++) {
      const pol = polygons[i];
      const pIndices = new Array(pol.vertices.length);
      for (let j = 0; j < pol.vertices.length; j++) {
        const vert = pol.vertices[j];
        let idx = verts.findIndex(d => d.equals(vert));
        if (idx === -1) {
          idx = verts.length;
          verts.push(vert);
          mapToPolygon[idx] = [];
        }
        pIndices[j] = idx;
        mapToPolygon[idx].push(i);
      }
      mapToIndices[i] = pIndices;
    }

    const indices = verts.map((v, i) => ({
      polygons: mapToPolygon[i],
      vertex: v,
    }));

    return ({
      indices,
      polygons: mapToIndices,
    });
  }

  static mapEdges(polygons) {
    const mapToEdges = new Array(polygons.length);
    const edges = [];
    const mapToPolygon = [];
    for (let i = 0; i < polygons.length; i++) {
      const pol = polygons[i];
      const pIndices = [];
      const pEdges = pol.edges().filter(d => d.p1.equals(d.p2) === false);
      if (pEdges.length >= 3) {
        for (let j = 0; j < pEdges.length; j++) {
          const edge = pEdges[j];
          let idx = edges.findIndex(d => d.equals(edge, true));
          if (idx === -1) {
            idx = edges.length;
            edges.push(edge);
            mapToPolygon[idx] = [];
          }
          pIndices[j] = idx;
          mapToPolygon[idx].push(i);
        }
      }
      mapToEdges[i] = pIndices;
    }

    const indices = edges.map((v, i) => ({
      polygons: mapToPolygon[i],
      edge: v,
    }));

    return ({
      indices,
      polygons: mapToEdges,
    });
  }

  static merge(polygons) {
    if (polygons.length === 1) return polygons;
    const map = Polygon.mapEdges(polygons);
    // find outer edges
    const edges = map.indices.filter(d => d.polygons.length === 1).map(d => d.edge);

    // link edges to form polygons and make sure they is oriented CCW
    const merged = [];

    let start = edges.pop();
    start.normalizeOrientation(true);

    let end = start.p2;
    let verts = [start.p1, start.p2];

    while (edges.length > 0) {
      const idx = edges.findIndex(d => d.p1.equals(end) || d.p2.equals(end));
      if (idx === -1) {
        throw new Error('Unable to reconstruct polygon!');
      }
      const edge = edges.splice(idx, 1)[0];
      const vertex = edge.p1.equals(end) ? edge.p2 : edge.p1;

      // check for closed loop
      if (vertex.equals(verts[0])) {
        merged.push(new Polygon(verts).clean(true));
        if (edges.length < 3) break;
        start = edges.pop();
        start.normalizeOrientation(true);
        end = start.p2;
        verts = [start.p1, start.p2];
      } else {
        verts.push(vertex);
        end = vertex;
      }
    }

    return merged;
  }

  clone() {
    return new Polygon(this.vertices.map(p => p));
  }

  vectors() {
    return cycle(this.vertices, (v, nv) => new Vector(v, nv));
  }

  edges() {
    return cycle(this.vertices, (v, nv) => new LineSegment(v, nv));
  }

  areaSigned() {
    // Self-intersecting polygons not supported for this operation!
    if (this.isSelfIntersecting()) return undefined;
    const total = cycle(this.vertices,
      (v, nv) => v.x * nv.y - v.y * nv.x,
    ).reduce((sum, v) => sum + v, 0);
    return total / 2;
  }

  area() {
    return Math.abs(this.areaSigned());
  }

  perimeter() {
    return this.vectors().reduce((sum, v) => sum + v.length(), 0);
  }

  centeroid() {
    // Self-intersecting polygons not supported for this operation!
    if (this.isSelfIntersecting()) return undefined;

    if (this.cache) {
      const centeroid = this.cache.get('centeroid');
      if (centeroid !== undefined) return centeroid;
    }

    let cx = 0;
    let cy = 0;
    let a = 0;

    cycle(this.vertices, (p, pn) => {
      const s = (p.x * pn.y - pn.x * p.y);
      cx += (p.x + pn.x) * s;
      cy += (p.y + pn.y) * s;
      a += s;
    });

    const w = (1 / (6 * (a / 2)));

    const centeroid = new Point(
      cx * w,
      cy * w,
    );

    if (this.cache) {
      this.cache.set('centeroid', centeroid);
    }
    return centeroid;
  }

  orientation() {
    return this.areaSigned() < 0 ? Types.CLOCKWISE : Types.COUNTERCLOCKWISE;
  }

  angles() {
    const cw = this.orientation() === Types.CLOCKWISE;
    return cycle(this.vertices, (v, nv, pv) => (cw ?
      Point.angle(nv, v, pv) : Point.angle(pv, v, nv)));
  }

  isSelfIntersecting() {
    const v = this.vertices;
    const len = v.length;

    if (len < 4) return false;

    if (this.cache) {
      const selfIntersects = this.cache.get('self_intersects');
      if (selfIntersects !== undefined) return selfIntersects;
    }

    const testEdges = (p1, q1, p2, q2) => (
      Point.orientation(p1, q1, p2) !== Point.orientation(p1, q1, q2) &&
      Point.orientation(q2, p2, q1) !== Point.orientation(q2, p2, p1)
    );

    const decide = () => {
      const itr = cycleIterator(len);

      for (let i = 0; i < len - 2; i++) {
        const a = v[i];
        const b = v[itr.nextFrom(i)];
        for (let j = itr.nextFrom(i + 1); j < len && j !== itr.prevFrom(i); j++) {
          const c = v[j];
          const d = v[itr.nextFrom(j)];
          if (testEdges(a, b, c, d)) return true;
        }
      }
      return false;
    };

    const selfIntersects = decide();

    if (this.cache) {
      this.cache.set('self_intersects', selfIntersects);
    }

    return selfIntersects;
  }

  isConvex() {
    const v = this.vertices;
    const len = v.length;

    if (len < 4) return true;

    if (this.cache) {
      const isConvex = this.cache.get('is_convex');
      if (isConvex !== undefined) return isConvex;
    }

    const decide = () => {
      const cw = this.orientation() === Types.CLOCKWISE;
      for (let i = 0; i < len; i++) {
        const p0 = v[i];
        const p1 = v[(i + 1) % len];
        const p2 = v[(i + 2) % len];
        const angle = cw ? Point.angle(p2, p1, p0) : Point.angle(p0, p1, p2);
        if (angle.positiveValue > Angle.PI) return false;
      }
      return true;
    };

    const isConvex = decide();

    if (this.cache) {
      this.cache.set('is_convex', isConvex);
    }

    return isConvex;
  }

  isInternal(point) {
    let c = false;

    cycle(this.vertices, (v, vn) => {
      if (
        ((v.y > point.y) !== (vn.y > point.y)) &&
       (point.x < (vn.x - v.x) * (point.y - v.y) / (vn.y - v.y) + v.x)
      ) { c = !c; }
    });
    return c;
  }

  // return all points inside of the polygon
  filterInternal(points) {
    const bbox = this.boundingBox();

    const tests = points
      .filter(p => bbox.testPoint(p))
      .map(p => ({ p, c: false }));

    if (tests.length === 0) return tests;

    cycle(this.vertices, (v, vn) => {
      for (let i = 0; i < tests.length; i++) {
        const { p } = tests[i];
        if (
          ((v.y > p.y) !== (vn.y > p.y)) &&
         (p.x < (vn.x - v.x) * (p.y - v.y) / (vn.y - v.y) + v.x)
        ) { tests[i].c = !tests[i].c; }
      }
    });
    return tests.filter(t => t.c).map(t => t.p);
  }

  triangulate() {
    const findEar = (vertices) => {
      const len = vertices.length;
      if (len < 4) return null;
      const itr = cycleIterator(len);

      for (let i = 0; i < len; i++) {
        const v0 = vertices[itr.prevFrom(i)];
        const v1 = vertices[i];
        const v2 = vertices[itr.nextFrom(i)];

        const angle = Point.angle(v0, v1, v2);

        if (angle.positiveValue < Angle.PI) {
          const candidate = new Polygon([v0, v1, v2]);
          let isEar = true;

          let j = itr.nextFrom(i + 1);
          while (j !== itr.prevFrom(i)) {
            if (candidate.isInternal(vertices[j])) {
              isEar = false;
              break;
            }
            j = itr.nextFrom(j);
          }

          if (isEar) {
            return ({
              index: i,
              triangle: candidate,
            });
          }
        }
      }
      return null;
    };

    if (this.vertices.length < 4) return Object.assign({}, this);

    if (this.cache) {
      const triangles = this.cache.get('triangles');
      if (triangles) return triangles;
    }

    const triangles = [];

    const stack = [...this.vertices];
    if (this.isConvex()) { // simple fan
      const p0 = stack.pop();
      let p1 = stack.pop();

      while (stack.length > 0) {
        const p2 = stack.pop();
        triangles.push(new Polygon([p0, p1, p2]));
        p1 = p2;
      }
    } else { // ear cutting
      if (this.orientation() === Types.CLOCKWISE) {
        stack.reverse();
      }
      while (stack.length > 3) {
        const ear = findEar(stack);
        if (!ear) break;
        stack.splice(ear.index, 1);
        triangles.push(ear.triangle);
      }
      triangles.push(new Polygon(stack));
    }
    if (this.cache) {
      this.cache.set('triangles', triangles);
    }
    return triangles;
  }

  // remove redundant vertices
  clean(mutate = false) {
    if (this.vertices.length <= 3) return mutate ? this : this.clone();

    const verts = [...this.vertices];
    let i = 1;
    let p = 0;
    let n = 2;

    while (i < verts.length) {
      if (n === verts.length) n = 0;
      const v1 = new Vector(verts[p], verts[i]);
      const v2 = new Vector(verts[i], verts[n]);
      if (approxZero(v1.cross(v2))) {
        verts.splice(i, 1);
      } else {
        p = i++;
        n = i + 1;
      }
    }

    if (mutate) {
      this.vertices = verts;
      return this;
    }
    return new Polygon(verts);
  }

  boundingBox() {
    if (this.cache) {
      const bbox = this.cache.get('bbox');
      if (bbox) return bbox;
    }

    const bbox = BoundingBox.fromPoints(this.vertices);

    if (this.cache) {
      this.cache.set('bbox', bbox);
    }
    return bbox;
  }

  translate(dx, dy, mutate = false) {
    if (mutate) {
      this.vertices.forEach(v => v.translate(dx, dy, true));
      return this;
    }
    return new Polygon(this.vertices.map(v => v.translate(dx, dy)));
  }

  rotate(angle, anchor, mutate = false) {
    const por = anchor || this.centeroid();
    if (mutate) {
      this.vertices.forEach(v => v.rotate(angle, por, true));
      return this;
    }
    return new Polygon(this.vertices.map(v => v.rotate(angle, por)));
  }

  mirror(axisLine, mutate = false) {
    const mirrored = this.vertices.map((v) => {
      const pv = new Vector(axisLine.point, v);
      const proj = pv.projectOnto(axisLine.vector, false);
      const mv = proj.sub(pv);
      return new Point(v.x + 2 * mv.x, v.y + 2 * mv.y);
    });

    if (mutate) {
      this.vertices = mirrored;
      return this;
    }
    return new Polygon(mirrored);
  }

  scale(factor, mutate = false) {
    const center = this.centeroid();

    const scaled = this.vertices.map((v) => {
      const sv = new Vector(center, v).scale(factor);
      return new Point(center.x + sv.x, center.y + sv.y);
    });

    if (mutate) {
      this.vertices = scaled;
      return this;
    }
    return new Polygon(scaled);
  }

  position(at, options = {}, mutate = false) {
    const {
      edge: edgeIndex,
      my,
      it,
      offset,
    } = Object.assign({
      edgeIndex: 0,
      it: Types.CENTER,
      my: undefined,
      offset: 0,
    }, (options || {}));

    const alignment = {
      [Types.LEFT]: 0,
      [Types.CENTER]: 0.5,
      [Types.RIGHT]: 1,
    };

    const itr = cycleIterator(this.vertices.length);
    const edge = new LineSegment(
      this.vertices[edgeIndex],
      this.vertices[itr.nextFrom(edgeIndex)],
    );

    const vEdge = edge.toVector();
    const vAt = at.toVector();
    const vMove = new Vector(this.vertices[edgeIndex], at.p1);
    const angle = Vector.angle(vEdge, vAt);
    const vIt = vAt.scale(alignment[it]);
    const vMy = vAt.unit().scale(vEdge.length() * alignment[my === undefined ? it : my]);
    const vOffset = vAt.normal().scale(offset);
    const transformed = this
      .translate(vMove.x, vMove.y, mutate)
      .rotate(angle, at.p1, mutate)
      .translate(vIt.x - vMy.x, vIt.y - vMy.y, mutate)
      .translate(vOffset.x, vOffset.y, mutate);

    return transformed;
  }

  centerAt(point, mutate = false) {
    const cp = this.centeroid();
    if (!cp) return this;

    const v = new Vector(cp, point);
    return this.translate(v.x, v.y, mutate);
  }
}

