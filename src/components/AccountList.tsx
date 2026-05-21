import { useState } from 'react';
import { Account, Category, CATEGORIES } from '@/src/types';
import { AccountItem } from './AccountItem';
import { AnimatePresence, motion } from 'motion/react';
import { Search } from 'lucide-react';

interface AccountListProps {
  accounts: Account[];
  onTogglePaid: (id: string) => void;
  onDelete: (id: string) => void;
}

export function AccountList({ accounts, onTogglePaid, onDelete }: AccountListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'Todos'>('Todos');
  const [statusFilter, setStatusFilter] = useState<'Todas' | 'Pendentes' | 'Pagas'>('Todas');

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch = account.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'Todos' || account.category === filterCategory;
    const matchesStatus = 
      statusFilter === 'Todas' || 
      (statusFilter === 'Pendentes' && !account.paid) || 
      (statusFilter === 'Pagas' && account.paid);
    
    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="bg-white border border-slate-200 rounded-lg flex flex-col overflow-hidden h-full">
      <div className="bg-slate-50 border-b border-slate-200 p-3 flex flex-wrap justify-between items-center gap-3">
        <h2 className="font-bold text-slate-700 text-sm italic">Lista de Lançamentos</h2>
        
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
            <input
              type="text"
              placeholder="Filtrar contas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-[10px] border border-slate-300 pl-7 pr-2 py-1 rounded w-32 md:w-48 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="text-[10px] border border-slate-300 px-2 py-1 rounded bg-white outline-none"
          >
            <option value="Todos">Todas Categorias</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-[10px] border border-slate-300 px-2 py-1 rounded bg-white outline-none"
          >
            <option value="Todas">Status</option>
            <option value="Pendentes">Pendentes</option>
            <option value="Pagas">Pagas</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-50 border-b border-slate-200 flex px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        <div className="flex-shrink-0 w-4 mr-3"></div>
        <div className="w-[100px]">Vencimento</div>
        <div className="flex-grow">Descrição</div>
        <div className="w-[120px]">Categoria</div>
        <div className="w-[120px] text-right">Valor</div>
        <div className="w-[100px] text-right">Status</div>
      </div>

      <div className="overflow-y-auto max-h-[600px]">
        <AnimatePresence initial={false}>
          {filteredAccounts.length > 0 ? (
            filteredAccounts.map((account) => (
              <AccountItem
                key={account.id}
                account={account}
                onTogglePaid={onTogglePaid}
                onDelete={onDelete}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-slate-400 text-xs italic"
            >
              Nenhum lançamento encontrado.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
