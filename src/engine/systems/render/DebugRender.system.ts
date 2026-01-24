import { Interactable, Transform, Collider, WorldMap } from '../../components';
import { Entity, Scene } from '../../core';
import { EntityRenderSystem } from '../../systems';
import { RenderSystem } from '../../types';

export default class DebugRenderSystem extends RenderSystem {
  public runsAfter = [EntityRenderSystem];

  render(scene: Scene, ctx: CanvasRenderingContext2D): void {
    if (scene.debugState.showEntity) {
      ctx.save();
      for (const e of scene.entities.filter((e) => e.has(Transform))) {
        this.drawBound(ctx, e);

        this.drawCenter(ctx, e);

        if (e.has(Collider)) {
          this.drawCollider(ctx, e);

          if (e.has(Interactable)) {
            this.drawInteractableRadius(ctx, e);
          }
        }
      }
      ctx.restore();
    }

    if (scene.debugState.showGrid) {
      const map = scene.findEntityWith(WorldMap)?.get(WorldMap);
      if (map) {
        this.drawGrid(ctx, map);
      }
    }
  }

  drawBound(ctx: CanvasRenderingContext2D, entity: Entity) {
    ctx.strokeStyle = 'red';
    const bound = entity.getBounds();
    ctx.strokeRect(bound.x, bound.y, bound.w, bound.h);
  }

  drawCenter(ctx: CanvasRenderingContext2D, entity: Entity) {
    const transform = entity.get(Transform);

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = 'yellow';
    ctx.arc(transform.position.x, transform.position.y, 2, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.restore();
  }

  drawCollider(ctx: CanvasRenderingContext2D, entity: Entity) {
    ctx.save();
    const colliderBound = entity.getColliderBounds();
    ctx.strokeStyle = 'blue';
    ctx.strokeRect(colliderBound.x, colliderBound.y, colliderBound.w, colliderBound.h);
    ctx.restore();
  }

  drawInteractableRadius(ctx: CanvasRenderingContext2D, entity: Entity) {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = 'green';
    const center = entity.getCenter();
    ctx.arc(
      center.x,
      center.y,
      entity.getColliderBounds().w / 2 + entity.get(Interactable).radius,
      0,
      2 * Math.PI,
      false,
    );
    ctx.stroke();
    ctx.restore();
  }

  drawGrid(ctx: CanvasRenderingContext2D, map: WorldMap): void {
    ctx.save();
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const tile = map.navMap[y][x];
        if (tile.sides) {
          ctx.strokeStyle = tile.sides.top ? 'green' : 'red';
          ctx.beginPath();
          ctx.moveTo(x * map.tileSize, y * map.tileSize);
          ctx.lineTo((x + 1) * map.tileSize, y * map.tileSize);
          ctx.stroke();
          ctx.strokeStyle = tile.sides.right ? 'green' : 'red';
          ctx.beginPath();
          ctx.moveTo((x + 1) * map.tileSize, y * map.tileSize);
          ctx.lineTo((x + 1) * map.tileSize, (y + 1) * map.tileSize);
          ctx.stroke();
          ctx.strokeStyle = tile.sides.bottom ? 'green' : 'red';
          ctx.beginPath();
          ctx.moveTo((x + 1) * map.tileSize, (y + 1) * map.tileSize);
          ctx.lineTo(x * map.tileSize, (y + 1) * map.tileSize);
          ctx.stroke();
          ctx.strokeStyle = tile.sides.left ? 'green' : 'red';
          ctx.beginPath();
          ctx.moveTo(x * map.tileSize, (y + 1) * map.tileSize);
          ctx.lineTo(x * map.tileSize, y * map.tileSize);
          ctx.stroke();
        }
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText(`${x},${y}`, x * map.tileSize + map.tileSize / 2, y * map.tileSize + map.tileSize / 2);
      }
    }
    ctx.restore();
  }
}
