import UINode  from "./UINode";

export default abstract class Control extends UINode {
  anchors = { left: 0, top: 0, right: 0, bottom: 0 };
  margins = { left: 0, top: 0, right: 0, bottom: 0 };

  abstract draw(ctx: CanvasRenderingContext2D): void;


  

}