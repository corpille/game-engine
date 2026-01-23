import { Rect, Vec2 } from '../types';

export default class Camera {
  position: Vec2;
  zoom: number;

  getBounds(width: number, height: number) {
    return new Rect(this.position.x, this.position.y, width / this.zoom, height / this.zoom);
  }

  constructor(zoom: number = 1) {
    this.zoom = zoom;
    this.position = new Vec2(0, 0);
  }
}
