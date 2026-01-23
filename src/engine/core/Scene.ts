import Entity from './Entity';
import { ComponentClass } from '../types';
import EventBus from './EventBus';
import { UpdateSystem, RenderSystem, UIRenderSystem, System, Pipeline } from '../types';
import Input from './Input';
import { DebugRenderSystem, DebugInputSystem } from '../systems';
import { DrawCall } from './DrawCall';
import DebugState from './DebugState';
import { resolveOrder } from '../utils/system.utils';
import Game from './Game';

export default class Scene {
  public debugState = new DebugState();
  private pipelines: Record<Pipeline, System[]> = {
    update: [],
    render: [],
    renderUI: [],
  };

  public entities: Entity[] = [];
  public eventBus = new EventBus();
  public drawCalls: DrawCall[];

  public systems: (UpdateSystem | RenderSystem | UIRenderSystem)[] = [new DebugInputSystem()];
  public debugRenderSystem: RenderSystem = new DebugRenderSystem();

  private game: Game;

  get windowSize() {
    return this.game.windowSize;
  }

  init(game: Game) {
    this.game = game;
    return this;
  }

  addEntity(entity: Entity) {
    this.entities.push(entity);
    return this;
  }

  addSystems(...system: (UpdateSystem | RenderSystem | UIRenderSystem)[]) {
    this.systems.push(...system);
    return this;
  }

  buildPipelines() {
    for (const pipeline of ['update', 'render', 'renderUI'] as Pipeline[]) {
      const systems = this.systems.filter((s) => pipeline in s);
      this.pipelines[pipeline] = resolveOrder(systems);
    }
    return this;
  }

  update(dt: number, input: Input) {
    for (const system of this.pipelines.update) {
      (system as UpdateSystem).update(this, dt, input);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    this.drawCalls = [];

    // Reset and clear the canvas
    ctx.save();

    // Generate all the draw calls
    for (const system of this.pipelines.render) {
      (system as RenderSystem).render(this, ctx);
    }

    // Sort and render the draw calls
    this.drawCalls.sort((a, b) => a.depth - b.depth);
    this.drawCalls.forEach((drawCall) => {
      drawCall.render(ctx);
    });

    // Render the debug render system
    this.debugRenderSystem.render(this, ctx);
    ctx.restore();

    // Render the UI
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (const system of this.pipelines.renderUI) {
      (system as UIRenderSystem).renderUI(this, ctx);
    }
  }

  draw(depth: number, render: () => void) {
    this.drawCalls.push(new DrawCall(depth, render));
  }

  findEntityWith(...components: ComponentClass<any>[]): Entity | null {
    return this.entities.find((entity) => components.every((c) => entity.has(c))) ?? null;
  }

  findEntitiesWith(...components: ComponentClass<any>[]): Entity[] {
    return this.entities.filter((entity) => components.every((c) => entity.has(c)));
  }
}
