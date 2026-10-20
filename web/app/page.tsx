import { redirect } from 'next/navigation';

/** Rota raiz — a guarda do proxy já decide; aqui apenas despacha. */
export default function Home() {
    redirect('/dashboard');
}
