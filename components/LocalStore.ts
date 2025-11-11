export type Client = { id: string; name: string; phone?: string; dogName?: string };
export type MediaItem = { id: string; url: string; type: 'image' | 'video'; title?: string; clientId?: string; createdAt: number; dataUrl?: string };
export type NotificationItem = { id: string; title: string; message: string; createdAt: number };
export type Payment = { id: string; clientName: string; description: string; amount: number; date: string };

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
}
function write<T>(key: string, value: T) {
  if (typeof window === 'undefined') return; localStorage.setItem(key, JSON.stringify(value));
}

export const store = {
  clients: {
    all(): Client[] { return read<Client[]>('clients', []); },
    save(list: Client[]) { write('clients', list); },
  },
  media: {
    all(): MediaItem[] { return read<MediaItem[]>('media', []); },
    save(list: MediaItem[]) { write('media', list); },
  },
  notifications: {
    all(): NotificationItem[] { return read<NotificationItem[]>('notifications', []); },
    save(list: NotificationItem[]) { write('notifications', list); },
  },
  payments: {
    all(): Payment[] { return read<Payment[]>('payments', []); },
    save(list: Payment[]) { write('payments', list); },
  }
};
