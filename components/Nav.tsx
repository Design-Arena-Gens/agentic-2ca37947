"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function Nav({ role }: { role: 'admin' | 'client' }) {
  const pathname = usePathname();
  const item = (href: string, label: string) => (
    <Link href={href as any} className={clsx('btn', pathname.startsWith(href) ? 'btn-primary' : 'bg-white/10 text-white')}>{label}</Link>
  );
  return (
    <nav className="container-max py-4 flex flex-wrap gap-2">
      {item('/dashboard', 'In?cio')}
      {item('/gallery', 'Galeria')}
      {item('/notifications', 'Notifica??es')}
      {role === 'admin' && item('/clients', 'Clientes')}
      {role === 'admin' && item('/payments', 'Pagamentos')}
    </nav>
  );
}
