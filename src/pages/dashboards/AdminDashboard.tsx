
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import UserCreationForm from '../../components/UserCreationForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck, Zap, Users } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { getAllUsers, user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  
  const allUsers = getAllUsers();
  
  // Get users created by this admin
  const myTeamLeaders = allUsers.filter(u => u.role === 'team-leader' && u.parentId === user?.id);
  const myTesters = allUsers.filter(u => u.role === 'tester' && myTeamLeaders.some(tl => tl.id === u.parentId));

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
    <Layout title="Admin Dashboard">
      <div className="space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="My Team Leaders" 
            value={myTeamLeaders.length} 
            icon={UserCheck} 
            color="text-green-600"
          />
          <StatCard 
            title="Total Testers" 
            value={myTesters.length} 
            icon={Zap} 
            color="text-purple-600"
          />
          <StatCard 
            title="Team Size" 
            value={myTeamLeaders.length + myTesters.length} 
            icon={Users} 
            color="text-blue-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create User Form */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Create Team Members</h2>
            <UserCreationForm 
              allowedRoles={['team-leader', 'tester']}
              onUserCreated={handleUserCreated}
            />
          </div>

          {/* Team Overview */}
          <div>
            <h2 className="text-xl font-semibold mb-4">My Team</h2>
            <Card>
              <CardHeader>
                <CardTitle>Team Structure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {myTeamLeaders.map(teamLeader => {
                  const teamLeaderTesters = allUsers.filter(u => 
                    u.role === 'tester' && u.parentId === teamLeader.id
                  );
                  
                  return (
                    <div key={teamLeader.id} className="border-l-4 border-green-500 pl-4">
                      <div className="font-medium">{teamLeader.name} (Team Leader)</div>
                      <div className="text-sm text-gray-600">
                        {teamLeaderTesters.length} Testers
                      </div>
                      {teamLeaderTesters.length > 0 && (
                        <div className="ml-4 mt-2 space-y-1">
                          {teamLeaderTesters.map(tester => (
                            <div key={tester.id} className="text-sm text-gray-500">
                              • {tester.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {myTeamLeaders.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No team members yet. Create your first team leader to get started!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Members Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Team Members</CardTitle>
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
                  {[...myTeamLeaders, ...myTesters].map(member => (
                    <tr key={member.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{member.name}</td>
                      <td className="p-2 text-gray-600">{member.email}</td>
                      <td className="p-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs capitalize">
                          {member.role.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="p-2 text-gray-600">
                        {new Date(member.createdAt).toLocaleDateString()}
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

export default AdminDashboard;
