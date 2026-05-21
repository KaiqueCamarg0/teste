/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { Account, Account as AccountType } from './types';
import { AccountForm } from './components/AccountForm';
import { AccountList } from './components/AccountList';
import { SummaryCard } from './components/SummaryCard';
import { Wallet, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [accounts, setAccounts] = useState<AccountType[]>(() => {
    const saved = localStorage.getItem('contas-a-pagar-v1');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('contas-a-pagar-v1', JSON.stringify(accounts));
  }, [accounts]);

  const summary = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    return {
      total: accounts.filter(a => !a.paid).reduce((acc, curr) => acc + curr.amount, 0),
      today: accounts.filter(a => !a.paid && new Date(a.dueDate).setHours(0,0,0,0) === today).reduce((acc, curr) => acc + curr.amount, 0),
      paid: accounts.filter(a => a.paid).reduce((acc, curr) => acc + curr.amount, 0),
      expired: accounts.filter(a => !a.paid && new Date(a.dueDate).getTime() < today).reduce((acc, curr) => acc + curr.amount, 0)
    };
  }, [accounts]);

  const handleAddAccount = (newAccount: Omit<AccountType, 'id' | 'createdAt' | 'paid'>) => {
    const account: AccountType = {
      ...newAccount,
      id: crypto.randomUUID(),
      paid: false,
      createdAt: Date.now(),
    };
    setAccounts(prev => [...prev, account]);
  };

  const handleTogglePaid = (id: string) => {
    setAccounts(prev => prev.map(a => 
      a.id === id ? { ...a, paid: !a.paid } : a
    ));
  };

  const handleDeleteAccount = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta conta?')) {
      setAccounts(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100">
      <nav className="h-14 bg-slate-900 flex items-center justify-between px-6 shrink-0 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold leading-none">$</div>
          <h1 className="text-white font-semibold text-lg tracking-tight">
            FinTrack Pro <span className="text-slate-400 font-normal text-sm ml-1">/ Contas a Pagar</span>
          </h1>
        </div>
        <div className="flex items-center gap-6 text-slate-400 text-sm">
          <span className="border-b-2 border-blue-500 text-white h-14 flex items-center cursor-default pt-0.5">Visão Geral</span>
          <span className="hover:text-white cursor-pointer transition-colors">Relatórios</span>
          <span className="hover:text-white cursor-pointer transition-colors">Configurações</span>
          <div className="w-8 h-8 bg-slate-700 rounded-full border border-slate-600 flex items-center justify-center overflow-hidden">
            <span className="text-[10px] text-slate-300 font-bold">ADM</span>
          </div>
        </div>
      </nav>

      <div className="flex gap-4 p-4 shrink-0 overflow-x-auto">
        <SummaryCard 
          title="Total Pendente" 
          value={summary.total} 
          icon={TrendingUp} 
          color="text-slate-800"
          className="flex-1 min-w-[200px]"
        />
        <SummaryCard 
          title="Vencendo Hoje" 
          value={summary.today} 
          icon={AlertCircle} 
          color="text-slate-800"
          accentColor="border-l-4 border-l-amber-500"
          className="flex-1 min-w-[200px]"
        />
        <SummaryCard 
          title="Atrasados" 
          value={summary.expired} 
          icon={AlertCircle} 
          color="text-red-600"
          accentColor="border-l-4 border-l-red-500"
          className="flex-1 min-w-[200px]"
        />
        <SummaryCard 
          title="Pago no Mês" 
          value={summary.paid} 
          icon={CheckCircle2} 
          color="text-emerald-600"
          accentColor="border-l-4 border-l-emerald-500"
          className="flex-1 min-w-[200px]"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 px-4 pb-4 flex-grow overflow-hidden">
        <div className="flex-grow overflow-hidden">
          <AccountList 
            accounts={accounts} 
            onTogglePaid={handleTogglePaid} 
            onDelete={handleDeleteAccount} 
          />
        </div>
        
        <aside className="w-full lg:w-[340px] shrink-0 h-full overflow-y-auto">
          <AccountForm onAdd={handleAddAccount} />
          
          <div className="mt-4 bg-slate-900 rounded-lg p-4 text-white">
            <div className="text-[10px] uppercase font-medium text-slate-500 mb-2">Dica Financeira</div>
            <p className="text-xs leading-relaxed text-slate-300">
              Contas liquidadas no vencimento evitam juros e mantêm o score bancário elevado.
            </p>
          </div>
        </aside>
      </div>

      <footer className="h-8 bg-slate-200 border-t border-slate-300 px-4 flex items-center justify-between text-[10px] text-slate-500 shrink-0 font-mono">
        <div className="flex gap-4">
          <div>STATUS DO SERVIDOR: <span className="text-emerald-600 font-bold">ONLINE</span></div>
          <div>USUÁRIO: ADM_FINANCEIRO</div>
        </div>
        <div>SESSÃO EXPIRA EM: 24:00:00</div>
      </footer>
    </div>
  );
}

