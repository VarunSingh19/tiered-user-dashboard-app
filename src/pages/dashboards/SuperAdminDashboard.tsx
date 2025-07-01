
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import UserCreationForm from '../../components/UserCreationForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, UserCheck, Zap, UserPlus } from 'lucide-react';

const SuperAdminDashboard: React.FC = () => {
  const { getUserStats, getAllUsers } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  
  const stats = getUserStats();
  const allUsers = getAllUsers();

  const handleUserCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <Icon className={`h-8 w-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout title="SuperAdmin Dashboard">
      <div className="space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Admins" 
            value={stats.totalAdmins} 
            icon={Shield} 
            color="text-blue-600"
          />
          <StatCard 
            title="Total Team Leaders" 
            value={stats.totalTeamLeaders} 
            icon={UserCheck} 
            color="text-green-600"
          />
          <StatCard 
            title="Total Testers" 
            value={stats.totalTesters} 
            icon={Zap} 
            color="text-purple-600"
          />
          <StatCard 
            title="Total Clients" 
            value={stats.totalClients} 
            icon={Users} 
            color="text-orange-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create User Form */}
          <div>
            <div className="flex items-center mb-4">
              <UserPlus className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold">Create New User</h2>
            </div>
            <UserCreationForm 
              allowedRoles={['admin', 'team-leader', 'tester', 'client']}
              onUserCreated={handleUserCreated}
            />
          </div>

          {/* Hierarchy Overview */}
          <div>
            <h2 className="text-xl font-semibold mb-4">User Hierarchy</h2>
            <Card>
              <CardHeader>
                <CardTitle>Organization Structure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.usersByRole.admin?.map((admin: any) => (
                  <div key={admin.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="font-medium">{admin.name} (Admin)</div>
                    <div className="text-sm text-gray-600">
                      {stats.hierarchyStats[admin.id]?.teamLeaders || 0} Team Leaders, {' '}
                      {stats.hierarchyStats[admin.id]?.testers || 0} Testers
                    </div>
                  </div>
                ))}
                
                <div className="border-l-4 border-orange-500 pl-4">
                  <div className="font-medium text-gray-700">Independent Clients</div>
                  <div className="text-sm text-gray-600">{stats.totalClients} registered</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* All Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Role</th>
                    <th className="text-left p-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map(user => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{user.name}</td>
                      <td className="p-2 text-gray-600">{user.email}</td>
                      <td className="p-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs capitalize">
                          {user.role.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="p-2 text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SuperAdminDashboard;
