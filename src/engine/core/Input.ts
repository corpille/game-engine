export default class Input {
  private keysDown = new Set<string>();
  private keysPressed = new Set<string>();
  private keysReleased = new Set<string>();

  constructor() {
    window.addEventListener('keydown', (e) => {
      if (!this.keysDown.has(e.code)) {
        this.keysPressed.add(e.code);
      }
      this.keysDown.add(e.code);
    });

    window.addEventListener('keyup', (e) => {
      this.keysDown.delete(e.code);
      this.keysReleased.add(e.code);
    });
  }

  /** Is the key currently held down? */
  isDown(key: string): boolean {
    return this.keysDown.has(key);
  }

  /** Was the key pressed this frame? */
  isPressed(key: string): boolean {
    return this.keysPressed.has(key);
  }

  /** Was the key released this frame? */
  isReleased(key: string): boolean {
    return this.keysReleased.has(key);
  }

  /** Call at the END of each update to reset frame-based events */
  clearFrame(): void {
    this.keysPressed.clear();
    this.keysReleased.clear();
  }
}
