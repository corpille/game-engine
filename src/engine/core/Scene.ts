import Entity from './Entity';
import { ComponentClass, RawInputEvent, UIInputEvent } from '../types';
import EventBus from './EventBus';
import { UpdateSystem, RenderSystem, UIRenderSystem, System, Pipeline } from '../types';
import { DebugRenderSystem, DebugInputSystem } from '../systems';
import { DrawCall } from './DrawCall';
import DebugState from './DebugState';
import { resolveOrder } from '../utils/system.utils';
import Game from './Game';
import { UILayer, UINode } from '../ui-components';
import { dispatchUIInput } from '../utils/ui.utils';
import { InputState } from '../input';
import UiManager from './UiManager';

export default class Scene {
  public input: InputState = new InputState();
  public entities: Entity[] = [];
  public eventBus = new EventBus();
  public debugState = new DebugState();

  private uiManager = new UiManager();

  private game: Game;
  private debugRenderSystem: RenderSystem = new DebugRenderSystem();
  private drawCalls: DrawCall[];
  private systems: (UpdateSystem | RenderSystem | UIRenderSystem)[] = [new DebugInputSystem()];
  private pipelines: Record<Pipeline, System[]> = {
    update: [],
    render: [],
    renderUI: [],
  };


  get windowSize() {
    return this.game.windowSize;
  }

  init(game: Game) {
    this.game = game;
    this.uiManager.init(this.eventBus);
    return this;
  }

  addUILayer(layer: UILayer) {
    this.uiManager.addLayer(layer);
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

  handleRawInput(event: RawInputEvent) {
    // Convert raw → UI event
    const uiEvent: UIInputEvent = event as any;

    // 1. UI gets first chance
    const consumed = this.uiManager.uiLayers.some((layer) => dispatchUIInput(layer.root, uiEvent));

    // 2. If UI didn't consume, update gameplay input
    if (!consumed) {
      this.input.handle(event);
    }
  }

  endFrame() {
    this.input.endFrame();
  }


  update(dt: number) {
    this.uiManager.uiLayers.forEach((layer) => layer.updateSize(this.windowSize));
    for (const system of this.pipelines.update) {
      (system as UpdateSystem).update(this, dt);
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

    this.uiManager.uiLayers.forEach((layer) => this.renderUI(layer.root, ctx));
  }

  renderUI(root: UINode, ctx: CanvasRenderingContext2D) {
    if (!root.visible) return;

    root.draw(ctx);
    root.children.forEach((child) => this.renderUI(child, ctx));
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
