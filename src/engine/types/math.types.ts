export class Rect {
  x: number;
  y: number;
  w: number;
  h: number;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}


export class Vec2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static from(vec: Vec2) {
    return new Vec2(vec.x, vec.y);
  }

  toString() {
    return `${this.x}, ${this.y}`;
  }

  normalize() {
    const inv = 1 / Math.sqrt(2);
    this.x *= inv;
    this.y *= inv;
  }

  add(other: Vec2): Vec2 {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  mul(other: Vec2): Vec2 {
    this.x *= other.x;
    this.y *= other.y;
    return this;
  }

  mulScalar(scalar: number): Vec2 {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  equals(vec: Vec2): boolean {
    return vec.x === this.x && vec.y === this.y;
  }
}
