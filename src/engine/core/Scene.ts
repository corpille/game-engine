import Entity from './Entity';
import { ComponentClass } from '../types';
import EventBus from './EventBus';
import { UpdateSystem, RenderSystem, UIRenderSystem, System, Pipeline, SystemCtor } from '../types';
import Input from './Input';
import { DebugRenderSystem, DebugInputSystem } from '../systems';
import { DrawCall } from './DrawCall';
import DebugState from './DebugState';

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
      this.pipelines[pipeline] = this.resolveOrder(systems);
    }
    return this;
  }

  resolveOrder<T extends System>(systems: T[]): T[] {
    // Map constructor → instance
    const byType = new Map<SystemCtor, T>();
    for (const system of systems) {
      byType.set(system.constructor as SystemCtor, system);
    }

    // Build adjacency list (dependency graph)
    const graph = new Map<T, Set<T>>();
    const inDegree = new Map<T, number>();

    // Initialize graph
    for (const system of systems) {
      graph.set(system, new Set());
      inDegree.set(system, 0);
    }

    // Build edges
    for (const system of systems) {
      // runsAfter: A runs after B  =>  B → A
      for (const dep of system.runsAfter ?? []) {
        const depSystem = byType.get(dep);
        if (!depSystem) continue;

        graph.get(depSystem)!.add(system);
        inDegree.set(system, inDegree.get(system)! + 1);
      }

      // runsBefore: A runs before B  =>  A → B
      for (const dep of system.runsBefore ?? []) {
        const depSystem = byType.get(dep);
        if (!depSystem) continue;

        graph.get(system)!.add(depSystem);
        inDegree.set(depSystem, inDegree.get(depSystem)! + 1);
      }
    }

    // Kahn’s algorithm
    const queue: T[] = [];
    for (const [system, degree] of inDegree) {
      if (degree === 0) queue.push(system);
    }

    const result: T[] = [];

    while (queue.length > 0) {
      const system = queue.shift()!;
      result.push(system);

      for (const next of graph.get(system)!) {
        const degree = inDegree.get(next)! - 1;
        inDegree.set(next, degree);
        if (degree === 0) queue.push(next);
      }
    }

    // Cycle detection
    if (result.length !== systems.length) {
      const unresolved = systems.filter((s) => !result.includes(s)).map((s) => s.constructor.name);

      throw new Error(`System dependency cycle detected:\n` + unresolved.map((n) => ` - ${n}`).join('\n'));
    }

    return result;
  }

  update(dt: number, input: Input) {
    for (const system of this.pipelines.update) {
      (system as UpdateSystem).update(this, dt, input);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    this.drawCalls = [];
    this.entities.sort((a, b) => a.getFeet() - b.getFeet());
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();

    for (const system of this.pipelines.render) {
      (system as RenderSystem).render(this, ctx);
    }

    this.drawCalls.sort((a, b) => a.depth - b.depth);
    this.drawCalls.forEach((drawCall) => {
      drawCall.render(ctx);
    });
    this.debugRenderSystem.render(this, ctx);
    ctx.restore();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (const system of this.pipelines.renderUI) {
      (system as UIRenderSystem).renderUI(this, ctx);
    }
  }

  findEntityWith(...components: ComponentClass<any>[]): Entity | null {
    return this.entities.find((entity) => components.every((c) => entity.has(c))) ?? null;
  }

  findEntitiesWith(...components: ComponentClass<any>[]): Entity[] {
    return this.entities.filter((entity) => components.every((c) => entity.has(c)));
  }
}
