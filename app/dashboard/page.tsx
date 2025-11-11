import Header from '@/components/Header';
import Nav from '@/components/Nav';
import { getSession } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await getSession();
  const role = (session?.role ?? 'client') as 'admin' | 'client';
  return (
    <div>
      <Header role={role} />
      <Nav role={role} />
      <main className="container-max py-6 grid gap-4 md:grid-cols-2">
        <section className="card p-6">
          <h2 className="text-lg font-semibold mb-2">Bem-vindo</h2>
          <p className="text-white/80">Use os bot?es acima para acessar a galeria, notifica??es e, se for administrador, gerenciar clientes e pagamentos.</p>
        </section>
        <section className="card p-6">
          <h2 className="text-lg font-semibold mb-2">Atalhos r?pidos</h2>
          <div className="flex flex-wrap gap-2">
            <a href="/gallery" className="btn btn-primary">Ir para Galeria</a>
            <a href="/notifications" className="btn btn-orange">Ver Notifica??es</a>
            {role === 'admin' && <a href="/clients" className="btn bg-white/10 text-white">Gerenciar Clientes</a>}
            {role === 'admin' && <a href="/payments" className="btn bg-white/10 text-white">Registrar Pagamento</a>}
          </div>
        </section>
      </main>
    </div>
  );
}
