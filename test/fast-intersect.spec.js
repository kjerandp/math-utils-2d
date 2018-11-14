import { expect } from 'chai';
import {
  Polygon,
} from '../src/geometric-entities';
import '../src/intersection';
import '../src/extensions';

describe('fast intersection tests', () => {
  const pol1 = Polygon.equilateral(5, 4);
  const pol2 = Polygon.equilateral(8, 4);

  it('should intersect', () => {
    expect(pol1.fastTest(pol2)).to.equal(true);
  });
});
