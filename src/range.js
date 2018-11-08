export default class Range {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  get value() {
    return [this.from, this.to];
  }

  set value([from, to]) {
    this.from = from;
    this.to = to;
  }
}
