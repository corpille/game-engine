import { Rect, Vec2 } from '../types';

export default class Camera {
  position: Vec2;
  zoom = 1;

  getBounds(width: number, height: number) {
    return new Rect(this.position.x, this.position.y, width / this.zoom, height / this.zoom);
  }

  constructor() {
    this.position = new Vec2(0, 0);
  }
}
