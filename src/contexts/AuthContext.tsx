
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState } from '../types/User';
import { toast } from 'sonner';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; needsPasswordChange?: boolean }>;
  logout: () => void;
  registerClient: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  assignRole: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<{ success: boolean; message?: string }>;
  changePassword: (newPassword: string) => Promise<{ success: boolean }>;
  getAllUsers: () => User[];
  getUsersByRole: (role: string) => User[];
  getUserStats: () => any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial seeded data
const initialUsers: User[] = [
  {
    id: 'sup1',
    name: 'SuperAdmin',
    email: 'super@domain.com',
    password: 'superadmin123',
    role: 'superadmin',
    parentId: null,
    createdAt: new Date().toISOString()
  }
];

// Auth reducer
type AuthAction = 
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PASSWORD'; payload: string };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { user: null, isAuthenticated: false };
    case 'UPDATE_PASSWORD':
      if (state.user) {
        const updatedUser = { ...state.user, password: action.payload, isTemporaryPassword: false };
        return { ...state, user: updatedUser };
      }
      return state;
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null, isAuthenticated: false });

  // Load users from localStorage or use initial data
  const getStoredUsers = (): User[] => {
    const stored = localStorage.getItem('users');
    return stored ? JSON.parse(stored) : initialUsers;
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  // Load auth state from localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      if (authData.user) {
        dispatch({ type: 'LOGIN', payload: authData.user });
      }
    }
  }, []);

  // Save auth state to localStorage
  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(state));
  }, [state]);

  const login = async (email: string, password: string): Promise<{ success: boolean; needsPasswordChange?: boolean }> => {
    const users = getStoredUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      dispatch({ type: 'LOGIN', payload: user });
      toast.success(`Welcome back, ${user.name}!`);
      return { success: true, needsPasswordChange: user.isTemporaryPassword };
    }
    
    toast.error('Invalid credentials');
    return { success: false };
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('auth');
    toast.success('Logged out successfully');
  };

  const registerClient = async (name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const users = getStoredUsers();
    
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email already exists' };
    }

    const newUser: User = {
      id: `client_${Date.now()}`,
      name,
      email,
      password,
      role: 'client',
      parentId: null,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);
    
    // Auto-login after registration
    dispatch({ type: 'LOGIN', payload: newUser });
    toast.success('Account created successfully!');
    return { success: true };
  };

  const assignRole = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<{ success: boolean; message?: string }> => {
    const users = getStoredUsers();
    
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: 'Email already exists' };
    }

    const newUser: User = {
      ...userData,
      id: `${userData.role}_${Date.now()}`,
      createdAt: new Date().toISOString(),
      isTemporaryPassword: true
    };

    users.push(newUser);
    saveUsers(users);
    toast.success(`${userData.role} created successfully!`);
    return { success: true };
  };

  const changePassword = async (newPassword: string): Promise<{ success: boolean }> => {
    if (state.user) {
      const users = getStoredUsers();
      const updatedUsers = users.map(u => 
        u.id === state.user!.id 
          ? { ...u, password: newPassword, isTemporaryPassword: false }
          : u
      );
      saveUsers(updatedUsers);
      dispatch({ type: 'UPDATE_PASSWORD', payload: newPassword });
      toast.success('Password updated successfully!');
      return { success: true };
    }
    return { success: false };
  };

  const getAllUsers = () => getStoredUsers();

  const getUsersByRole = (role: string) => {
    return getStoredUsers().filter(u => u.role === role);
  };

  const getUserStats = () => {
    const users = getStoredUsers();
    
    const stats = {
      totalAdmins: users.filter(u => u.role === 'admin').length,
      totalTeamLeaders: users.filter(u => u.role === 'team-leader').length,
      totalTesters: users.filter(u => u.role === 'tester').length,
      totalClients: users.filter(u => u.role === 'client').length,
      usersByRole: {} as Record<string, User[]>,
      hierarchyStats: {} as Record<string, { teamLeaders: number; testers: number }>
    };

    // Group users by role
    users.forEach(user => {
      if (!stats.usersByRole[user.role]) {
        stats.usersByRole[user.role] = [];
      }
      stats.usersByRole[user.role].push(user);
    });

    // Calculate hierarchy stats
    users.filter(u => u.role === 'admin').forEach(admin => {
      const teamLeaders = users.filter(u => u.role === 'team-leader' && u.parentId === admin.id);
      const testers = users.filter(u => u.role === 'tester' && teamLeaders.some(tl => tl.id === u.parentId));
      
      stats.hierarchyStats[admin.id] = {
        teamLeaders: teamLeaders.length,
        testers: testers.length
      };
    });

    return stats;
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      registerClient,
      assignRole,
      changePassword,
      getAllUsers,
      getUsersByRole,
      getUserStats
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
