
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import PasswordChangeModal from '../components/PasswordChangeModal';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const result = await login(credentials.email, credentials.password);
    
    if (result.success) {
      if (result.needsPasswordChange) {
        setShowPasswordChange(true);
      } else {
        redirectToDashboard();
      }
    }
    
    setIsSubmitting(false);
  };

  const redirectToDashboard = () => {
    // This will be handled by the auth effect in App.tsx
    navigate('/');
  };

  const handleSuperAdminLogin = async () => {
    setIsSubmitting(true);
    await login('super@domain.com', 'superadmin123');
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">User Management System</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                />
              </div>
              
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            
            <Separator />
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                onClick={handleSuperAdminLogin}
                disabled={isSubmitting}
                className="w-full"
              >
                Login as SuperAdmin
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => navigate('/register')}
                className="w-full"
              >
                Register as Client
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <PasswordChangeModal 
        isOpen={showPasswordChange} 
        onClose={() => {
          setShowPasswordChange(false);
          redirectToDashboard();
        }} 
      />
    </div>
  );
};

export default Login;
