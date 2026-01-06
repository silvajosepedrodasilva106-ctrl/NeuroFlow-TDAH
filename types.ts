
export enum EnergyMode {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface ThemeConfig {
  primary: string;
  background: string;
  text: string;
  card: string;
}

export type AppTab = 'home' | 'chat' | 'diary' | 'learn' | 'regulator' | 'timer' | 'games';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  isMicro: boolean;
  parentId?: string;
  completedAt?: number; // Timestamp da conclusão
}

export interface Habit {
  id: string;
  title: string;
  completed: boolean;
  icon: string;
}
