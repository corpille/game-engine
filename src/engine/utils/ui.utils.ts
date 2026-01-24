import { Control, UINode } from "../ui-components";
import { UIInputEvent } from "../types";

export function hitTest(node: Control, x: number, y: number): boolean {
  const r = node.globalRect();
  return (
    x >= r.x &&
    y >= r.y &&
    x <= r.x + r.w &&
    y <= r.y + r.h
  );
}

export function dispatchUIInput(
  node: UINode,
  event: UIInputEvent
): boolean {
  if (!node.visible) return false;

  // children first (top-most last)
  for (let i = node.children.length - 1; i >= 0; i--) {
    if (dispatchUIInput(node.children[i], event)) {
      return true;
    }
  }

  if (node instanceof Control && node.onInput) {
    if (
      event.x !== undefined &&
      event.y !== undefined &&
      hitTest(node, event.x, event.y)
    ) {
      return node.onInput(event);
    }
  }

  return false;
}
