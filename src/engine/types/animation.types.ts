import { Rect } from './math.types';

export interface Frame {
  rect: Rect;
  duration: number;
}

interface AnimationEvent {
  frame: number;
  callback: (entity: any) => void;
}

export interface Animation {
  frames: Frame[];
  loop: boolean;
  events?: AnimationEvent[];
}
