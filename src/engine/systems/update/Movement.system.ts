import { Input, Scene } from '../../core';
import { Movement, Transform } from '../../components';
import { PlayerInputSystem } from '../../systems';
import { UpdateSystem, Vec2 } from '../../types';
import WorldMap from '../../components/WorldMap.component';

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
export default class MovementSystem extends UpdateSystem {
  public runsAfter = [PlayerInputSystem];

  public update(scene: Scene, dt: number, input: Input): void {
    for (const e of scene.entities) {
      const transform = e.get(Transform);
      const movement = e.get(Movement);
      const worldMap = scene.findEntityWith(WorldMap)?.get(WorldMap);

      if (!transform || !movement || !worldMap) continue;

      if (movement.velocity.x === 0 && movement.velocity.y === 0) continue;

      const nextPosition = Vec2.from(transform.position).add(Vec2.from(movement.velocity).mulScalar(dt));

      const nextCell = worldMap.cellAtWorld(nextPosition.x, nextPosition.y);

      if (this.canMove(worldMap, transform.position, nextPosition)) {
        this.move(transform, nextPosition.x, nextPosition.y, nextCell.height);
      }
    }
  }

  canMove(worldMap: WorldMap, currentPos: Vec2, nextPos: Vec2) {
    const cell = worldMap.cellAtWorld(currentPos.x, currentPos.y);
    const nextCell = worldMap.cellAtWorld(nextPos.x, nextPos.y);
    const cellPos = worldMap.getCellPos(currentPos.x, currentPos.y);
    const nextCellPos = worldMap.getCellPos(nextPos.x, nextPos.y);

    const direction = new Vec2(nextCellPos.x - cellPos.x, nextCellPos.y - cellPos.y);
    if (direction.x === 0 && direction.y === 0) {
      return true;
    }

    if (nextCell) {
      // TODO: Handle diagonal movement
      const move = Object.entries(moves).find(([key, value]) => value.equals(direction))?.[0];
      if (move) {
        const oppositeMove = opposite[move];
        const cellSide = cell.sides[move as keyof typeof cell.sides];
        const oppositeSide = nextCell.sides[oppositeMove as keyof typeof cell.sides];
        return cellSide && oppositeSide;
      }
    }
    return false;
  }

  move(transform: Transform, x: number, y: number, height: number) {
    transform.position.x = x;
    transform.position.y = y;
    transform.elevation = height;
  }
}
