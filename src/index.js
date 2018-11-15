import Point from './geometric-entities/point';
import Angle from './geometric-entities/angle';
import Vector from './geometric-entities/vector';
import Line from './geometric-entities/line';
import Ray from './geometric-entities/ray';
import LineSegment from './geometric-entities/line-segment';
import Ellipse from './geometric-entities/ellipse';
import Circle from './geometric-entities/circle';
import Polygon from './geometric-entities/polygon';
import Types from './common/types';
import {
  approxTo,
  approxZero,
  cycleIterator,
  cycle,
  intersect,
  union,
  except,
  isNumeric,
  isPointLike,
} from './common/utils';
import './extensions';
import './intersection';


export default {
  Point,
  Angle,
  Vector,
  Line,
  Ray,
  LineSegment,
  Ellipse,
  Circle,
  Polygon,
  Types,
  approxTo,
  approxZero,
  cycleIterator,
  isNumeric,
  isPointLike,
  array: {
    cycle,
    intersect,
    union,
    except,
  },
};
