import { Droplets, Gauge, Zap } from 'lucide-react';
import type { TipoMonitoramento } from '@/lib/types';

export const ROTULOS: Record<
    TipoMonitoramento,
    { label: string; unidade: string; icon: typeof Droplets; cor: string }
> = {
    AGUA: { label: 'Consumo de Água', unidade: 'm³', icon: Droplets, cor: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
    ENERGIA: { label: 'Energia Elétrica', unidade: 'kWh', icon: Zap, cor: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    CO2: { label: 'Emissões de CO₂', unidade: 'kg', icon: Gauge, cor: 'text-primary bg-primary/10 border-primary/20' },
};

export const OPCOES_INDICADOR: { value: TipoMonitoramento; label: string }[] = [
    { value: 'AGUA', label: 'Água (m³)' },
    { value: 'ENERGIA', label: 'Energia (kWh)' },
    { value: 'CO2', label: 'CO₂ (kg)' },
];
