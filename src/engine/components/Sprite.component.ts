import { Rect, Vec2 } from '../types';

export default class Sprite {
  image: HTMLImageElement;
  frame?: Rect;
  flipX = false;

  constructor(image: HTMLImageElement) {
    this.image = image;
  }

  get offset(): Vec2 {
    if (!this.frame) return new Vec2(0, 0);
    return new Vec2(-this.frame.w / 2, -this.frame.h);
  }

  render(ctx: CanvasRenderingContext2D, bounds: Rect, scale: number = 1) {
    if (!this.frame || !bounds) return;
    const { x, y, w, h } = this.frame;

    ctx.save();

    if (this.flipX) {
      ctx.translate(bounds.x + w * scale, bounds.y);
      ctx.scale(-1, 1);
      ctx.drawImage(this.image, x, y, w, h, 0, 0, w * scale, h * scale);
    } else {
      ctx.drawImage(this.image, x, y, w, h, bounds.x, bounds.y, w * scale, h * scale);
    }
    ctx.restore();
  }
}
