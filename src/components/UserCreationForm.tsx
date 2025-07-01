
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserCreationFormProps {
  allowedRoles: string[];
  onUserCreated?: () => void;
}

const UserCreationForm: React.FC<UserCreationFormProps> = ({ allowedRoles, onUserCreated }) => {
  const { assignRole, user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const result = await assignRole({
      ...formData,
      role: formData.role as any,
      parentId: user?.id || null
    });
    
    if (result.success) {
      setFormData({ name: '', email: '', password: '', role: '' });
      onUserCreated?.();
    }
    
    setIsSubmitting(false);
  };

  const getRoleDisplayName = (role: string) => {
    return role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create New User</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password">Temporary Password</Label>
            <Input 
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {allowedRoles.map(role => (
                  <SelectItem key={role} value={role}>
                    {getRoleDisplayName(role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" disabled={isSubmitting || !formData.role} className="w-full">
            {isSubmitting ? 'Creating...' : 'Create User'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserCreationForm;
