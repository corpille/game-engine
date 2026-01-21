import Input from './Input';
import Scene from './Scene';

const FIXED_FPS = 60;
const FIXED_DT = 1 / FIXED_FPS;

export default class Game {
  private scenes: Map<string, Scene> = new Map();
  private currentScene?: Scene;
  private input: Input;
  private ctx: CanvasRenderingContext2D;
  private lastTime: number = 0;
  private accumulator: number = 0;

  constructor(input: Input, ctx: CanvasRenderingContext2D) {
    this.input = input;
    this.ctx = ctx;
  }

  addScene(name: string, scene: Scene) {
    this.scenes.set(name, scene);
    return this;
  }

  setScene(name: string) {
    this.currentScene = this.scenes.get(name);
    return this;
  }

  update(dt: number) {
    this.currentScene?.update(dt, this.input);
  }

  render() {
    this.ctx.save();
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.currentScene?.render(this.ctx);
    this.ctx.restore();
  }

  loop(now: number) {
    const delta = (now - this.lastTime) / 1000;
    this.lastTime = now;
    this.accumulator += delta;

    // Clamp to avoid spiral of death
    if (this.accumulator > 0.25) {
      this.accumulator = 0.25;
    }

    while (this.accumulator >= FIXED_DT) {
      this.update(FIXED_DT);
      this.accumulator -= FIXED_DT;
    }

    this.render();
    requestAnimationFrame(this.loop.bind(this));
  }
}
