export default class Polynomials {
  static quadratic(a, b, c) {
    const dis = b ** 2 - 4 * a * c;

    return ({
      discriminant: dis,
      roots: () => {
        if (dis < 0) return null;
        const detSqrt = Math.sqrt(dis);
        const a2 = 2 * a;
        const r1 = (-b - detSqrt) / a2;
        const r2 = (-b + detSqrt) / a2;

        return [r1, r2];
      },
    });
  }
}
