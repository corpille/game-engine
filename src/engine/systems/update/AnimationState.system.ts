import { Scene } from '../../core';
import { AnimationState, Movement, Sprite } from '../../components';
import { CollisionSystem } from '../../systems';
import { UpdateSystem } from '../../types';

export default class AnimationStateSystem extends UpdateSystem {
  public runsBefore = [CollisionSystem];

  public update(scene: Scene, dt: number): void {
    for (const e of scene.entities) {
      const animation = e.get(AnimationState);
      const movement = e.get(Movement);
      const sprite = e.get(Sprite);
      if (!animation || !movement || !sprite) continue;

      const moving = movement.velocity.x !== 0 || movement.velocity.y !== 0;
      animation.play(moving ? 'walk' : 'idle', sprite);
    }
  }
}
