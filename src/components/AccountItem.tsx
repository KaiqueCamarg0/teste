import { Account } from '@/src/types';
import { CheckCircle2, Circle, Trash2, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface AccountItemProps {
  account: Account;
  onTogglePaid: (id: string) => void;
  onDelete: (id: string) => void;
  key?: string | number;
}

export function AccountItem({ account, onTogglePaid, onDelete }: AccountItemProps) {
  const isExpired = !account.paid && new Date(account.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "group flex items-center gap-3 px-4 py-2 text-xs border-b border-slate-100 transition-colors",
        account.paid 
          ? "bg-slate-50/50" 
          : isExpired 
            ? "bg-red-50 hover:bg-red-100/50" 
            : "bg-white hover:bg-slate-50"
      )}
    >
      <button
        onClick={() => onTogglePaid(account.id)}
        className={cn(
          "flex-shrink-0 transition-colors",
          account.paid ? "text-emerald-500" : "text-slate-300 hover:text-blue-500"
        )}
      >
        {account.paid ? <CheckCircle2 size={16} /> : <Circle size={16} />}
      </button>

      <div className="w-[100px] font-mono whitespace-nowrap">
        <span className={cn(
          isExpired && !account.paid ? "text-red-600 font-bold" : "text-slate-500"
        )}>
          {format(parseISO(account.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
        </span>
      </div>

      <div className="flex-grow min-w-0">
        <h3 className={cn(
          "font-medium truncate",
          account.paid ? "text-slate-400 line-through" : "text-slate-700"
        )}>
          {account.description}
        </h3>
      </div>

      <div className="w-[120px]">
        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
          {account.category}
        </span>
      </div>

      <div className="w-[120px] text-right font-bold font-mono">
        <span className={cn(
          account.paid ? "text-slate-400" : isExpired ? "text-red-600" : "text-slate-900"
        )}>
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(account.amount)}
        </span>
      </div>

      <div className="w-[100px] flex justify-end gap-2">
        {account.paid ? (
          <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-bold">PAGO</span>
        ) : isExpired ? (
          <span className="bg-red-200 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-bold">ATRASADO</span>
        ) : (
          <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-bold">PENDENTE</span>
        )}
        
        <button
          onClick={() => onDelete(account.id)}
          className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all ml-1"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
}
