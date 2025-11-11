"use client";
import Header from '@/components/Header';
import Nav from '@/components/Nav';
import { useEffect, useState } from 'react';
import { store, type NotificationItem } from '@/components/LocalStore';

function RoleWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(()=>{
    setItems(store.notifications.all());
    // try to infer from last choice; not critical
    const lastRole = sessionStorage.getItem('role');
    setIsAdmin(lastRole !== 'client');
  }, []);

  const add = () => {
    if (!title.trim()) return;
    const n: NotificationItem = { id: crypto.randomUUID(), title: title.trim(), message, createdAt: Date.now() };
    const next = [n, ...items];
    setItems(next); store.notifications.save(next);
    setTitle(''); setMessage('');
  };

  const remove = (id: string) => {
    const next = items.filter(i => i.id !== id);
    setItems(next); store.notifications.save(next);
  };

  return (
    <div>
      <Header role={isAdmin ? 'admin' : 'client'} />
      <Nav role={isAdmin ? 'admin' : 'client'} />
      <main className="container-max py-6 space-y-6">
        {isAdmin && (
          <div className="card p-6 grid gap-3">
            <h2 className="text-lg font-semibold">Nova notifica??o</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="label">T?tulo</label>
                <input className="input" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Ex: Pr?xima aula" />
              </div>
              <div>
                <label className="label">Mensagem</label>
                <input className="input" value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Texto" />
              </div>
            </div>
            <button onClick={add} className="btn btn-primary max-w-xs">Enviar</button>
          </div>
        )}

        <div className="grid gap-3">
          {items.map(n => (
            <div key={n.id} className="card p-4 flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{n.title}</div>
                <div className="text-white/80">{n.message}</div>
                <div className="text-white/50 text-sm">{new Date(n.createdAt).toLocaleString('pt-BR')}</div>
              </div>
              {isAdmin && <button onClick={()=>remove(n.id)} className="btn bg-white/10 text-white">Remover</button>}
            </div>
          ))}
          {items.length === 0 && <div className="text-white/60">Sem notifica??es.</div>}
        </div>
      </main>
    </div>
  );
}
