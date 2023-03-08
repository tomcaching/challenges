import { createRef, useCallback, useEffect, useState, MouseEvent } from "react";

type Point = {
    x: number;
    y: number;
};

type PerfectCircleScore = {
    similarity: number;
    radius: number;
}

const distance = (first: Point, second: Point): number => {
    return Math.sqrt(
        (first.x - second.x) * (first.x - second.x) +
        (first.y - second.y) * (first.y - second.y)
    );
};

const computePerfectCircleScore = (points: Array<Point>, center: Point): PerfectCircleScore => {
    const radius = points.reduce((sum, point) => sum + distance(point, center), 0) / points.length;
    const error = points.reduce((sum, point) => sum + Math.abs(distance(point, center) - radius), 0);

    return {
        similarity: 1 - error,
        radius
    }
}

const PerfectCircle = () => {
    const canvasRef = createRef<HTMLCanvasElement>();
    const [drawing, setDrawing] = useState<boolean>(false);
    const [points, setPoints] = useState<Array<Point>>([]);

    const resetCanvas = useCallback(() => {
        if (!canvasRef.current) {
            return;
        }

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (!context) {
            console.error("Cannot get 2d canvas context");
            return;
        }

        setPoints([]);

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#ff0000";
        context.strokeStyle = "#000000";
        context.lineWidth = 1;
        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, 5, 0, Math.PI * 2);
        context.fill();
    }, [canvasRef]);

    const draw = (event: MouseEvent<HTMLCanvasElement>) => {
        if (!drawing || !canvasRef.current) {
            return;
        }

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (!context) {
            console.error("Cannot get 2d canvas context");
            return;
        }

        const boundaries = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - boundaries.left;
        const y = event.clientY - boundaries.top;
        const last = points.at(-1);

        context.beginPath();
        context.moveTo(last?.x ?? x, last?.y ?? y);
        context.lineTo(x, y);
        context.stroke();

        points.push({ x, y });
    };

    useEffect(() => { resetCanvas(); }, []);

    const startDrawing = useCallback(() => {
        resetCanvas();
        setPoints([]);
        setDrawing(true);
    }, [resetCanvas, setDrawing, setPoints]);

    const finishDrawing = () => {
        setDrawing(false);

        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");

        if (!canvas || !context) {
            console.error("Cannot get 2d canvas context");
            return;
        }

        const center = { x: canvas.width / 2, y: canvas.height / 2 };
        const { similarity, radius } = computePerfectCircleScore(points, center);

        context.beginPath();
        context.arc(center.x, center.y, radius, 0, Math.PI * 2);
        context.strokeStyle = "#99ff99";
        context.lineWidth = 3;
        context.stroke();

        context.fillText(similarity.toFixed(6), center.x, center.y + radius + 20)
    }

    return (
        <main className="flex flex-col items-center">
            <div className="container mx-auto py-20 flex flex-col items-center text-center">
                <h2 className="text-4xl font-black">Nakresli myší kruh kolem červené tečky ve směru hodinových ručiček.</h2>
                <h3 className="text-2xl font-medium mt-2">A aby to nebylo tak složitý, tak stačí aby byl jenom na 98% perfektní.</h3>
            </div>

            <canvas 
                ref={canvasRef} width={700} height={700} className="border rounded-xl shadow-xl"
                onMouseMove={(event) => draw(event)}
                onMouseLeave={() => finishDrawing()}
                onMouseDown={() => startDrawing()}
                onMouseUp={() => finishDrawing()}
            />
        </main>
    );
};

export default PerfectCircle;