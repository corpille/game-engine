import { RawInputEvent } from "../types";
import Scene from "../core/Scene";

export default class InputManager {
  private scene?: Scene;

  attach(scene: Scene) {
    this.scene = scene;
  }

  detach() {
    this.scene = undefined;
  }

  start(canvas: HTMLCanvasElement) {
    window.addEventListener("keydown", e =>
      this.forward({
        type: "keydown",
        key: e.code
      })
    );

    window.addEventListener("keyup", e =>
      this.forward({
        type: "keyup",
        key: e.code
      })
    );

    canvas.addEventListener("mousedown", e =>
      this.forwardMouse("mousedown", e, canvas)
    );

    canvas.addEventListener("mouseup", e =>
      this.forwardMouse("mouseup", e, canvas)
    );

    canvas.addEventListener("mousemove", e =>
      this.forwardMouse("mousemove", e, canvas)
    );
  }

  private forward(event: RawInputEvent) {
    if (!this.scene) return;
    this.scene.handleRawInput(event);
  }

  private forwardMouse(
    type: "mousedown" | "mouseup" | "mousemove",
    e: MouseEvent,
    canvas: HTMLCanvasElement
  ) {
    const rect = canvas.getBoundingClientRect();

    this.forward({
      type,
      x: (e.clientX - rect.left),
      y: (e.clientY - rect.top),
      button: e.button
    } as RawInputEvent);
  }
}
