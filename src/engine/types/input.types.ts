export type RawInputEvent =
  | KeyDownEvent
  | KeyUpEvent
  | MouseDownEvent
  | MouseUpEvent
  | MouseMoveEvent;

interface KeyDownEvent {
  type: "keydown";
  key: string;
}

interface KeyUpEvent {
  type: "keyup";
  key: string;
}

interface MouseDownEvent {
  type: "mousedown";
  button: number;
  x: number;
  y: number;
}

interface MouseUpEvent {
  type: "mouseup";
  button: number;
  x: number;
  y: number;
}

interface MouseMoveEvent {
  type: "mousemove";
  x: number;
  y: number;
}

export interface UIInputEvent {
  type: "mousedown" | "mouseup" | "mousemove" | "keydown" | "keyup";
  x?: number;
  y?: number;
  key?: string;
  button?: number;
}