import React from 'react';

export interface Strategy {
  id?: number;
  user_id?: string;
  name: string;
  duration: number;
  pac: number;
  frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'custom';
  customDays?: number;
  currentCapital: number;
  performance: number;
  status: 'active' | 'paused';
  target: number;
  reinvest: boolean;
  createdAt?: string;
}

export interface Trade {
  id?: number;
  user_id?: string;
  date: string;
  strategyId: number;
  type: 'Sell Put' | 'Sell Call';
  strike: number;
  size: number;
  premium: number;
  btcPrice: number;
  status: 'Open' | 'Expired' | 'Assigned';
  isWarrantyTriggered: boolean;
  bonusAmount?: number;
  notes?: string;
}

export interface DashboardData {
  capitaleTotale: number;
  capitaleTotaleVariazione: number;
  btcAccumulato: number;
  btcAccumulatoVariazione: number;
  premioMedio30gg: number;
  giorniAFreedom: number;
  bonusAccumulati: number;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
}

export interface CourseModule {
  id: number;
  title: string;
  duration: string;
  lessons: Lesson[];
}

export type ViewState = 'dashboard' | 'strategy' | 'journal' | 'warranty' | 'telegram' | 'academy' | 'profile';

export interface NavItem {
  id: ViewState;
  label: string;
  icon: React.ReactNode;
}