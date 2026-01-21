import { Camera } from '../../components';
import { Scene } from '../../core';
import { RenderSystem } from '../../types';

export default class CameraShiftSystem extends RenderSystem {
  public render(scene: Scene, ctx: CanvasRenderingContext2D): void {
    const cameraEntity = scene.findEntityWith(Camera);
    if (!cameraEntity) return;
    const camera = cameraEntity.get(Camera);
    ctx.scale(camera.zoom, camera.zoom);
    ctx.translate(-camera.pos.x, -camera.pos.y);
  }
}
