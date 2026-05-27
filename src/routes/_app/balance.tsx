import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Scale, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_app/balance")({ component: Balance });

type Row = { amount: number; status: string; due_date: string; account_id: string | null };
type Account = { id: string; name: string; kind: "receita" | "despesa" };

const today = new Date();
const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().slice(0, 10);

function Balance() {
  const { user } = useAuth();
  const [from, setFrom] = useState(firstDay);
  const [to, setTo] = useState(lastDay);
  const [receivables, setReceivables] = useState<Row[]>([]);
  const [payables, setPayables] = useState<Row[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [{ data: r }, { data: p }, { data: a }] = await Promise.all([
      supabase.from("receivables").select("amount, status, due_date, account_id").gte("due_date", from).lte("due_date", to),
      supabase.from("payables").select("amount, status, due_date, account_id").gte("due_date", from).lte("due_date", to),
      supabase.from("chart_accounts").select("id, name, kind"),
    ]);
    setReceivables((r as Row[]) ?? []);
    setPayables((p as Row[]) ?? []);
    setAccounts((a as Account[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { if (user) load(); }, [user, from, to]);

  const totals = useMemo(() => {
    const recPago = receivables.filter((i) => i.status === "pago").reduce((s, i) => s + Number(i.amount), 0);
    const recPend = receivables.filter((i) => i.status === "pendente").reduce((s, i) => s + Number(i.amount), 0);
    const payPago = payables.filter((i) => i.status === "pago").reduce((s, i) => s + Number(i.amount), 0);
    const payPend = payables.filter((i) => i.status === "pendente").reduce((s, i) => s + Number(i.amount), 0);
    return { recPago, recPend, payPago, payPend, resultRealizado: recPago - payPago, resultPrevisto: (recPago + recPend) - (payPago + payPend) };
  }, [receivables, payables]);

  const byAccount = useMemo(() => {
    const groups: Record<string, { name: string; kind: string; total: number }> = {};
    const acct = (id: string | null) => accounts.find((a) => a.id === id);
    receivables.forEach((r) => {
      const a = acct(r.account_id);
      const key = a?.id ?? "sem";
      groups[key] = groups[key] ?? { name: a?.name ?? "Sem categoria", kind: "receita", total: 0 };
      groups[key].total += Number(r.amount);
    });
    payables.forEach((p) => {
      const a = acct(p.account_id);
      const key = (a?.id ?? "sem") + "-d";
      groups[key] = groups[key] ?? { name: a?.name ?? "Sem categoria", kind: "despesa", total: 0 };
      groups[key].total += Number(p.amount);
    });
    return Object.values(groups);
  }, [receivables, payables, accounts]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold">Balancete</h1>
        <p className="text-sm text-muted-foreground">Resultado financeiro do período.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <div><Label className="text-xs">De</Label><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
        <div><Label className="text-xs">Até</Label><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></div>
      </div>

      {loading ? <div className="text-muted-foreground">Carregando...</div> : (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card icon={TrendingUp} label="Receitas recebidas" value={totals.recPago} color="text-emerald-600" />
            <Card icon={TrendingUp} label="A receber" value={totals.recPend} color="text-emerald-500/70" />
            <Card icon={TrendingDown} label="Despesas pagas" value={totals.payPago} color="text-red-600" />
            <Card icon={TrendingDown} label="A pagar" value={totals.payPend} color="text-red-500/70" />
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-2 text-muted-foreground"><Wallet className="h-4 w-4" /> Resultado realizado</div>
              <div className={`mt-2 font-display text-3xl font-bold ${totals.resultRealizado >= 0 ? "text-emerald-600" : "text-destructive"}`}>R$ {totals.resultRealizado.toFixed(2)}</div>
            </div>
            <div className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-2 text-muted-foreground"><Scale className="h-4 w-4" /> Resultado previsto</div>
              <div className={`mt-2 font-display text-3xl font-bold ${totals.resultPrevisto >= 0 ? "text-emerald-600" : "text-destructive"}`}>R$ {totals.resultPrevisto.toFixed(2)}</div>
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-display text-xl font-semibold">Por conta</h2>
            <div className="overflow-hidden rounded-xl border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                  <tr><th className="px-4 py-2">Conta</th><th className="px-4 py-2">Tipo</th><th className="px-4 py-2 text-right">Total</th></tr>
                </thead>
                <tbody>
                  {byAccount.length === 0 ? <tr><td colSpan={3} className="px-4 py-6 text-center text-muted-foreground">Sem lançamentos no período</td></tr> :
                    byAccount.map((g, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-4 py-2">{g.name}</td>
                        <td className="px-4 py-2 capitalize">{g.kind}</td>
                        <td className={`px-4 py-2 text-right font-semibold ${g.kind === "receita" ? "text-emerald-600" : "text-destructive"}`}>R$ {g.total.toFixed(2)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Card({ icon: Icon, label, value, color }: { icon: typeof Scale; label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2 text-xs text-muted-foreground"><Icon className="h-4 w-4" /> {label}</div>
      <div className={`mt-1 font-display text-xl font-bold ${color}`}>R$ {value.toFixed(2)}</div>
    </div>
  );
}
