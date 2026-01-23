import { Rect, Vec2 } from '../types';

export default class Camera {
  pos: Vec2;
  width: number;
  height: number;
  zoom = 1;

  get bounds() {
    return new Rect(this.pos.x, this.pos.y, this.width / this.zoom, this.height / this.zoom);
  }

  constructor(width: number, height: number) {
    this.pos = new Vec2(0, 0);
    this.width = width;
    this.height = height;
  }
}
