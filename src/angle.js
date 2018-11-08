class Angle {
  constructor(angle) {
    if (angle instanceof Angle) {
      this.radians = angle.value;
    } else {
      this.radians = angle;
    }
  }

  static rad2deg(r) {
    return r * Angle.RAD2DEG;
  }

  static deg2rad(d) {
    return d * Angle.DEG2RAD;
  }

  get value() {
    return this.radians;
  }

  set value(rad) {
    this.radians = rad;
  }

  get degrees() {
    return this.radians * Angle.RAD2DEG;
  }

  set degrees(deg) {
    this.radians = deg * Angle.DEG2RAD;
  }

  get slope() {
    return (1 / Math.tan(this.value));
  }

  // returns number representing quadrand I, II, III, or IV
  // returns undefined
  get quadrant() {
    const a = this.normalize().value;

    if (a > 0 && a < Angle.SPI) return 1;
    if (a > Angle.SPI && a < Angle.PI) return 4;
    if (a > -Angle.PI && a < -Angle.SPI) return 3;
    if (a > -Angle.SPI && a < 0) return 2;
    return undefined;
  }

  // returns a number according to general direction,
  // where angles either is defined as pointing right
  // (0 <= a < PI) or otherwize left
  get generalDirection() {
    const a = this.normalize().value;

    if (a >= 0 && a < Angle.PI) return 1;
    return -1;
  }

  get rev() {
    return this.value * Angle.RAD2REV;
  }

  get positiveValue() {
    const v = this.value % Angle.TAU;
    return (v < 0 ? v + Angle.TAU : v);
  }

  cos() {
    return Math.cos(this.value);
  }

  sin() {
    return Math.sin(this.value);
  }

  tan() {
    return Math.tan(this.value);
  }

  invert(mutate = false) {
    const na = -this.value;
    if (mutate) {
      this.value = na;
      return this;
    }
    return new Angle(na);
  }

  // normalize angle between +/- PI
  normalize(mutate = false) {
    const na = this.value - Angle.TAU * Math.floor((this.value + Angle.PI) / Angle.TAU);
    if (mutate) {
      this.value = na;
      return this;
    }
    return new Angle(na);
  }

  // positive angle measured from start angle
  relative(start = 0, mutate = false) {
    if (!(start instanceof Angle)) start = new Angle(start);
    const a = new Angle(start.value + this.value);
    if (a.value < 0) {
      a.value += Angle.TAU;
    }
    if (mutate) {
      this.radians = a.value;
      return this;
    }
    return a;
  }

  suppl(mutate = false) {
    const n = this.normalize().value;
    if (n < 0 || n > Angle.PI) return null;
    const sa = Angle.PI - n;
    if (mutate) {
      this.value = sa;
      return this;
    }
    return new Angle(sa);
  }

  compl(mutate = false) {
    const n = this.normalize().value;
    if (n < 0 || n > Angle.SPI) return null;
    const ca = Angle.SPI - n;
    if (mutate) {
      this.value = ca;
      return this;
    }
    return new Angle(ca);
  }

  add(rad, mutate = false) {
    if (mutate) {
      this.value += rad;
      return this;
    }
    return new Angle(this.value + rad);
  }
}

Angle.TAU = Math.PI * 2;
Angle.PI = Math.PI;
Angle.SPI = Math.PI / 2; // Semi PI (or half of PI)
Angle.QPI = Math.PI / 4; // Quarter of PI

Angle.RAD2DEG = 180 / Angle.PI;
Angle.DEG2RAD = Angle.PI / 180;
Angle.RAD2REV = 1 / (Angle.TAU);

export default Angle;
