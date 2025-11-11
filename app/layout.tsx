import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Adalberto Alves | Personal Dog Training',
  description: 'Compartilhe fotos, v?deos e gerencie clientes',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        {children}
      </body>
    </html>
  );
}
