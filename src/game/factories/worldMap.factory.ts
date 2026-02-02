import { WorldMap } from '../../engine/components';
import Tileset from '../../engine/core/TileSet';
import { TileDef } from '../../engine/types/tile.types';

export function createWorldMap(tilesetImage: HTMLImageElement[], tileSize: number): WorldMap {
  const shadowTileDefs = new Map([
    [0, new TileDef(0, true)], // Top left
    [1, new TileDef(1, true)], // Top
    [2, new TileDef(2, true)], // Top right
    [3, new TileDef(3, true)], // Left
    [4, new TileDef(4, true)], // Center
    [5, new TileDef(5, true)], // Right
    [6, new TileDef(6, true)], // Bottom left
    [7, new TileDef(7, true)], // Bottom
    [8, new TileDef(8, true)], // Bottom right
  ]);

  const tileDefs = new Map<number, TileDef>([
    [-1, new TileDef(-1, false, { top: false, right: false, bottom: false, left: false })], // Void
    // Line 1
    [0, new TileDef(0, true, { top: false, right: true, bottom: true, left: false })], // Top left corner
    [1, new TileDef(1, true, { top: false, right: true, bottom: true, left: true })], // Top
    [2, new TileDef(2, true, { top: false, right: false, bottom: true, left: true })], // Top right corner
    [3, new TileDef(3, true, { top: false, right: false, bottom: true, left: false })], // Small verti2l top
    [5, new TileDef(5, true, { top: false, right: true, bottom: true, left: false })], // Top left height corner
    [6, new TileDef(6, true, { top: false, right: true, bottom: true, left: true })], // Top height
    [7, new TileDef(7, true, { top: false, right: false, bottom: true, left: true })], // Top right height corner
    [8, new TileDef(8, true, { top: false, right: false, bottom: true, left: false })], //  Small verti2l height top

    // Line 2
    [9, new TileDef(9, true, { top: true, right: true, bottom: true, left: false })], // Left
    [10, new TileDef(10, true, { top: true, right: true, bottom: true, left: true })], // Ground
    [11, new TileDef(11, true, { top: true, right: false, bottom: true, left: true })], // Right
    [12, new TileDef(12, true, { top: true, right: false, bottom: true, left: false })], // Small verti2l middle
    [14, new TileDef(14, true, { top: true, right: true, bottom: true, left: false })], // Left height
    [15, new TileDef(15, true, { top: true, right: true, bottom: true, left: true })], // Ground height
    [16, new TileDef(16, true, { top: true, right: false, bottom: true, left: true })], // Right height
    [17, new TileDef(17, true, { top: true, right: false, bottom: true, left: false })], // Small verti2l height middle

    // Line 3
    [18, new TileDef(18, true, { top: true, right: true, bottom: false, left: false })], // Bottom left corner
    [19, new TileDef(19, true, { top: true, right: true, bottom: false, left: true })], // Bottom
    [20, new TileDef(20, true, { top: true, right: false, bottom: false, left: true })], // Bottom right corner
    [21, new TileDef(21, true, { top: true, right: false, bottom: false, left: false })], // Small verti2l bottom
    [23, new TileDef(23, true, { top: true, right: true, bottom: false, left: false })], // Bottom left height corner
    [24, new TileDef(24, true, { top: true, right: true, bottom: false, left: true })], // Bottom height
    [25, new TileDef(25, true, { top: true, right: false, bottom: false, left: true })], // Bottom right height corner
    [26, new TileDef(26, true, { top: true, right: false, bottom: false, left: false })], //  Small verti2l height bottom

    // Line 4
    [27, new TileDef(27, true, { top: false, right: true, bottom: false, left: false })], // Small horizontal left
    [28, new TileDef(28, true, { top: false, right: true, bottom: false, left: true })], // Small horizontal middle
    [29, new TileDef(29, true, { top: false, right: false, bottom: false, left: true })], // Small horizontal right
    [30, new TileDef(30, true, { top: false, right: false, bottom: false, left: false })], // Small horizontal square
    [32, new TileDef(32, true, { top: false, right: true, bottom: false, left: false })], // Small horizontal height left
    [33, new TileDef(33, true, { top: false, right: true, bottom: false, left: true })], // Small horizontal height middle
    [34, new TileDef(34, true, { top: false, right: false, bottom: false, left: true })], // Small horizontal height right
    [35, new TileDef(35, true, { top: false, right: false, bottom: false, left: false })], // Small horizontal height square

    // Line 5
    [36, new TileDef(36, true, { top: false, right: true, bottom: true, left: false })], // Slope top Left
    [38, new TileDef(38, true, { top: true, right: false, bottom: true, left: true })], // Slope top Right
    [41, new TileDef(41, false, { top: false, right: false, bottom: false, left: false })], // Wall interior left
    [42, new TileDef(42, false, { top: false, right: false, bottom: false, left: false })], // Wall interior middle
    [43, new TileDef(43, false, { top: false, right: false, bottom: false, left: false })], // Wall interior right
    [44, new TileDef(44, false, { top: false, right: false, bottom: false, left: false })], // Wall interior square

    // Line 6
    [45, new TileDef(45, true, { top: true, right: false, bottom: false, left: true })], // Slope bottom Left
    [48, new TileDef(48, true, { top: true, right: true, bottom: false, left: false })], // Slope bottom Right
    [50, new TileDef(50, false, { top: false, right: false, bottom: false, left: false })], // Wall exterior left
    [51, new TileDef(51, false, { top: false, right: false, bottom: false, left: false })], // Wall exterior middle
    [52, new TileDef(52, false, { top: false, right: false, bottom: false, left: false })], // Wall exterior right
    [53, new TileDef(53, false, { top: false, right: false, bottom: false, left: false })], // Wall exterior square
  ]);

  const tilesLayer1 = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1],
    [9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11],
    [9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11],
    [9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11],
    [9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11],
    [9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 10, 10, 10, 10, 10, 20],
    [9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 19, -1, -1, -1, -1, -1, -1],
    [18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, -1, -1, -1, -1, -1, -1, -1],
  ];

  const tilesLayer2 = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 4, 4, 4, 4, 4, 4, 4],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 7, 7, 7, 7, 7, 7, 7],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3, 4, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  ];

  const tilesLayer3 = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 5, 6, 6, 6, 6, 7],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 36, 24, 24, 24, 24, 24, 25],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 45, 42, 42, 42, 42, 42, 43],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 36, 6, 6, 6, 6, 7, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 45, 23, 24, 24, 24, 25, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 51, 51, 51, 51, 52, -1],
  ];
  const tileset = new Tileset(tilesetImage[0], tileSize);
  const shadowTileset = new Tileset(tilesetImage[1], tileSize);

  return new WorldMap(tileSize, tilesLayer1[0].length, tilesLayer1.length, [
    {
      elevation: 0,
      interactive: true,
      width: tilesLayer1[0].length,
      height: tilesLayer1.length,
      tiles: tilesLayer1.flat(),
      tileset,
      tileDefs,
    },
    {
      elevation: 1,
      interactive: false,
      width: tilesLayer2[0].length,
      height: tilesLayer2.length,
      tiles: tilesLayer2.flat(),
      tileset: shadowTileset,
      tileDefs: shadowTileDefs,
    },
    {
      elevation: 2,
      interactive: true,
      width: tilesLayer3[0].length,
      height: tilesLayer3.length,
      tiles: tilesLayer3.flat(),
      tileset,
      tileDefs,
    },
  ]);
}
