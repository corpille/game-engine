import { Vec2 } from "../types";
import Control  from "./Control";

export default class InteractionPrompt extends Control {
  text: string;
  fontSize = 24;
  visible = false;
  padding = new Vec2(10, 12);


  draw(ctx: CanvasRenderingContext2D) {
    if (!this.visible) return;
    ctx.save();

    this.computeTextSize(ctx);

    const computedRect = this.globalRect();

    // Draw background
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.roundRect(
      computedRect.x,
      computedRect.y,
      this.rect.w,
      this.rect.h,
      8
    );
    ctx.fill();
    ctx.stroke();

    // Draw text
    this.getFontStyle(ctx);
    ctx.fillText(
      this.text,
      computedRect.x + this.rect.w / 2,
      computedRect.y + this.rect.h / 2
    );
    ctx.restore();
  }
  

  computeTextSize(ctx: CanvasRenderingContext2D) {
    this.getFontStyle(ctx);
    const boundingText = ctx.measureText(this.text);

    this.rect.w = boundingText.actualBoundingBoxRight + boundingText.actualBoundingBoxLeft + this.padding.x * 2;
    this.rect.h = boundingText.actualBoundingBoxAscent + boundingText.actualBoundingBoxDescent + this.padding.y * 2;
  }

  getFontStyle(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'black';
    ctx.font = `${this.fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

  }
}