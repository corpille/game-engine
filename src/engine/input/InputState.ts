import { RawInputEvent } from "../types/input.types";

export default class InputState {
  private keysDown = new Set<string>();
  private keysPressed = new Set<string>();
  private keysReleased = new Set<string>();

  mouse = {
    x: 0,
    y: 0,
    buttonsDown: new Set<number>(),
    buttonsPressed: new Set<number>(),
    buttonsReleased: new Set<number>()
  };

  // --- Queries ---
  isDown(key: string): boolean {
    return this.keysDown.has(key);
  }

  justPressed(key: string): boolean {
    return this.keysPressed.has(key);
  }

  justReleased(key: string): boolean {
    return this.keysReleased.has(key);
  }

  // --- Internal ---
  handle(event: RawInputEvent) {
    switch (event.type) {
      case "keydown":
        if (!this.keysDown.has(event.key)) {
          this.keysPressed.add(event.key);
        }
        this.keysDown.add(event.key);
        break;

      case "keyup":
        this.keysDown.delete(event.key);
        this.keysReleased.add(event.key);
        break;

      case "mousedown":
        if (!this.mouse.buttonsDown.has(event.button)) {
          this.mouse.buttonsPressed.add(event.button);
        }
        this.mouse.buttonsDown.add(event.button);
        break;

      case "mouseup":
        this.mouse.buttonsDown.delete(event.button);
        this.mouse.buttonsReleased.add(event.button);
        break;

      case "mousemove":
        this.mouse.x = event.x;
        this.mouse.y = event.y;
        break;
    }
  }

  endFrame() {
    this.keysPressed.clear();
    this.keysReleased.clear();
    this.mouse.buttonsPressed.clear();
    this.mouse.buttonsReleased.clear();
  }
}
