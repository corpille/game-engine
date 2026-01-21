import { Scene } from '../../core';
import { Transform, WorldMap, Movement } from '../../components';
import { UpdateSystem } from '../../types';
import { MovementSystem } from '../';

export default class ElevationTransitionSystem implements UpdateSystem {
  runAfter = [MovementSystem];

  update(scene: Scene) {
    const map = scene.findEntityWith(WorldMap)?.get(WorldMap);
    if (!map) return;

    for (const e of scene.findEntitiesWith(Transform, Movement)) {
      const transform = e.get(Transform);
      const x = Math.floor(e.getFront().x / map.tileSize);
      const y = Math.floor(e.getFront().y / map.tileSize);
      let navTile = map.navMap[y]?.[x];
      if (transform.prevPosition.z === navTile.height || navTile.transition) {
        transform.prevPosition.z = transform.position.z;
        transform.position.z = navTile.height;
      } else if (transform.prevPosition.z < navTile.height && navTile.transition) {
        transform.position.z = transform.prevPosition.z;
        transform.position.z = navTile.height;
      } else {
        transform.position.x = transform.prevPosition.x;
        transform.position.y = transform.prevPosition.y;
      }
    }
  }
}
