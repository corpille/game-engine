import { AnimationState, Movement, Sprite, Transform } from "../../engine/components";
import { Entity } from "../../engine/core";
import { Frame, Rect, Vec2 } from "../../engine/types";
import Boid from "../components/Boid.component";
import BoidContainer from "../components/BoidContainer.components";


function makeFrames(row: number, count: number, size: { w: number; h: number }, offset: number = 0): Frame[] {
  return Array.from({ length: count }, (_, i) => ({
    rect: { x: (i + offset) * size.w, y: row * size.h, w: size.w, h: size.h },
    duration: 0.12,
  }));
}

export function generateBoids(sprite: Sprite, box: Rect, count: number, id: string) {
    const entities: Entity[] = [];

    const boidContainer = new BoidContainer();
    boidContainer.box = box;
    boidContainer.margin = 50;
    boidContainer.id = id;

    const containerEntity = new Entity();
    containerEntity.add(boidContainer);

    entities.push(containerEntity);

    for (let i = 0; i < count; i++) {
        const entity = new Entity();
        const transform = new Transform();

        transform.position = new Vec2(Math.random() * box.w + box.x, Math.random() * box.h + box.y);

        transform.elevation = 1;
        transform.scale = 1.5;
        const boid = new Boid();
        boid.containerId = boidContainer.id;
        const movement = new Movement();
        movement.velocity = new Vec2(Math.random() * 10 - 5, Math.random() * 10 - 5);

        entity.add(transform).add(movement).add(sprite).add(boid);


        if (id === 'cat') {

              const animation = new AnimationState();
              animation.animations.set('idle', {
                frames: makeFrames(0, 7, { w: 20, h: 20 }),
                loop: true,
              });
              animation.animations.set('walk', {
                frames: makeFrames(0, 4, { w: 20, h: 20 }, 7),
                loop: true,
              });
          entity.add(animation);
        }

        entities.push(entity);
    }

    return entities;
} 