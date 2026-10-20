'use client';

import { useState } from 'react';
import { OrganizacaoFilter } from './organizacao-filter';
import { RelatorioGrid } from './relatorio-grid';
import { RelatoriosHeader } from './relatorios-header';

export function RelatoriosView() {
    const [orgId, setOrgId] = useState<string>('');

    return (
        <div className="space-y-6">
            <RelatoriosHeader />
            <OrganizacaoFilter orgId={orgId} onChange={setOrgId} />
            <RelatorioGrid orgId={orgId} />
        </div>
    );
}
