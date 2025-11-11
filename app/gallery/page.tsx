"use client";
import Header from '@/components/Header';
import Nav from '@/components/Nav';
import { useEffect, useMemo, useState } from 'react';
import { store, MediaItem } from '@/components/LocalStore';

function useRole(): 'admin' | 'client' {
  // quick heuristic: admin has photo button in header anyway; allow all features for admin-only actions guarded by UI
  const [role, setRole] = useState<'admin' | 'client'>('client');
  useEffect(() => {
    // middleware already guards; keep client default
    const r = sessionStorage.getItem('role');
    if (r === 'admin' || r === 'client') setRole(r);
  }, []);
  return role;
}

export default function GalleryPage() {
  const role = useRole();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [filter, setFilter] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [clientId, setClientId] = useState('');

  useEffect(() => {
    setItems(store.media.all());
  }, []);

  const filtered = useMemo(() => {
    return items.filter(i => (filter ? (i.clientId || '') === filter : true));
  }, [items, filter]);

  const handleAdd = async () => {
    if (!url && !file) return;
    let finalUrl = url;
    let dataUrl: string | undefined = undefined;
    let type: 'image' | 'video' = 'image';
    if (file) {
      const reader = new FileReader();
      const data: string = await new Promise((resolve) => { reader.onload = () => resolve(reader.result as string); reader.readAsDataURL(file); });
      dataUrl = data;
      finalUrl = data;
      type = file.type.startsWith('video') ? 'video' : 'image';
    } else if (url) {
      type = url.match(/(mp4|webm|ogg)$/i) ? 'video' : 'image';
    }

    const newItem: MediaItem = {
      id: crypto.randomUUID(),
      url: finalUrl,
      dataUrl,
      type,
      title,
      clientId: clientId || undefined,
      createdAt: Date.now(),
    };
    const next = [newItem, ...items];
    setItems(next);
    store.media.save(next);
    setTitle(''); setUrl(''); setFile(null); setClientId('');
  };

  const remove = (id: string) => {
    const next = items.filter(i => i.id !== id);
    setItems(next);
    store.media.save(next);
  };

  const clients = store.clients.all();

  return (
    <div>
      <Header role={role} />
      <Nav role={role} />
      <main className="container-max py-6 space-y-6">
        {role === 'admin' && (
          <div className="card p-6 space-y-3">
            <h2 className="text-lg font-semibold">Adicionar m?dia</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="label">T?tulo (opcional)</label>
                <input className="input" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Ex: Passeio no parque" />
              </div>
              <div>
                <label className="label">Cliente (opcional)</label>
                <select className="input" value={clientId} onChange={(e)=>setClientId(e.target.value)}>
                  <option value="">Todos</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label">URL (imagem ou v?deo)</label>
                <input className="input" value={url} onChange={(e)=>setUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <label className="label">ou Arquivo</label>
                <input className="input" type="file" accept="image/*,video/*" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
              </div>
            </div>
            <button onClick={handleAdd} className="btn btn-primary">Adicionar</button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <select className="input max-w-xs" value={filter} onChange={(e)=>setFilter(e.target.value)}>
            <option value="">Todos os clientes</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {filtered.map(item => (
            <div key={item.id} className="card overflow-hidden">
              {item.type === 'image' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt={item.title||''} className="w-full h-60 object-cover" />
              ) : (
                <video controls className="w-full h-60 object-cover">
                  <source src={item.url} />
                </video>
              )}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{item.title || 'Sem t?tulo'}</div>
                  <div className="text-white/60 text-sm">{item.clientId ? clients.find(c=>c.id===item.clientId)?.name : 'Todos'}</div>
                </div>
                {role === 'admin' && <button onClick={()=>remove(item.id)} className="btn bg-white/10 text-white">Remover</button>}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-white/60">Nenhuma m?dia ainda.</div>
          )}
        </div>
      </main>
    </div>
  );
}
