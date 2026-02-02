import {
  AnimationSystem,
  AnimationStateSystem,
  CameraFollowSystem,
  CollisionSystem,
  InteractionDetectionSystem,
  PlayerInputSystem,
  EntityRenderSystem,
  SpriteFlipSystem,
  TilemapRenderSystem,
  CameraShiftSystem,
  MovementSystem,
} from '../engine/systems';
import { Collider, Sprite, Transform, Camera, Interactable } from '../engine/components';
import { Entity, Game, Scene } from '../engine/core';
import { Rect, Vec2 } from '../engine/types';
import { createPlayer } from './factories/player.factory';
import cardboardSrc from '/assets/cardboard.webp';
import shadowSrc from '/assets/shadow.webp';
import tilesetSrc from '/assets/tileset.webp';
import treatSrc from '/assets/treat.webp';
import { createWorldMap } from './factories/worldMap.factory';
import { InteractionPrompt, UILayer } from '../engine/ui-components';
import { Anchor } from '../engine/ui-components/UINode';
import CardboardSystem from './systems/Cardboard.system';
import Cardboard from './components/Cardboard.component';
import BoidSystem from './systems/Boid.system';
import catSrc from '/assets/cat.webp';
import { generateBoids } from './factories/boids.factory';

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
  const catImage = await getImage(catSrc);

  // Init scene
  const scene = new Scene();

  // Add player
  scene.addEntities(createPlayer(400, 300));

  // Add cardboard
  const cardboard = new Entity();
  const transform = new Transform();
  const sprite = new Sprite(cardboardImage);
  const collider = new Collider();

  transform.position = new Vec2(1050, 450);
  transform.elevation = 2;
  transform.scale = 2.1;
  sprite.frame = { x: 0, y: 0, w: 40, h: 40 };
  collider.solid = true;
  collider.size = { w: 30, h: 10 };
  collider.offset = new Vec2(5, 30);

  cardboard.add(transform).add(sprite).add(collider).add(new Interactable()).add(new Cardboard(3));

  scene.addEntities(cardboard);

  // Add camera
  const cameraEntity = new Entity().add(new Camera(1.5));
  scene.addEntities(cameraEntity);

  const worldMap = createWorldMap([tilesetImage, shadowImage], 64);
  scene.addEntities(new Entity().add(worldMap));

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
    new InteractionDetectionSystem(),
    new PlayerInputSystem(),
    new MovementSystem(),
    new CardboardSystem(treatImage),
    new BoidSystem(),
  ];

  scene.addSystems(...systems);

  const catSprite = new Sprite(catImage);
  catSprite.frame = { x: 0, y: 0, w: 20, h: 20 };
  scene.addEntities(...generateBoids(catSprite, new Rect(40, 100, 720, 440), 40, 'cat'));


  const uiLayer = new UILayer();
  const prompt = new InteractionPrompt('interaction_prompt', new Vec2(0, -20));
  prompt.anchor = Anchor.BOTTOM_CENTER;
  prompt.text = "Press E to interact";
  uiLayer.root.addChild(prompt);
  scene.addUILayer(uiLayer);

  scene.buildPipelines();

  const game = new Game().addScene('game', scene).setScene('game');

  game.start();
})();
