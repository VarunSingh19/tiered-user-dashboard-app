
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotAuthorized from "./pages/NotAuthorized";
import SuperAdminDashboard from "./pages/dashboards/SuperAdminDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import TeamLeaderDashboard from "./pages/dashboards/TeamLeaderDashboard";
import TesterDashboard from "./pages/dashboards/TesterDashboard";
import ClientDashboard from "./pages/dashboards/ClientDashboard";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Component to handle dashboard redirects
const DashboardRedirect = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log('Dashboard redirect - Auth state:', { isAuthenticated, user: user?.role });
  }, [isAuthenticated, user]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'superadmin':
      return <Navigate to="/dashboard/superadmin" replace />;
    case 'admin':
      return <Navigate to="/dashboard/admin" replace />;
    case 'team-leader':
      return <Navigate to="/dashboard/team-leader" replace />;
    case 'tester':
      return <Navigate to="/dashboard/tester" replace />;
    case 'client':
      return <Navigate to="/dashboard/client" replace />;
    default:
      return <Navigate to="/not-authorized" replace />;
  }
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/not-authorized" element={<NotAuthorized />} />
      <Route path="/" element={<DashboardRedirect />} />
      
      <Route 
        path="/dashboard/superadmin" 
        element={
          <ProtectedRoute allowedRoles={['superadmin']}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard/team-leader" 
        element={
          <ProtectedRoute allowedRoles={['team-leader']}>
            <TeamLeaderDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard/tester" 
        element={
          <ProtectedRoute allowedRoles={['tester']}>
            <TesterDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard/client" 
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <ClientDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
