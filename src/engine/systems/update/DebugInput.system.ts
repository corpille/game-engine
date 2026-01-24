import { Scene } from '../../core';
import { UpdateSystem } from '../../types';

export default class DebugInputSystem extends UpdateSystem {
  update(scene: Scene, dt: number): void {
    if (scene.input.justPressed('F2')) {
      scene.debugState.showEntity = !scene.debugState.showEntity;
    }
    if (scene.input.justPressed('F4')) {
      scene.debugState.showGrid = !scene.debugState.showGrid;
    }
  }
}
