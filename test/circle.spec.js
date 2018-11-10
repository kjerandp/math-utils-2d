import { expect } from 'chai';
import {
  Circle,
  Polygon,
} from '../src/geometric-entities';
import '../src/extensions';

describe('circle class', () => {
  it('should be able to convert itself to polygon', () => {
    const circle = new Circle({ x: 2, y: 4 }, 8);
    const inscribed = circle.inscribe();
    expect(inscribed).to.be.instanceOf(Polygon);
    expect(inscribed.vertices.length).to.equal(25);

    const escribed = circle.escribe();
    expect(escribed).to.be.instanceOf(Polygon);
    expect(escribed.vertices.length).to.equal(24);
  });
});
