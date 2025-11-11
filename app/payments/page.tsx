"use client";
import Header from '@/components/Header';
import Nav from '@/components/Nav';
import { useEffect, useRef, useState } from 'react';
import { store, type Payment } from '@/components/LocalStore';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('Aula de adestramento');
  const [amount, setAmount] = useState('100.00');
  const [date, setDate] = useState<string>(()=>new Date().toISOString().slice(0,10));
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{ setPayments(store.payments.all()); }, []);

  const add = () => {
    if (!clientName.trim()) return;
    const p: Payment = { id: crypto.randomUUID(), clientName: clientName.trim(), description, amount: parseFloat(amount), date };
    const next = [p, ...payments];
    setPayments(next); store.payments.save(next);
  };

  const printReceipt = (p: Payment) => {
    const w = window.open('', '_blank');
    if (!w) return;
    const html = `<!doctype html><html><head><meta charset='utf-8'><title>Comprovante</title>
      <style>body{font-family:ui-sans-serif,system-ui;padding:24px;background:#0b0f18;color:#fff} .card{background:#111827;padding:16px;border-radius:12px;border:1px solid rgba(255,255,255,.1)} .h{color:#12a8ff}</style>
    </head><body>
      <h1 class='h'>Comprovante de Pagamento</h1>
      <div class='card'>
        <div><strong>Cliente:</strong> ${p.clientName}</div>
        <div><strong>Descri??o:</strong> ${p.description}</div>
        <div><strong>Valor:</strong> R$ ${p.amount.toFixed(2)}</div>
        <div><strong>Data:</strong> ${new Date(p.date).toLocaleDateString('pt-BR')}</div>
        <div style='margin-top:12px;color:#ff7a12'>Adalberto Alves ? Personal Dog Training</div>
      </div>
      <script>window.print();</script>
    </body></html>`;
    w.document.write(html);
    w.document.close();
  };

  return (
    <div>
      <Header role="admin" />
      <Nav role="admin" />
      <main className="container-max py-6 space-y-6">
        <div className="card p-6 grid md:grid-cols-4 gap-3">
          <div>
            <label className="label">Cliente</label>
            <input className="input" value={clientName} onChange={(e)=>setClientName(e.target.value)} placeholder="Nome" />
          </div>
          <div>
            <label className="label">Descri??o</label>
            <input className="input" value={description} onChange={(e)=>setDescription(e.target.value)} />
          </div>
          <div>
            <label className="label">Valor (R$)</label>
            <input className="input" type="number" step="0.01" value={amount} onChange={(e)=>setAmount(e.target.value)} />
          </div>
          <div>
            <label className="label">Data</label>
            <input className="input" type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
          </div>
          <div className="md:col-span-4">
            <button onClick={add} className="btn btn-primary">Registrar pagamento</button>
          </div>
        </div>

        <div className="grid gap-3">
          {payments.map(p => (
            <div key={p.id} className="card p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{p.clientName}</div>
                <div className="text-white/60 text-sm">{p.description} ? R$ {p.amount.toFixed(2)} ? {new Date(p.date).toLocaleDateString('pt-BR')}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>printReceipt(p)} className="btn btn-orange">Comprovante</button>
              </div>
            </div>
          ))}
          {payments.length === 0 && <div className="text-white/60">Sem pagamentos registrados.</div>}
        </div>
      </main>
    </div>
  );
}
