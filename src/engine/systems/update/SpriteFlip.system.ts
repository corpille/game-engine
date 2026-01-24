import { Scene } from '../../core';
import { Movement, Sprite } from '../../components';
import { MovementSystem } from '../../systems';
import { UpdateSystem } from '../../types';

export default class SpriteFlipSystem extends UpdateSystem {
  public runsAfter = [MovementSystem];

  public update(scene: Scene, dt: number): void {
    for (const e of scene.entities) {
      const sprite = e.get(Sprite);
      const movement = e.get(Movement);
      if (!sprite || !movement) continue;

      if (movement.velocity.x < 0) {
        sprite.flipX = true;
      } else if (movement.velocity.x > 0) {
        sprite.flipX = false;
      }
    }
  }
}
