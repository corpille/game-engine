import { TileLayer } from '../types';
import { Scene, Input } from '../core';

export class System {
  public runsAfter?: SystemCtor[];
  public runsBefore?: SystemCtor[];
}

export type SystemCtor<T extends System = System> = new (...args: any[]) => T;

export type Pipeline = 'update' | 'render' | 'renderUI';

export class UpdateSystem extends System {
  public update(scene: Scene, dt: number, input: Input): void {}
}

export class RenderSystem extends System {
  public render(scene: Scene, ctx: CanvasRenderingContext2D, layer?: TileLayer): void {}
}

export class UIRenderSystem extends System {
  public renderUI(scene: Scene, ctx: CanvasRenderingContext2D): void {}
}
