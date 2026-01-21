import Tileset from '../core/TileSet';

export type TileSide = {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
};

/**
 * A tile definition.
 * @param id - The id of the tile.
 * @param walkable - Whether the tile is walkable.
 */
export class TileDef {
  id: number;
  walkable: boolean;
  sides?: TileSide;

  constructor(id: number, walkable: boolean, sides?: TileSide) {
    this.id = id;
    this.walkable = walkable;
    this.sides = sides;
  }
}

/**
 * The id of a tile.
 */
export type TileId = number;

/**
 * A layer of tiles.
 * @param elevation - The elevation of the layer.
 * @param width - The width of the layer.
 * @param height - The height of the layer.
 * @param tiles - The tiles in the layer.
 */
export type TileLayer = {
  elevation: number;
  interactive: boolean;
  width: number;
  height: number;
  tiles: TileId[];
  tileset: Tileset;
  tileDefs: Map<TileId, TileDef>;
};

/**
 * The tilemap data.
 * @param tileSize - The size of the tiles.
 * @param layers - The layers of the tilemap.
 * @param tileDefs - The tile definitions.
 */
export type TileMapData = {
  tileSize: number;
  layers: TileLayer[];
};
