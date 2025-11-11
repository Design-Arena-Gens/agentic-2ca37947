"use client";
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Header({ role }: { role: 'admin' | 'client' }) {
  const [name] = useState('Adalberto Alves');
  const [subtitle] = useState('Personal Dog Training');
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    const p = localStorage.getItem('profile_photo');
    if (p) setPhoto(p);
  }, []);

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      setPhoto(data);
      localStorage.setItem('profile_photo', data);
    };
    reader.readAsDataURL(file);
  };

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <header className="border-b border-white/10 sticky top-0 z-30 bg-black/30 backdrop-blur">
      <div className="container-max py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-neonOrange shadow-neonOrange">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="Foto" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-neonBlue to-neonOrange" />
            )}
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight">{name}</div>
            <div className="text-neonBlue/90 font-medium">{subtitle}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {role === 'admin' && (
            <label className="btn bg-white/10 text-white cursor-pointer">
              Trocar Foto
              <input type="file" accept="image/*" className="hidden" onChange={onPhotoChange} />
            </label>
          )}
          <button onClick={logout} className="btn btn-orange">Sair</button>
        </div>
      </div>
    </header>
  );
}
