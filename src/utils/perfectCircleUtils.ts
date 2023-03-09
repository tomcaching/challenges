
export type Point = {
    x: number;
    y: number;
};

export type PerfectCircleScore = {
    isComplete: boolean;
    isClockwise: boolean;
    similarity: number;
    radius: number;
}

export const distance = (first: Point, second: Point): number => {
    return Math.sqrt(
        (first.x - second.x) * (first.x - second.x) +
        (first.y - second.y) * (first.y - second.y)
    );
};

export const angle = (origin: Point, destination: Point): number => {
    return Math.atan2(origin.x - destination.x, origin.y - destination.y);
}

export const isClockwise = (angles: Array<number>, originAngle: number): boolean => {
    const matching = angles.filter((angle, i) => {
        const previous = i === 0 ? originAngle : angles[i - 1];
        const difference = angle - previous;

        return ((difference < 0 && difference >= -0.3) || difference >= (Math.PI * 2 - 0.3));
    });

    return (matching.length / angles.length) >= 0.90;
}

export const isComplete = (angles: Array<number>): boolean => {
    const checkpoints = [-Math.PI, -Math.PI / 2, 0, Math.PI / 2, Math.PI];
    const threshold = Math.PI / 4;

    console.log(angles, checkpoints);

    return checkpoints.every(checkpoint => angles.some(angle => Math.abs(checkpoint - angle) <= threshold));
}

export const computePerfectCircleScore = (points: Array<Point>, center: Point): PerfectCircleScore => {
    // No points?
    if (points.length === 0) {
        return {
            isComplete: false,
            isClockwise: false,
            similarity: 0,
            radius: center.x
        }
    };

    const start = angle(points[0], center);
    const angles = points.slice(1).map(point => angle(point, center));

    const radius = points.reduce((sum, point) => sum + distance(point, center), 0) / points.length;
    const error = points.reduce((sum, point) => sum + Math.abs(distance(point, center) - radius) / radius, 0) / points.length;

    return {
        isComplete: isComplete(angles),
        isClockwise: isClockwise(angles, start),
        similarity: 1 - error,
        radius
    }
}