export type Position = {
    x: number;
    y: number;
};

export type Cell = {
    star: boolean;
    sector: string;
    position: Position;
};

export type Grid = {
    size: number;
    cells: Array<Cell>;
};

export type StarsChallengeData = {
    grid: Grid,
};


export const positionEquals = (first: Position, second: Position): boolean =>
    first.x === second.x && first.y === second.y;

export const at = (grid: Grid, position: Position): Cell | undefined =>
    grid.cells.find(cell => positionEquals(cell.position, position));


export const validationErrors = (grid: Grid): Array<Position> => {
    const row = (grid: Grid, number: number): Array<Cell> => grid.cells.filter(cell => cell.position.y === number);
    const column = (grid: Grid, number: number): Array<Cell> => grid.cells.filter(cell => cell.position.x === number);

    const rowColumnErrors = [...new Array(grid.size)].flatMap((_, i) => {
        return [row(grid, i), column(grid, i)]
        .filter(cells => cells.filter(cell => cell.star).length > 2)
        .flatMap(cells => cells.map(cell => cell.position))
    });

    const sectorErrors = Object.values(
        grid.cells.reduce((sectors, current) => {
            const sector = sectors[current.sector] ?? [];
            return {
                ...sectors,
                [current.sector]: sector.concat([current])
            }
        }, {} as Record<string, Array<Cell>>)
    )
    .filter(cells => cells.filter(cell => cell.star).length > 2)
    .flatMap(cells => cells.map(cell => cell.position));

    const adjacentErrors = grid.cells.filter(cell => {
        if (!cell.star) {
            return false;
        }

        const vectors = [
            {x: -1, y: 0},
            {x: -1, y: -1},
            {x: -1, y: 1},
            {x: 1, y: 0},
            {x: 1, y: -1},
            {x: 1, y: 1},
            {x: 0, y: 1},
            {x: 0, y: -1}
        ];

        const neighbors: Array<Cell> = vectors.map(vector => ({
            x: cell.position.x + vector.x,
            y: cell.position.y + vector.y,
        }))
        .map(position => at(grid, position))
        .filter(position => typeof position !== "undefined") as Array<Cell>;

        return neighbors.some(neighbor => neighbor.star);
    })
    .map(cell => cell.position);

    return rowColumnErrors
        .concat(sectorErrors)
        .concat(adjacentErrors);
};

export const createChallenge = (): StarsChallengeData => {
    const source = "aaaaaaaabbaaaaaacabbdeeeacccbbddddfggcbbdddfffggbbddhfffggbbddhhhgggibddddddggibdjjjjjjjiijjjjjjjjji";
    const sectors = source.split("").reduce((groups, item, index) => {
        const position: Position = { x: index % 10, y: Math.floor(index / 10) }
        const positions: Array<Position> = (groups[item] ?? []).concat([position]);

        return { ...groups, [item]: positions };
    }, {} as Record<string, Array<Position>>);

    const constructGrid = (size: number, sectors: Record<string, Array<Position>>): Grid => {
        const cells = [...new Array(size)].flatMap((_, y) => {
            return [...new Array(size)].map((_, x) => {
                const position = { x, y };
                const [sector] = Object.entries(sectors).find(([, positions]) => positions.some(it => positionEquals(it, position)))!;

                return {
                    star: false,
                    sector,
                    position
                }
            });
        });

        return { size, cells };
    }

    return {
        grid: constructGrid(10, sectors)
    }
};