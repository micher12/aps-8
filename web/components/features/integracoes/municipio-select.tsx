'use client';

import { Loader2, MapPin } from 'lucide-react';
import type { Municipio } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MunicipioSelectProps {
    value: string;
    onChange: (codigoIbge: string) => void;
    municipios?: Municipio[];
    isFetching: boolean;
}

export function MunicipioSelect({ value, onChange, municipios, isFetching }: MunicipioSelectProps) {
    return (
        <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <Select value={value} onValueChange={(v) => onChange(v ?? '')}>
                <SelectTrigger className="h-9 w-full text-xs sm:w-64">
                    <SelectValue placeholder="Selecione o município…">
                        {municipios?.find((m) => String(m.codigoIbge) === value)?.nome ?? 'Selecione o município…'}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {municipios?.map((m) => (
                        <SelectItem key={m.codigoIbge} value={String(m.codigoIbge)}>
                            {m.nome}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {isFetching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
    );
}
