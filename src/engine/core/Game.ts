import Input from './Input';
import Scene from './Scene';

const FIXED_FPS = 60;
const FIXED_DT = 1 / FIXED_FPS;

export default class Game {
  private canvas: HTMLCanvasElement;
  private scenes: Map<string, Scene> = new Map();
  private currentScene?: Scene;
  private input: Input;
  private ctx: CanvasRenderingContext2D;
  private lastTime: number = 0;
  private accumulator: number = 0;
  public windowSize: { w: number; h: number };

  constructor(input: Input) {
    this.input = input;
    this.init();
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    document.body.appendChild(this.canvas);

    this.resizeCanvas();

    window.addEventListener('resize', () => {
     this.resizeCanvas.bind(this)()
    });
;
  }

  resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = Math.floor(rect.width * dpr);
    this.canvas.height = Math.floor(rect.height * dpr);
    this.windowSize = { w: this.canvas.width, h: this.canvas.height };

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  addScene(name: string, scene: Scene) {
    this.scenes.set(name, scene);
    return this;
  }

  setScene(name: string) {
    this.currentScene = this.scenes.get(name);
    this.currentScene?.init(this);
    return this;
  }

  update(dt: number) {
    this.currentScene?.update(dt, this.input);
    this.input.clearFrame();
  }

  render() {
    this.ctx.save();
    this.ctx.imageSmoothingEnabled = false;

    // clear the canvas
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
   
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
