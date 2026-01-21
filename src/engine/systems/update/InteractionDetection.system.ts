import { Input, Scene } from '../../core';
import { Player, Transform, InteractionState, Interactable } from '../../components';
import { MovementSystem } from '../../systems';
import { UpdateSystem } from '../../types';

export default class InteractionDetectionSystem extends UpdateSystem {
  public runsAfter = [MovementSystem];

  public update(scene: Scene, dt: number, input: Input): void {
    const player = scene.findEntityWith(Player, Transform, InteractionState);
    if (!player) return;

    const pCenter = player.getCenter();
    const pTransform = player.get(Transform);
    const interaction = player.get(InteractionState);

    interaction.target = scene.entities.find((entity) => {
      const interactable = entity.get(Interactable);
      const transform = entity.get(Transform);
      if (!interactable || !transform || transform.elevation !== pTransform.elevation) return false;

      const dx = entity.getCenter().x - pCenter.x;
      const dy = entity.getCenter().y - pCenter.y;
      const distSq = dx ** 2 + dy ** 2;

      const colliderBound = entity.getColliderBounds();
      const radius = interactable.radius + colliderBound.w / 2;

      return distSq <= radius ** 2;
    });
  }
}
