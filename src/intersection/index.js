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

Line.prototype.test = function test(other) {
  return lineTests.test(this, other);
};

Line.prototype.testParametricForm = function testParametricForm(other) {
  return lineTests.testParametricForm(this, other);
};

LineSegment.prototype.fastTest = function fastTest(other) {
  return segmentTests.fastTest(this, other);
};

LineSegment.prototype.test = function test(other) {
  return segmentTests.test(this, other);
};

LineSegment.prototype.testLine = function testLine(line) {
  return segmentTests.testLine(this, line);
};

LineSegment.fastTestSets = function fastTestSets(setA, setB) {
  return segmentTests.fastTestSets(setA, setB);
};

LineSegment.testSets = function testSets(setA, setB) {
  return segmentTests.testSets(setA, setB);
};

Ellipse.prototype.fastTest = function fastTest(other) {
  return ellipseTests.fastTest(this, other);
};

Ellipse.prototype.fastTestLine = function fastTestLine(line) {
  return ellipseTests.fastTestLine(this, line);
};

Ellipse.prototype.fastTestSegment = function fastTestSegment(segment) {
  return ellipseTests.fastTestSegment(this, segment);
};

Ellipse.prototype.testLine = function testLine(line) {
  return ellipseTests.testLine(this, line);
};

Ellipse.prototype.testSegment = function testSegment(segment) {
  return ellipseTests.testSegment(this, segment);
};

Circle.prototype.fastTest = function fastTest(other) {
  return circleTests.fastTest(this, other);
};

Circle.prototype.fastTestLine = function fastTestLine(line) {
  return circleTests.fastTestLine(this, line);
};

Circle.prototype.fastTestSegment = function fastTestSegment(segment) {
  return circleTests.fastTestSegment(this, segment);
};

Circle.prototype.fastTestSegmentSet = function fastTestSegmentSet(segments) {
  return circleTests.fastTestSegmentSet(this, segments);
};

Circle.prototype.testLine = function testLine(line) {
  return circleTests.testLine(this, line);
};

Circle.prototype.testSegment = function testSegment(segment) {
  return circleTests.testSegment(this, segment);
};

Polygon.prototype.fastTest = function fastTest(other) {
  return polygonTests.fastTest(this, other, false);
};

Polygon.prototype.fastTestLine = function fastTestLine(line) {
  return polygonTests.fastTestLine(this, line);
};

Polygon.prototype.fastTestCircle = function fastTestCircle(line) {
  return polygonTests.fastTestCircle(this, line);
};

Polygon.prototype.test = function test(other) {
  return polygonTests.test(this, other);
};

Polygon.prototype.testLine = function testLine(line) {
  return polygonTests.testLine(this, line);
};

Polygon.prototype.testSegment = function testSegment(segment) {
  return polygonTests.testSegment(this, segment, false);
};

