import { Entity, Input, Scene } from '../../core';
import { Camera, Player, Transform } from '../../components';
import { UpdateSystem } from '../../types';

export default class CameraFollowSystem extends UpdateSystem {
  update(scene: Scene, dt: number, input: Input): void {
    let target: Entity | undefined;

    const cameraEntity = scene.findEntityWith(Camera);
    if (!cameraEntity) return;
    const camera = cameraEntity.get(Camera);
    for (const e of scene.entities) {
      if (e.get(Player) && e.get(Transform)) target = e;
    }

    if (!camera || !target) return;

    const transform = target.get(Transform);

    camera.pos.x = transform.position.x - camera.width / 2;
    camera.pos.y = transform.position.y - camera.height / 2;
  }
}
