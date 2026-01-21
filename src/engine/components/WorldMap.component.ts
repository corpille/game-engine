import { TileDef, TileId, TileLayer, TileSide } from '../types/tile.types';
import { Vec2 } from '../types';

type NavTile = {
  walkable: boolean;
  height: number;
  sides: TileSide;
};

export default class WorldMap {
  tileSize: number;
  width: number;
  height: number;
  layers: TileLayer[];
  navMap: NavTile[][];
  navLinks: string[];

  constructor(tileSize: number, width: number, height: number, layers: TileLayer[]) {
    this.tileSize = tileSize;
    this.width = width;
    this.height = height;
    this.layers = layers;
    this.buildNavMap();
  }

  private buildNavMap() {
    this.navMap = [];
    this.navLinks = [];
    for (let y = 0; y < this.height; y++) {
      this.navMap.push([]);
      for (let x = 0; x < this.width; x++) {
        let bestTile: NavTile | null = null;

        this.layers
          .filter(({ interactive }) => interactive)
          .forEach(({ elevation }) => {
            const tile = this.getTileAt(x, y, elevation);
            if (!tile) return;

            if (!bestTile || (elevation > bestTile.height && tile.id !== -1)) {
              Object.entries(tile.sides ?? {}).map(([side, value], index) => {
                const vecs: Record<string, Vec2> = {
                  top: new Vec2(0, -1),
                  right: new Vec2(1, 0),
                  bottom: new Vec2(0, 1),
                  left: new Vec2(-1, 0),
                };

                const to = new Vec2(x + vecs[side].x, y + vecs[side].y);
                if (value && this.navMap[to.y]?.[to.x] && this.navMap[to.y]?.[to.x].walkable) {
                  this.navLinks.push(`${x},${y}:${to.x},${to.y}`);
                }
              });

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

  getCellPos(x: number, y: number) {
    return new Vec2(Math.floor(x / this.tileSize), Math.floor(y / this.tileSize));
  }

  cellAtWorld(x: number, y: number) {
    return this.navMap[Math.floor(y / this.tileSize)]?.[Math.floor(x / this.tileSize)];
  }

  getTileAt(x: number, y: number, elevation: number): TileDef | null {
    const layer = this.layers.find((l) => l.elevation === elevation);
    if (!layer) return null;
    if (x < 0 || y < 0 || x >= layer.width || y >= layer.height) {
      return null;
    }

    const index = this.index(x, y, layer.width);

    const tileId = layer.tiles[index];
    return layer.tileDefs.get(tileId) ?? null;
  }

  getTilesAt(x: number, y: number): TileDef[] {
    return this.layers
      .map((layer) => this.getTileAt(x, y, layer.elevation) ?? null)
      .filter((tile) => tile !== null) as TileDef[];
  }

  canStandAt(x: number, y: number, z: number): boolean {
    return false;
  }

  index(x: number, y: number, width: number): number {
    return y * width + x;
  }
}
