import { Entity, Scene } from '../engine/core';
import { Transform, Sprite, Interactable } from '../engine/components';
import { Vec2 } from '../engine/types';
import { randomBetween } from '../engine/utils/number.utils';

export class CarboardComponent {
  nbTreat = 3;
  treatImage: HTMLImageElement;

  constructor(treatImage: HTMLImageElement) {
    this.treatImage = treatImage;
  }

  public interact(scene: Scene, target: Entity) {
    const treat = this.extractTreat();
    if (treat) {
      scene.addEntity(treat);
    }
    if (!this.nbTreat) {
      target.delete(Interactable);
    }
  }

  private extractTreat() {
    if (!this.nbTreat) return null;
    this.nbTreat--;
    const treat = new Entity();
    const treatTransform = new Transform();
    const treatSprite = new Sprite(this.treatImage);

    const x = randomBetween(1000, 1200);
    const y = randomBetween(220, 260);
    treatTransform.position = new Vec2(x, y);
    treatTransform.elevation = 2;
    treatTransform.scale = 2;
    treatSprite.frame = { x: 0, y: 0, w: 10, h: 10 };
    treat.add(treatTransform).add(treatSprite);
    return treat;
  }
}
