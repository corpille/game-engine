import { Vec2 } from '../types';

export default class Collider {
  offset = new Vec2(0, 0);
  size = { w: 0, h: 0 };

  solid = true;
  static = true;
}
