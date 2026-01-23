import { Camera, WorldMap } from '../../components';
import { Scene } from '../../core';
import { RenderSystem } from '../../types';

export default class TilemapRenderSystem extends RenderSystem {
  public render(scene: Scene, ctx: CanvasRenderingContext2D): void {
    const cameraEntity = scene.findEntityWith(Camera);
    const worldMapEntity = scene.findEntityWith(WorldMap);
    if (!cameraEntity || !worldMapEntity) return;
    const camera = cameraEntity.get(Camera);
    const worldMap = worldMapEntity.get(WorldMap);

    const cameraBounds = camera.getBounds(scene.windowSize.w, scene.windowSize.h);

    const startX = Math.floor(cameraBounds.x / worldMap.tileSize);
    const startY = Math.floor(cameraBounds.y / worldMap.tileSize);

    const endX = Math.ceil((cameraBounds.x + cameraBounds.w) / worldMap.tileSize);
    const endY = Math.ceil((cameraBounds.y + cameraBounds.h) / worldMap.tileSize);

    worldMap.layers.forEach((layer, height) => {
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          if (x < 0 || y < 0 || x >= layer.width || y >= layer.height) continue;

          const tileId = layer.tiles[x + y * layer.width];
          if (tileId === -1) continue;
          scene.draw(y * worldMap.tileSize + height, () => layer.tileset.render(ctx, tileId, x, y, worldMap.tileSize));
        }
      }
    });
  }
}
