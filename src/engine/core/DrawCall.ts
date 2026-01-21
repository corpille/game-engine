export class DrawCall {
  depth: number;
  render: Function;

  constructor(depth: number, render: Function) {
    this.render = render;
    this.depth = depth;
  }
}
