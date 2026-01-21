export default class Tileset {
  image: HTMLImageElement;
  tileSize: number;
  columns: number;

  constructor(image: HTMLImageElement, tileSize: number) {
    this.image = image;
    this.tileSize = tileSize;
    this.columns = image.width / tileSize;
  }

  getTileRect(id: number) {
    const x = (id % this.columns) * this.tileSize;
    const y = Math.floor(id / this.columns) * this.tileSize;

    return { x, y, w: this.tileSize, h: this.tileSize };
  }

  render(ctx: CanvasRenderingContext2D, id: number, x: number, y: number, scale: number = 1) {
    const tileRect = this.getTileRect(id);
    ctx.drawImage(this.image, tileRect.x, tileRect.y, tileRect.w, tileRect.h, x * scale, y * scale, scale, scale);
  }
}
