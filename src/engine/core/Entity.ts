import { Rect, Vec2 } from '../types';
import { aabbOverlaps } from '../utils/number.utils';
import { Transform, Sprite, Collider, Camera } from '../components';

type ComponentClass<T> = new (...args: any[]) => T;

export default class Entity {
  private components = new Map<ComponentClass<any>, any>();

  getBounds() {
    const sprite = this.get(Sprite);
    const transform = this.get(Transform);
    if (!sprite || !transform || !sprite.frame) return { x: 0, y: 0, w: 0, h: 0 };
    return {
      x: transform.position.x + sprite.offset.x * transform.scale,
      y: transform.position.y + sprite.offset.y * transform.scale,
      w: sprite.frame.w * transform.scale,
      h: sprite.frame.h * transform.scale,
    };
  }

  getColliderBounds(position?: Vec2) {
    const collider = this.get(Collider);
    const transform = this.get(Transform);
    if (!collider || !transform) return this.getBounds();
    const bound = this.getBounds();
    return {
      x: bound.x + collider.offset.x * transform.scale,
      y: bound.y + collider.offset.y * transform.scale,
      w: collider.size.w * transform.scale,
      h: collider.size.h * transform.scale,
    };
  }

  getCenter(position?: Vec2) {
    const colliderBounds = this.getColliderBounds(position);
    return new Vec2(colliderBounds.x + colliderBounds.w / 2, colliderBounds.y + colliderBounds.h / 2);
  }

  isVisible(cameraBounds: Rect): boolean {
    return aabbOverlaps(this.getBounds(), cameraBounds);
  }

  add<T>(component: T): this {
    this.components.set((component as any).constructor as ComponentClass<T>, component);
    return this;
  }

  get<T>(cls: ComponentClass<T>): T {
    return this.components.get(cls);
  }

  has(...cls: any[]): boolean {
    return cls.every((c) => this.components.has(c));
  }

  delete(...cls: any[]): this {
    cls.forEach((c) => this.components.delete(c));
    return this;
  }

  render(ctx: CanvasRenderingContext2D, camera: Camera) {
    const transform = this.get(Transform);

    if (!transform) return;
    if (!this.isVisible(camera.bounds)) return;

    const bounds = this.getBounds();

    const sprite = this.get(Sprite);
    if (sprite && sprite.frame) {
      ctx.save();
      sprite.render(ctx, bounds, transform.scale);
      ctx.restore();
    }
  }
}
