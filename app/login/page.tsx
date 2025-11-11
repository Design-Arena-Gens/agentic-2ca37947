"use client";
import { useState } from 'react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const role = isAdmin ? 'admin' : 'client';
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, role }),
      });
      if (!res.ok) {
        throw new Error('Senha inv?lida');
      }
      const { redirectTo } = await res.json();
      sessionStorage.setItem('role', role);
      window.location.href = redirectTo || '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Erro ao entrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="container-max">
        <div className="mx-auto max-w-md card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-neonBlue to-neonOrange shadow-neonOrange" />
            <div>
              <div className="text-2xl font-extrabold">Adalberto Alves</div>
              <div className="text-white/70">Personal Dog Training</div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="flex gap-2 mb-2">
              <button type="button" onClick={() => setIsAdmin(true)} className={`btn ${isAdmin ? 'btn-orange' : 'bg-white/10 text-white'}`}>Administrador</button>
              <button type="button" onClick={() => setIsAdmin(false)} className={`btn ${!isAdmin ? 'btn-primary' : 'bg-white/10 text-white'}`}>Cliente</button>
            </div>

            <div>
              <label className="label">Senha</label>
              <input className="input" type="password" placeholder="Digite a senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <div className="text-red-400 text-sm">{error}</div>}
            <button className="btn btn-primary w-full disabled:opacity-60" disabled={loading}>
              {loading ? 'Entrando?' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
