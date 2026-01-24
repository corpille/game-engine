import { Rect, UIInputEvent, Vec2 } from "../types";

export enum Anchor {
  TOP_LEFT,
  TOP_RIGHT,
  TOP_CENTER,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
  BOTTOM_CENTER,
  CENTER_LEFT,
  CENTER_RIGHT,
  CENTER_CENTER,
  FIXED
}

export default class UINode {
  id: string;
  parent?: UINode;
  children: UINode[] = [];

  rect: Rect;
  visible = true;
  mouseFilter: "stop" | "pass" | "ignore" = "pass";
  anchor: Anchor = Anchor.FIXED;

  constructor(id: string, pos: Vec2) {
    this.id = id;
    this.rect = { x: pos.x, y: pos.y, w: 0, h: 0 };
  }

  addChild(child: UINode) {
    child.parent = this;
    this.children.push(child);
  }

  draw(ctx: CanvasRenderingContext2D): void {}

  onInput?(event: UIInputEvent): boolean;

  findById(id: string): UINode | null {
    if (this.id === id) return this;
    for (const child of this.children) {
      const found = child.findById(id);
      if (found) return found;
    }
    return null;
  }

  globalRect(): Rect {
    if (!this.parent) return this.rect;
    const parentRect = this.parent.globalRect();
    if (this.anchor === Anchor.FIXED) {
      return {
        x: this.rect.x > 0 ? parentRect.x + this.rect.x : parentRect.x + parentRect.w + this.rect.x - this.rect.w,
        y: this.rect.y > 0 ? parentRect.y + this.rect.y : parentRect.y + parentRect.h + this.rect.y - this.rect.h,
        w: this.rect.w,
        h: this.rect.h
      };
    }
    const [yAnchor, xAnchor] = Anchor[this.anchor].split("_");

    let x = 0;
    if (xAnchor === "LEFT") {
      x = parentRect.x + this.rect.x;
    } else if (xAnchor === "RIGHT") {
      x = parentRect.x + parentRect.w - this.rect.w + this.rect.x;
    } else if (xAnchor === "CENTER") {
      x = parentRect.x + parentRect.w / 2 - this.rect.w / 2;
    }

    let y = 0;
    if (yAnchor === "TOP") {
      y = parentRect.y + this.rect.y;
    } else if (yAnchor === "BOTTOM") {
      y = parentRect.y + parentRect.h - this.rect.h + this.rect.y;
    } else if (yAnchor === "CENTER") {
      y = parentRect.y + parentRect.h / 2 - this.rect.h / 2;
    }


    return {
      x,
      y,
      w: this.rect.w,
      h: this.rect.h
    };
  }
}
