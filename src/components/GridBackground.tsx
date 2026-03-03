"use client";

import { useEffect, useRef } from "react";

export default function GridBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time += 0.003;

            const gridSize = 60;
            const cols = Math.ceil(canvas.width / gridSize) + 1;
            const rows = Math.ceil(canvas.height / gridSize) + 1;

            // Draw grid lines
            ctx.lineWidth = 0.5;

            for (let i = 0; i < cols; i++) {
                const x = i * gridSize;
                const wave = Math.sin(time + i * 0.15) * 0.3 + 0.7;
                ctx.strokeStyle = `rgba(212, 175, 55, ${0.03 * wave})`;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }

            for (let j = 0; j < rows; j++) {
                const y = j * gridSize;
                const wave = Math.sin(time + j * 0.15) * 0.3 + 0.7;
                ctx.strokeStyle = `rgba(212, 175, 55, ${0.03 * wave})`;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // Draw intersection dots
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * gridSize;
                    const y = j * gridSize;
                    const pulse = Math.sin(time * 2 + i * 0.3 + j * 0.3) * 0.5 + 0.5;
                    const radius = 1 + pulse * 0.8;
                    const alpha = 0.06 + pulse * 0.06;

                    ctx.fillStyle = `rgba(212, 175, 55, ${alpha})`;
                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            // Floating accent particles
            for (let p = 0; p < 15; p++) {
                const px = ((Math.sin(time * 0.7 + p * 2.1) + 1) / 2) * canvas.width;
                const py = ((Math.cos(time * 0.5 + p * 1.7) + 1) / 2) * canvas.height;
                const particleAlpha = Math.sin(time + p) * 0.03 + 0.04;
                const particleRadius = 2 + Math.sin(time * 2 + p) * 1;

                ctx.fillStyle = `rgba(212, 175, 55, ${particleAlpha})`;
                ctx.beginPath();
                ctx.arc(px, py, particleRadius, 0, Math.PI * 2);
                ctx.fill();
            }

            animationId = requestAnimationFrame(draw);
        };

        draw();
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    // Using simple mix-blend-screen prevents the gold grid from creating a dark overlay in light mode
    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0 mix-blend-screen opacity-80"
        />
    );
}
