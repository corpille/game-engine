import { Vec2 } from '../types';

export default class Movement {
  velocity: Vec2;

  constructor() {
    this.velocity = new Vec2(0, 0);
  }
}
