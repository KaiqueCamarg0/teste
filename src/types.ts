export interface Account {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  category: string;
  paid: boolean;
  createdAt: number;
}

export type Category = 'Aluguel' | 'Energia' | 'Água' | 'Internet' | 'Lazer' | 'Alimentação' | 'Saúde' | 'Outros';

export const CATEGORIES: Category[] = [
  'Aluguel',
  'Energia',
  'Água',
  'Internet',
  'Lazer',
  'Alimentação',
  'Saúde',
  'Outros'
];
