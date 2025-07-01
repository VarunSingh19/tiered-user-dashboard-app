
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'superadmin' | 'admin' | 'team-leader' | 'tester' | 'client';
  parentId: string | null;
  isTemporaryPassword?: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface UserStats {
  totalAdmins: number;
  totalTeamLeaders: number;
  totalTesters: number;
  totalClients: number;
  usersByRole: Record<string, User[]>;
  hierarchyStats: Record<string, { teamLeaders: number; testers: number }>;
}
