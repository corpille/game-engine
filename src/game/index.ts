import {
  AnimationSystem,
  AnimationStateSystem,
  CameraFollowSystem,
  CollisionSystem,
  InteractionDetectionSystem,
  InteractionInputSystem,
  InteractionUISystem,
  PlayerInputSystem,
  EntityRenderSystem,
  SpriteFlipSystem,
  TilemapRenderSystem,
  CameraShiftSystem,
  MovementSystem,
} from '../engine/systems';
import { Collider, Sprite, Transform, Camera, Interactable } from '../engine/components';
import { Entity, Game, Input, Scene } from '../engine/core';
import { Vec2 } from '../engine/types';
import { CarboardComponent } from './Carboard.component';
import { createPlayer } from './player.factory';
import cardboardSrc from '/assets/cardboard.webp';
import shadowSrc from '/assets/shadow.webp';
import tilesetSrc from '/assets/tileset.webp';
import treatSrc from '/assets/treat.webp';
import { createWorldMap } from './worldMap.factory';

function getImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(image);
  });
}

(async function () {
  const cardboardImage = await getImage(cardboardSrc);
  const shadowImage = await getImage(shadowSrc);
  const tilesetImage = await getImage(tilesetSrc);
  const treatImage = await getImage(treatSrc);

  // Init scene
  const scene = new Scene();

  // Add player
  scene.addEntity(createPlayer(400, 300));

  // Add cardboard
  const cardboard = new Entity();
  const transform = new Transform();
  const sprite = new Sprite(cardboardImage);
  const collider = new Collider();

  transform.position = new Vec2(1050, 450);
  transform.elevation = 2;
  transform.scale = 3;
  sprite.frame = { x: 0, y: 0, w: 40, h: 40 };
  collider.solid = true;
  collider.size = { w: 30, h: 10 };
  collider.offset = new Vec2(5, 30);

  cardboard.add(transform).add(sprite).add(collider).add(new Interactable()).add(new CarboardComponent(treatImage));

  scene.addEntity(cardboard);

  // Add camera
  const cameraEntity = new Entity().add(new Camera(1.8));
  scene.addEntity(cameraEntity);

  const worldMap = createWorldMap([tilesetImage, shadowImage], 64);
  scene.addEntity(new Entity().add(worldMap));

  // Add systems
  const systems = [
    new SpriteFlipSystem(),
    new CameraFollowSystem(),
    new CameraShiftSystem(),
    new CollisionSystem(),
    new AnimationSystem(),
    new AnimationStateSystem(),
    new TilemapRenderSystem(),
    new EntityRenderSystem(),
    new InteractionInputSystem(),
    new InteractionDetectionSystem(),
    new InteractionUISystem(),
    new PlayerInputSystem(),
    new MovementSystem(),
  ];

  scene.addSystems(...systems);

  scene.buildPipelines();

  scene.eventBus.on('interact', ({ player, target }) => {
    if (target.has(CarboardComponent)) {
      target.get(CarboardComponent).interact(scene, target);
    }
  });

  const game = new Game(new Input()).addScene('game', scene).setScene('game');

  requestAnimationFrame(game.loop.bind(game));
})();
