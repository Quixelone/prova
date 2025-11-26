import { DashboardData, Strategy, Trade, CourseModule } from './types';

export const MOCK_DASHBOARD: DashboardData = {
  capitaleTotale: 12847.50,
  capitaleTotaleVariazione: 12.5,
  btcAccumulato: 0.1342,
  btcAccumulatoVariazione: 8.2,
  premioMedio30gg: 0.11,
  giorniAFreedom: 892,
  bonusAccumulati: 47.30
};

export const MOCK_STRATEGIES: Strategy[] = [
  { id: 1, name: "Conservative Growth", duration: 3, pac: 500, frequency: "monthly", currentCapital: 8500, performance: 12.5, status: "active", target: 0.10, reinvest: true, createdAt: "2024-01-15" },
  { id: 2, name: "Aggressive 15Y", duration: 15, pac: 1000, frequency: "weekly", currentCapital: 4347.50, performance: 15.2, status: "active", target: 0.25, reinvest: true, createdAt: "2024-06-20" }
];

export const MOCK_TRADES: Trade[] = [
  { id: 101, date: "2025-11-21", strategyId: 1, type: 'Sell Put', strike: 95000, size: 0.1, premium: 11.40, btcPrice: 97450, status: 'Open', isWarrantyTriggered: false, notes: "Standard entry" },
  { id: 102, date: "2025-11-20", strategyId: 2, type: 'Sell Put', strike: 94500, size: 0.05, premium: 15.20, btcPrice: 96800, status: 'Expired', isWarrantyTriggered: false, notes: "" }
];

export const COURSE_MODULES: CourseModule[] = [
  { id: 1, title: "Fondamenti Opzioni BTC", duration: "2 settimane", lessons: [{ id: "1.1", title: "Cosa sono le opzioni", duration: "15 min", completed: true, locked: false }, { id: "1.2", title: "Put vs Call", duration: "20 min", completed: true, locked: false }] }
];

export const GROWTH_DATA = [{ name: 'Jan', value: 5000 }, { name: 'Feb', value: 5600 }];
export const ALLOCATION_DATA = [{ name: 'USDT Cash', value: 45 }, { name: 'BTC Held', value: 35 }, { name: 'Pending Options', value: 20 }];
export const SAFETY_SCORE_DATA = [{ name: 'Safety', value: 88, fill: '#A855F7' }];