import { TileDef, TileLayer, NavTile } from '../types';
import { Vec2 } from '../types';

export default class WorldMap {
  tileSize: number;
  width: number;
  height: number;
  layers: TileLayer[];
  navMap: NavTile[][];

  constructor(tileSize: number, width: number, height: number, layers: TileLayer[]) {
    this.tileSize = tileSize;
    this.width = width;
    this.height = height;
    this.layers = layers;
    this.buildNavMap();
  }

  getCellPos(x: number, y: number) {
    return new Vec2(Math.floor(x / this.tileSize), Math.floor(y / this.tileSize));
  }

  cellAtWorld(x: number, y: number) {
    return this.navMap[Math.floor(y / this.tileSize)]?.[Math.floor(x / this.tileSize)];
  }

  private buildNavMap() {
    this.navMap = [];
    for (let y = 0; y < this.height; y++) {
      this.navMap.push([]);
      for (let x = 0; x < this.width; x++) {
        let bestTile: NavTile | null = null;

        this.layers
          .filter(({ interactive }) => interactive)
          .forEach(({ elevation }) => {
            const tile = this.getTileAt(x, y, elevation);
            if (tile && (!bestTile || (elevation > bestTile.height && tile.id !== -1))) {
              bestTile = { walkable: tile.walkable, height: elevation, sides: tile.sides };
            }
          });

        this.navMap[y][x] = bestTile ?? {
          walkable: false,
          height: -1,
          sides: { top: false, right: false, bottom: false, left: false },
        };
      }
    }
  }

  private getTileAt(x: number, y: number, elevation: number): TileDef | null {
    const layer = this.layers.find((l) => l.elevation === elevation);
    if (!layer) return null;
    if (x < 0 || y < 0 || x >= layer.width || y >= layer.height) {
      return null;
    }

    const index = this.index(x, y, layer.width);

    const tileId = layer.tiles[index];
    return layer.tileDefs.get(tileId) ?? null;
  }

  private index(x: number, y: number, width: number): number {
    return y * width + x;
  }
}
