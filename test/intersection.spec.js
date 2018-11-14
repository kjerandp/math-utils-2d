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
    const intersects = pol1.test(pol2);
    expect(intersects).to.not.equal(false);
    expect(intersects.length).to.equal(1);
    expect(intersects[0]).to.be.instanceOf(Polygon);
    expect(intersects[0].vertices.length).to.equal(9);
  });
});
