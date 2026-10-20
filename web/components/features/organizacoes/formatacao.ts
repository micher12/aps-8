export function formatarCnpj(cnpj?: string | null): string {
    if (!cnpj) return '—';
    const limpo = cnpj.replace(/\D/g, '');
    if (limpo.length !== 14) return cnpj;
    return limpo.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}
