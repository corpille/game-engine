import { Entity, Input, Scene } from '../../core';
import { Movement, Transform } from '../../components';
import { PlayerInputSystem } from '../../systems';
import { UpdateSystem, Vec2 } from '../../types';
import WorldMap from '../../components/WorldMap.component';
import { clamp } from '../../utils';

export default class MovementSystem extends UpdateSystem {
  public runsAfter = [PlayerInputSystem];

  public update(scene: Scene, dt: number, input: Input): void {
    for (const e of scene.entities) {
      const transform = e.get(Transform);
      const movement = e.get(Movement);
      const worldMap = scene.findEntityWith(WorldMap)?.get(WorldMap);

      if (!transform || !movement || !worldMap) continue;

      if (movement.velocity.x === 0 && movement.velocity.y === 0) continue;

      const next = Vec2.from(transform.position).add(Vec2.from(movement.velocity).mulScalar(dt));

      const cell = worldMap.cellAtWorld(transform.position.x, transform.position.y);
      const nextCell = worldMap.cellAtWorld(next.x, next.y);
      const cellPos = worldMap.getCellPos(transform.position.x, transform.position.y);
      const nextCellPos = worldMap.getCellPos(next.x, next.y);

      const direction = new Vec2(nextCellPos.x - cellPos.x, nextCellPos.y - cellPos.y);
      if (direction.x === 0 && direction.y === 0) {
        this.move(transform, next.x, next.y, nextCell.height);
        continue;
      }

      if (nextCell) {
        const moves = {
          top: new Vec2(0, -1),
          right: new Vec2(1, 0),
          bottom: new Vec2(0, 1),
          left: new Vec2(-1, 0),
        };
        const opposite: Record<string, string> = {
          top: 'bottom',
          right: 'left',
          bottom: 'top',
          left: 'right',
        };
        const move = Object.entries(moves).find(([key, value]) => value.equals(direction))?.[0];
        if (move) {
          const oppositeMove = opposite[move];
          const cellSide = cell.sides[move as keyof typeof cell.sides];
          const oppositeSide = nextCell.sides[oppositeMove as keyof typeof cell.sides];
          if (cellSide && oppositeSide) {
            transform.position.x = next.x;
            transform.position.y = next.y;
            transform.elevation = nextCell.height;
            continue;
          }
        }
      }
    }
  }

  move(transform: Transform, x: number, y: number, height: number) {
    transform.position.x = x;
    transform.position.y = y;
    transform.elevation = height;
  }
}
