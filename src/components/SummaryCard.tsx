import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SummaryCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  className?: string;
}

export function SummaryCard({ title, value, icon: Icon, color, className }: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4", className)}
    >
      <div className={cn("p-3 rounded-xl", color)}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
        </p>
      </div>
    </motion.div>
  );
}
