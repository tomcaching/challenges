import { computePerfectCircleScore, type Point } from "@/components/utils/perfectCircleUtils";
import { createRef, useCallback, useEffect, useState, MouseEvent } from "react";

const PerfectCircle = () => {
    const canvasRef = createRef<HTMLCanvasElement>();
    const [drawing, setDrawing] = useState<boolean>(false);
    const [points, setPoints] = useState<Array<Point>>([]);
    const [error, setError] = useState<string|null>(null);

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
        setError(null);

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
        if (!drawing) {
            return;
        }
        
        setDrawing(false);

        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");

        if (!canvas || !context) {
            console.error("Cannot get 2d canvas context");
            return;
        }

        const center = { x: canvas.width / 2, y: canvas.height / 2 };
        const { similarity, radius, isClockwise, isComplete } = computePerfectCircleScore(points, center);

        if (!isClockwise) {
            setError("Kruh není ve směru hodinových ručiček!")
            return;
        }

        if (!isComplete) {
            setError("Kruh není kompletní!")
            return;
        }

        context.beginPath();
        context.arc(center.x, center.y, radius, 0, Math.PI * 2);
        context.strokeStyle = "#99ff99";
        context.lineWidth = 3;
        context.stroke();

        context.fillText((similarity * 100).toFixed(2) + "%", center.x, center.y + radius + 20)
    };

    return (
        <main className="flex flex-col items-center">
            <div className="container mx-auto py-20 flex flex-col items-center text-center">
                <h2 className="text-4xl font-black">Nakresli myší kruh kolem červené tečky ve směru hodinových ručiček.</h2>
                <h3 className="text-2xl font-medium mt-2">A aby to nebylo tak složitý, tak stačí aby byl jenom na 98% perfektní.</h3>
            </div>

            <canvas 
                ref={canvasRef} width={500} height={500} className="border rounded-xl shadow-xl"
                onMouseMove={(event) => draw(event)}
                onMouseDown={() => startDrawing()}
                onMouseLeave={() => finishDrawing()}
                onMouseUp={() => finishDrawing()}
            />

            <small className="text-neutral-400 mt-3">Btw, zelený kruh co se zobrazí je největší shoda...</small>
            { error && 
                <div className="mt-5 font-bold text-red-500">{error}</div>
            }
        </main>
    );
};

export default PerfectCircle;