"use client";

import { motion } from "framer-motion";

interface SparklineProps {
    data?: number[];
    color?: string;
    width?: number;
    height?: number;
}

export default function Sparkline({
    data,
    color = "#10b981",
    width = 120,
    height = 32,
}: SparklineProps) {
    // Generate smooth random data if none provided
    const chartData = data || generateData();

    const min = Math.min(...chartData);
    const max = Math.max(...chartData);
    const range = max - min || 1;

    const points = chartData.map((val, i) => {
        const x = (i / (chartData.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
    });

    const linePath = `M ${points.join(" L ")}`;
    const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

    return (
        <motion.svg
            width={width}
            height={height}
            className="overflow-visible"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
        >
            <defs>
                <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <motion.path
                d={areaPath}
                fill={`url(#grad-${color})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            />
            <motion.path
                d={linePath}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            />
        </motion.svg>
    );
}

function generateData(): number[] {
    const data: number[] = [];
    let val = 50 + Math.random() * 30;
    for (let i = 0; i < 12; i++) {
        val += (Math.random() - 0.45) * 8;
        val = Math.max(20, Math.min(95, val));
        data.push(Math.round(val));
    }
    return data;
}
