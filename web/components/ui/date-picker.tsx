'use client';

import * as React from 'react';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

function isoParaData(iso: string): Date | undefined {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!m) return undefined;
    return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

function dataParaIso(d: Date): string {
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

interface DatePickerProps {
    value: string;
    onChange: (iso: string) => void;
    placeholder?: string;
    className?: string;
}

export function DatePicker({ value, onChange, placeholder = 'Selecione a data…', className }: DatePickerProps) {
    const [aberto, setAberto] = React.useState(false);
    const selecionada = isoParaData(value);

    return (
        <Popover open={aberto} onOpenChange={setAberto}>
            <PopoverTrigger
                render={
                    <Button
                        variant="outline"
                        className={cn(
                            'h-9 w-full justify-start gap-2 px-3 text-sm font-normal',
                            !selecionada && 'text-muted-foreground',
                            className,
                        )}
                    />
                }
            >
                <CalendarIcon className="h-4 w-4 shrink-0" />
                {selecionada ? selecionada.toLocaleDateString('pt-BR') : placeholder}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    locale={ptBR}
                    selected={selecionada}
                    defaultMonth={selecionada}
                    onSelect={(dia) => {
                        onChange(dia ? dataParaIso(dia) : '');
                        setAberto(false);
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}
