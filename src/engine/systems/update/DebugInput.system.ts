import { Input, Scene } from '../../core';
import { UpdateSystem } from '../../types';

export default class DebugInputSystem extends UpdateSystem {
  update(scene: Scene, dt: number, input: Input): void {
    if (input.isPressed('F2')) {
      scene.debugState.showEntity = !scene.debugState.showEntity;
      input.clearFrame();
    }
    if (input.isPressed('F4')) {
      scene.debugState.showGrid = !scene.debugState.showGrid;
      input.clearFrame();
    }
  }
}
