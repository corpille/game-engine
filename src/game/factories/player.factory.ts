import { Entity } from '../../engine/core';
import { Frame, Vec2 } from '../../engine/types';
import { AnimationState, Collider, InteractionState, Movement, Player, Sprite, Transform } from '../../engine/components';
import imageSrc from '/assets/cat.webp';

const image = new Image();
image.src = imageSrc;

function makeFrames(row: number, count: number, size: { w: number; h: number }, offset: number = 0): Frame[] {
  return Array.from({ length: count }, (_, i) => ({
    rect: { x: (i + offset) * size.w, y: row * size.h, w: size.w, h: size.h },
    duration: 0.12,
  }));
}

export function createPlayer(x: number, y: number): Entity {
  const player = new Entity();
  const transform = new Transform();

  // Transform
  transform.position = new Vec2(x, y);
  transform.elevation = 0;
  transform.scale = 3.2;

  // Animation
  const animation = new AnimationState();
  animation.animations.set('idle', {
    frames: makeFrames(0, 7, { w: 20, h: 20 }),
    loop: true,
  });
  animation.animations.set('walk', {
    frames: makeFrames(0, 4, { w: 20, h: 20 }, 7),
    loop: true,
  });

  // Collider
  const collider = new Collider();
  collider.solid = true;
  collider.static = false;
  collider.size = { w: 13, h: 8 };
  collider.offset = new Vec2(4, 12);

  player
    .add(transform)
    .add(new Sprite(image))
    .add(animation)
    .add(collider)
    .add(new Player())
    .add(new Movement())
    .add(new InteractionState());

  return player;
}
