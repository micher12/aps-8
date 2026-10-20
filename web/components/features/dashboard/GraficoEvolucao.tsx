'use client';

import { Line } from 'react-chartjs-2';
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
    Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const CORES: Record<string, { line: string; bg: string }> = {
    AGUA: { line: '#12805c', bg: 'rgba(18, 128, 92, 0.08)' },
    ENERGIA: { line: '#b7791f', bg: 'rgba(183, 121, 31, 0.08)' },
    CO2: { line: '#5b6b7a', bg: 'rgba(91, 107, 122, 0.08)' },
};

const ROTULOS: Record<string, string> = {
    AGUA: 'Água (m³)',
    ENERGIA: 'Energia (kWh)',
    CO2: 'CO₂ (kg)',
};

export default function GraficoEvolucao({
    historico,
}: {
    historico: { mes: string; tipo: string; valor: number }[];
}) {
    const meses = [...new Set(historico.map((h) => h.mes))].sort();
    const tipos = ['AGUA', 'ENERGIA', 'CO2'];

    const datasets = tipos.map((tipo) => ({
        label: ROTULOS[tipo],
        data: meses.map(
            (mes) => historico.find((h) => h.mes === mes && h.tipo === tipo)?.valor ?? null,
        ),
        borderColor: CORES[tipo].line,
        backgroundColor: CORES[tipo].bg,
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointBackgroundColor: CORES[tipo].line,
        pointBorderColor: '#0f172a',
        pointBorderWidth: 2,
        pointRadius: 3.5,
        pointHoverRadius: 6,
    }));

    return (
        <div className="h-[280px] w-full">
            <Line
                data={{ labels: meses, datasets }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: '#6b7c72',
                                boxWidth: 12,
                                boxHeight: 12,
                                borderRadius: 3,
                                useBorderRadius: true,
                                font: {
                                    size: 12,
                                    family: 'inherit',
                                },
                            },
                        },
                        tooltip: {
                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                            titleColor: '#f8fafc',
                            bodyColor: '#e2e8f0',
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            borderWidth: 1,
                            padding: 10,
                            boxPadding: 4,
                            cornerRadius: 8,
                        },
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: '#64748b',
                                font: { size: 11, family: 'inherit' },
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.05)',
                            },
                        },
                        y: {
                            ticks: {
                                color: '#64748b',
                                font: { size: 11, family: 'inherit' },
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.05)',
                            },
                        },
                    },
                }}
            />
        </div>
    );
}
