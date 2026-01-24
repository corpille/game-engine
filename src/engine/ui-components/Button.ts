import { UIInputEvent } from "../types";
import Control  from "./Control";

export default class Button extends Control {
  text: string;
  hovered = false;

  draw(ctx: CanvasRenderingContext2D) {
    const r = this.globalRect();
    ctx.fillStyle = this.hovered ? "#666" : "#444";
    ctx.fillRect(r.x, r.y, r.w, r.h);
    ctx.fillStyle = "white";
    ctx.fillText(this.text, r.x + 10, r.y + r.h / 2);
  }

  onInput(event: UIInputEvent) {
    if (event.type === "mousemove") {
      this.hovered = true;
      return false;
    }

    if (event.type === "mousedown") {
      return true;
    }

    return false;
  }
}