import { Entity, Input, Scene } from '../../core';
import { Collider, Sprite, Transform } from '../../components';
import { MovementSystem } from '../../systems';
import { aabbOverlaps, resolveAABB } from '../../utils';
import { UpdateSystem } from '../../types';

export default class CollisionSystem extends UpdateSystem {
  public runsAfter = [MovementSystem];

  public update(scene: Scene, dt: number, input: Input): void {
    for (let i = 0; i < scene.entities.length; i++) {
      const a = scene.entities[i];
      const aCollider = a.get(Collider);
      const aTransform = a.get(Transform);
      const aSprite = a.get(Sprite);
      if (!aCollider || !aTransform || !aSprite) continue;

      for (let j = i + 1; j < scene.entities.length; j++) {
        const b = scene.entities[j];
        const bCollider = b.get(Collider);
        const bTransform = b.get(Transform);
        const bSprite = b.get(Sprite);
        if (!bCollider || !bTransform || !bSprite) continue;

        if (aabbOverlaps(a.getColliderBounds(), b.getColliderBounds())) {
          this.onCollision(a, b);
        }
      }
    }
  }

  /**
   * Handles the collision between two entities.
   * @param a The first entity.
   * @param b The second entity.
   */
  private onCollision(a: Entity, b: Entity): void {
    const aCollider = a.get(Collider);
    const bCollider = b.get(Collider);
    if (!aCollider || !bCollider) return;

    if (aCollider.solid && bCollider.solid) {
      this.resolveCollision(a, b);
    }
  }

  /**
   * Resolves the collision between two entities.
   * @param a The first entity.
   * @param b The second entity.
   */
  private resolveCollision(a: Entity, b: Entity): void {
    const aCollider = a.get(Collider);
    const bCollider = b.get(Collider);
    const aTransform = a.get(Transform);
    const bTransform = b.get(Transform);
    if (!aCollider || !bCollider || !aTransform || !bTransform) return;

    const resolution = resolveAABB(a.getColliderBounds(), b.getColliderBounds());

    const aStatic = aCollider.static;
    const bStatic = bCollider.static;

    // Static vs static → do nothing
    if (aStatic && bStatic) return;

    // Dynamic vs static
    if (!aStatic && bStatic) {
      aTransform.position.x += resolution.x;
      aTransform.position.y += resolution.y;
      return;
    }

    // Static vs dynamic
    if (aStatic && !bStatic) {
      bTransform.position.x -= resolution.x;
      bTransform.position.y -= resolution.y;
      return;
    }

    // Dynamic vs dynamic → split movement
    aTransform.position.x += resolution.x / 2;
    aTransform.position.y += resolution.y / 2;
    bTransform.position.x -= resolution.x / 2;
    bTransform.position.y -= resolution.y / 2;
  }
}
