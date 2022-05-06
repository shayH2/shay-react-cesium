import MyPoint from './Point';

export default class regionOfInterest {
  constructor(l, t, r, b) {
    this.left = l;
    this.top = t;
    this.right = r;
    this.bottom = b;
  }

  toPolygon = () => [
    new MyPoint(this.left, this.top),
    new MyPoint(this.right, this.top),
    new MyPoint(this.right, this.bottom),
    new MyPoint(this.left, this.bottom),
  ];

  toFlatPolygon = () => [
    this.left,
    this.top,
    this.right,
    this.top,
    this.right,
    this.bottom,
    this.left,
    this.bottom,
  ];

  get Center() {
    return new MyPoint(
      this.left + (this.right - this.left) / 2,
      this.bottom + (this.top - this.bottom) / 2
    );
  }
}
