import { Scene } from '../../core';
import { Movement, Player } from '../../components';
import { Vec2 } from '../../types';
import { UpdateSystem } from '../../types';

export default class PlayerInputSystem extends UpdateSystem {
  public update(scene: Scene): void {
    const input = scene.input;
    for (const e of scene.entities) {
      const movement = e.get(Movement);
      const player = e.get(Player);
      if (!movement || !player) continue;

      let direction = new Vec2(0, 0);

      if (input.isDown('ArrowLeft') || input.isDown('KeyA')) direction.x -= 1;
      if (input.isDown('ArrowRight') || input.isDown('KeyD')) direction.x += 1;
      if (input.isDown('ArrowUp') || input.isDown('KeyW')) direction.y -= 1;
      if (input.isDown('ArrowDown') || input.isDown('KeyS')) direction.y += 1;

      // Normalize diagonal movement
      if (direction.x !== 0 && direction.y !== 0) {
        direction.normalize();
      }

      const speed = 500;
      movement.velocity.x = direction.x * speed;
      movement.velocity.y = direction.y * speed;
    }
  }
}
