'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { FocoQueimada } from '@/lib/types';

export type { FocoQueimada };

const CENTRO: [number, number] = [-16.35, -49.5]; // centro geográfico de Goiás
const URL_TILES = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

const ICONE = {
    html: '<div style="background:#ef4444;width:12px;height:12px;border-radius:50%;border:2px solid #ffffff;box-shadow:0 0 8px rgba(239,68,68,0.8);"></div>',
    iconSize: [12, 12] as [number, number],
    className: '',
};

function escapeHtml(v: unknown): string {
    return String(v ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/**
 * Mapa de focos de queimadas (Leaflet puro, sem react-leaflet).
 *
 * O react-leaflet cria o mapa no callback de ref, mas o destrui (`map.remove()`)
 * em cleanup de efeito. Quando o React re-executa só os efeitos (dev/StrictMode,
 * prefetch do Next 16, HMR), o mapa ficava destruído e os filhos tentavam
 * adicionar camadas a ele → "this.getPane() é undefined" (Map.remove() zera
 * `_panes`). Aqui criação e destruição vivem no MESMO par de efeitos, então o
 * mapa sempre renasce antes de qualquer camada ser adicionada.
 */
export default function MapaQueimadas({ focos }: { focos: FocoQueimada[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const camadaRef = useRef<L.LayerGroup | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || mapRef.current) return;

        const map = L.map(container, {
            center: CENTRO,
            zoom: 7,
            attributionControl: false,
        });
        L.tileLayer(URL_TILES).addTo(map);
        const camada = L.layerGroup().addTo(map);

        mapRef.current = map;
        camadaRef.current = camada;

        return () => {
            map.remove(); // zera _panes/_layers — por isso não pode sobreviver ao efeito
            mapRef.current = null;
            camadaRef.current = null;
        };
    }, []);

    useEffect(() => {
        const camada = camadaRef.current;
        if (!camada) return;

        camada.clearLayers();
        for (const f of focos) {
            const popup =
                `<div class="p-1 font-sans text-xs space-y-1">` +
                `<strong class="text-destructive font-semibold">Foco Satélite: ${escapeHtml(f.satelite)}</strong>` +
                `<div>Brilho: <span class="font-mono">${escapeHtml(f.brilho)}</span></div>` +
                `<div class="text-muted-foreground">${escapeHtml(f.dataHora)}</div>` +
                `</div>`;

            L.marker([f.latitude, f.longitude], { icon: L.divIcon(ICONE) })
                .bindPopup(popup)
                .addTo(camada);
        }
    }, [focos]);

    return (
        <div className="relative h-[440px] w-full overflow-hidden rounded-xl border border-border/80 shadow-inner">
            <div ref={containerRef} className="h-full w-full bg-card" />

            {focos.length === 0 && (
                <div className="pointer-events-none absolute bottom-4 left-4 z-[1000] rounded-lg border border-border/80 bg-background/90 px-3 py-1.5 text-xs text-muted-foreground shadow-md backdrop-blur-sm">
                    Nenhum foco de calor detectado nas últimas 24h.
                </div>
            )}
        </div>
    );
}
