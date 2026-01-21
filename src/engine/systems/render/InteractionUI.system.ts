import { Player, InteractionState, Interactable } from '../../components';
import { Scene } from '../../core';
import { EntityRenderSystem } from '../../systems';
import { UIRenderSystem } from '../../types';

export default class InteractionUISystem extends UIRenderSystem {
  public runsAfter = [EntityRenderSystem];

  public renderUI(scene: Scene, ctx: CanvasRenderingContext2D) {
    const player = scene.findEntityWith(Player, InteractionState);
    if (!player) return;

    const target = player.get(InteractionState)?.target;
    if (!target) return;

    const interactable = target.get(Interactable);

    ctx.fillStyle = 'black';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';

    ctx.fillText(interactable.prompt, ctx.canvas.width / 2, ctx.canvas.height - 40);
  }
}
