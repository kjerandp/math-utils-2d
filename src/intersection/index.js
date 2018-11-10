import {
  Polygon,
  Line,
  LineSegment,
  Circle,
  Ellipse,
} from '../geometric-entities';
import * as polygonTests from './polygon-tests';
import * as circleTests from './circle-tests';
import * as ellipseTests from './ellipse-tests';
import * as lineTests from './line-tests';
import * as segmentTests from './line-segment-tests';

Line.prototype.test = function(other) {
  return lineTests.test(this, other);
}

Line.prototype.testParametricForm = function(other) {
  return lineTests.testParametricForm(this, other);
}

LineSegment.prototype.fastTest = function(other) {
  return segmentTests.fastTest(this, other);
}

LineSegment.prototype.test = function(other) {
  return segmentTests.test(this, other);
}

LineSegment.prototype.testLine = function(line) {
  return segmentTests.testLine(this, line);
}

LineSegment.fastTestSets = function(setA, setB) {
  return segmentTests.fastTestSets(setA, setB);
}

LineSegment.testSets = function(setA, setB) {
  return segmentTests.testSets(setA, setB);
}

Ellipse.prototype.fastTest = function(other) {
  return ellipseTests.fastTest(this, other);
}

Ellipse.prototype.fastTestLine = function(line) {
  return ellipseTests.fastTestLine(this, line);
}

Ellipse.prototype.fastTestSegment = function(segment) {
  return ellipseTests.fastTestSegment(this, segment);
}

Ellipse.prototype.testLine = function(line) {
  return ellipseTests.testLine(this, line);
}

Ellipse.prototype.testSegment = function(segment) {
  return ellipseTests.testSegment(this, segment);
}

Circle.prototype.fastTest = function(other) {
  return circleTests.fastTest(this, other);
}

Circle.prototype.fastTestLine = function(line) {
  return circleTests.fastTestLine(this, line);
}

Circle.prototype.fastTestSegment = function(segment) {
  return circleTests.fastTestSegment(this, segment);
}

Circle.prototype.fastTestSegmentSet = function(segments) {
  return circleTests.fastTestSegmentSet(this, segments);
}

Circle.prototype.testLine = function(line) {
  return circleTests.testLine(this, line);
}

Circle.prototype.testSegment = function(segment) {
  return circleTests.testSegment(this, segment);
}

Polygon.prototype.fastTest = function(other) {
  return polygonTests.fastTest(this, other, false);
}

Polygon.prototype.fastTestLine = function(line) {
  return polygonTests.fastTestLine(this, line);
}

Polygon.prototype.fastTestCircle = function(line) {
  return polygonTests.fastTestCircle(this, line);
}

Polygon.prototype.test = function(other) {
  return polygonTests.test(this, other);
}

Polygon.prototype.testLine = function(line) {
  return polygonTests.testLine(this, line);
}

Polygon.prototype.testSegment = function(segment) {
  return polygonTests.testSegment(this, segment, false);
}


