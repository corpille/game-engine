import { Animation } from '../types';

export default class AnimationState {
  animations = new Map<string, Animation>();
  current?: Animation;
  frameIndex = 0;
  timer = 0;
  playing = true;

  play(name: string, sprite: any): void {
    const anim = this.animations.get(name);
    if (!anim || anim === this.current) return;

    this.current = anim;
    this.frameIndex = 0;
    this.timer = 0;
    this.playing = true;

    sprite.frame = anim.frames[0].rect;
  }
}
