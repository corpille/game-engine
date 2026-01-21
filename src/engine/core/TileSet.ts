export default class Tileset {
  image: HTMLImageElement;
  tileSize: number;
  columns: number;

  constructor(image: HTMLImageElement, tileSize: number) {
    this.image = image;
    this.tileSize = tileSize;
    this.columns = image.width / tileSize;
  }

  render(ctx: CanvasRenderingContext2D, id: number, x: number, y: number, scale: number = 1) {
    const tileX = (id % this.columns) * this.tileSize;
    const tileY = Math.floor(id / this.columns) * this.tileSize;
    ctx.drawImage(this.image, tileX, tileY, this.tileSize, this.tileSize, x * scale, y * scale, scale, scale);
  }
}
