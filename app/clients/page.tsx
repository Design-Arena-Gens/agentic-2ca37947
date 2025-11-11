"use client";
import Header from '@/components/Header';
import Nav from '@/components/Nav';
import { useEffect, useState } from 'react';
import { store, type Client } from '@/components/LocalStore';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dogName, setDogName] = useState('');

  useEffect(() => { setClients(store.clients.all()); }, []);

  const add = () => {
    if (!name.trim()) return;
    const c: Client = { id: crypto.randomUUID(), name: name.trim(), phone, dogName };
    const next = [c, ...clients];
    setClients(next); store.clients.save(next);
    setName(''); setPhone(''); setDogName('');
  };

  const remove = (id: string) => {
    const next = clients.filter(c => c.id !== id);
    setClients(next); store.clients.save(next);
  };

  return (
    <div>
      <Header role="admin" />
      <Nav role="admin" />
      <main className="container-max py-6 space-y-6">
        <div className="card p-6 grid md:grid-cols-4 gap-3">
          <div>
            <label className="label">Nome</label>
            <input className="input" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Cliente" />
          </div>
          <div>
            <label className="label">Telefone</label>
            <input className="input" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="(xx) xxxxx-xxxx" />
          </div>
          <div>
            <label className="label">Nome do c?o</label>
            <input className="input" value={dogName} onChange={(e)=>setDogName(e.target.value)} placeholder="Ex: Thor" />
          </div>
          <div className="flex items-end">
            <button onClick={add} className="btn btn-primary w-full">Adicionar</button>
          </div>
        </div>

        <div className="grid gap-3">
          {clients.map(c => (
            <div key={c.id} className="card p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-white/60 text-sm">{c.dogName || '?'} ? {c.phone || '?'}</div>
              </div>
              <button onClick={()=>remove(c.id)} className="btn bg-white/10 text-white">Remover</button>
            </div>
          ))}
          {clients.length === 0 && <div className="text-white/60">Sem clientes cadastrados.</div>}
        </div>
      </main>
    </div>
  );
}
