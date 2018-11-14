class Angle {
  /**
   * Create an instance of the Angle class
   * @param {Number} angle
   */
  constructor(angle = 0) {
    if (angle instanceof Angle) {
      this.radians = angle.value;
    } else {
      this.radians = angle;
    }
  }

  /**
   * Convert from radians to degrees
   * @param {Number} r
   */
  static rad2deg(r) {
    return r * Angle.RAD2DEG;
  }

  /**
   * Convert from degrees to radians
   * @param {Number} d
   */
  static deg2rad(d) {
    return d * Angle.DEG2RAD;
  }

  /**
   * Create instance of angle given degrees
   * @param {Number} deg
   */
  static fromDegrees(deg) {
    const a = new Angle();
    a.degrees = deg;
    return a;
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

  /**
   * Returns number representing quadrant I, II, III, or IV
   */
  get quadrant() {
    const a = this.normalize().value;

    if (a > 0 && a < Angle.SPI) return 1;
    if (a > Angle.SPI && a < Angle.PI) return 4;
    if (a > -Angle.PI && a < -Angle.SPI) return 3;
    if (a > -Angle.SPI && a < 0) return 2;
    return undefined;
  }

  /**
   * returns a number according to general direction,
   * where angles either is defined as pointing right
   * (0 <= a < PI) or otherwize left
   */
  get generalDirection() {
    const a = this.normalize().value;

    if (a >= 0 && a < Angle.PI) return 1;
    return -1;
  }

  get rev() {
    return this.value * Angle.RAD2REV;
  }

  /**
   * Returns angle as a positive value between 0 and 2*PI
   */
  get positiveValue() {
    const v = this.value % Angle.TAU;
    return (v < 0 ? v + Angle.TAU : v);
  }

  /**
   * Cos of angle
   */
  cos() {
    return Math.cos(this.value);
  }

  /**
   * Sin of angle
   */
  sin() {
    return Math.sin(this.value);
  }

  /**
   * Tan of angle
   */
  tan() {
    return Math.tan(this.value);
  }

  /**
   * Invert angle
   * @param {bool} mutate
   */
  invert(mutate = false) {
    const na = -this.value;
    if (mutate) {
      this.value = na;
      return this;
    }
    return new Angle(na);
  }

  /**
   * Normalize angle between +/- PI
   * @param {bool} mutate
   */
  normalize(mutate = false) {
    const na = this.value - Angle.TAU * Math.floor((this.value + Angle.PI) / Angle.TAU);
    if (mutate) {
      this.value = na;
      return this;
    }
    return new Angle(na);
  }

  /**
   * Construct new, positive, angle measured from the given start angle
   * @param {Angle/Number} start
   * @param {bool} mutate
   */
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

  /**
   * Supplementary angle (PI - angle)
   * @param {bool} mutate
   */
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

  /**
   * Complementary angle (SemiPI - angle)
   * @param {bool} mutate
   */
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

  /**
   * Add rad to angle's value
   * @param {Number} rad
   * @param {bool} mutate
   */
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
