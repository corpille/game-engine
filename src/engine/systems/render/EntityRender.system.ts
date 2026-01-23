import { Camera, Transform } from '../../components';
import { Scene } from '../../core';
import { TilemapRenderSystem } from '../../systems';
import { RenderSystem } from '../../types';

export default class EntityRenderSystem extends RenderSystem {
  public runsAfter = [TilemapRenderSystem];

  public render(scene: Scene, ctx: CanvasRenderingContext2D): void {
    const cameraEntity = scene.findEntityWith(Camera);
    if (!cameraEntity) return;
    const camera = cameraEntity.get(Camera);

    for (const e of scene.entities.filter((e) => e.has(Transform))) {
      const transform = e.get(Transform);
      scene.draw(transform.position.y + transform.elevation, () => e.render(ctx, camera));
    }
  }
}
