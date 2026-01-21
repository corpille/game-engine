import { Scene } from '../../core';
import { AnimationState, Sprite } from '../../components';
import { AnimationStateSystem } from '../../systems';
import { UpdateSystem } from '../../types';

export default class AnimationSystem extends UpdateSystem {
  public runsAfter = [AnimationStateSystem];

  public update(scene: Scene, dt: number): void {
    for (const e of scene.entities) {
      const state = e.get(AnimationState);
      const sprite = e.get(Sprite);

      if (!state || !sprite || !state.current || !state.playing) continue;

      state.timer += dt;
      const frame = state.current.frames[state.frameIndex];

      if (state.timer >= frame.duration) {
        state.timer -= frame.duration;
        state.frameIndex++;

        state.current.events?.forEach((event: any) => {
          if (event.frame === state.frameIndex) {
            event.callback(e);
          }
        });

        if (state.frameIndex >= state.current.frames.length) {
          if (state.current.loop) {
            state.frameIndex = 0;
          } else {
            state.frameIndex = state.current.frames.length - 1;
            state.playing = false;
          }
        }

        sprite.frame = state.current.frames[state.frameIndex].rect;
      }
    }
  }
}
