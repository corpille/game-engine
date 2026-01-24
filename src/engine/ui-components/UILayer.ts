import { Vec2 } from "../types";
import UINode  from "./UINode";

export default class UILayer {
  root: UINode;
  order: number;

  constructor(order: number = 1) {
    this.root = new UINode("root", new Vec2(0, 0));
    this.order = order;
  }

  updateSize(windowSize: { w: number, h: number }) {
    this.root.rect.w = windowSize.w;
    this.root.rect.h = windowSize.h;
  }

  findById(id: string): UINode | null {
    return this.root.findById(id);
  }
}