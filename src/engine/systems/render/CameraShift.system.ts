import { Camera } from '../../components';
import { Scene } from '../../core';
import { RenderSystem } from '../../types';

export default class CameraShiftSystem extends RenderSystem {
  public render(scene: Scene, ctx: CanvasRenderingContext2D): void {
    const camera = scene.findEntityWith(Camera)?.get(Camera);
    if (!camera) return;

     ctx.setTransform(
    camera.zoom,
      0,
      0,
      camera.zoom,
      -camera.position.x * camera.zoom,
      -camera.position.y * camera.zoom
    );
  }
}
