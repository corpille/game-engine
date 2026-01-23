import { Input, Scene } from '../../core';
import { Player, InteractionState, Interactable } from '../../components';
import { UpdateSystem } from '../../types';

export default class InteractionInputSystem extends UpdateSystem {
  public update(scene: Scene, dt: number, input: Input) {
    if (!input.isPressed('KeyE')) return;

    const player = scene.findEntityWith(Player, InteractionState);
    if (!player) return;

    const target = player.get(InteractionState)?.target;

    if (target?.has(Interactable)) {
      // Fire interaction event
      scene.eventBus.emit('interact', {
        player,
        target,
      });
    }
  }
}
