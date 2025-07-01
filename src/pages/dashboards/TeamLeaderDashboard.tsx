
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import UserCreationForm from '../../components/UserCreationForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Users } from 'lucide-react';

const TeamLeaderDashboard: React.FC = () => {
  const { getAllUsers, user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  
  const allUsers = getAllUsers();
  
  // Get testers created by this team leader
  const myTesters = allUsers.filter(u => u.role === 'tester' && u.parentId === user?.id);

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
    <Layout title="Team Leader Dashboard">
      <div className="space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard 
            title="My Testers" 
            value={myTesters.length} 
            icon={Zap} 
            color="text-purple-600"
          />
          <StatCard 
            title="Team Size" 
            value={myTesters.length} 
            icon={Users} 
            color="text-blue-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create User Form */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Add Testers</h2>
            <UserCreationForm 
              allowedRoles={['tester']}
              onUserCreated={handleUserCreated}
            />
          </div>

          {/* Team Overview */}
          <div>
            <h2 className="text-xl font-semibold mb-4">My Testers</h2>
            <Card>
              <CardHeader>
                <CardTitle>Testing Team</CardTitle>
              </CardHeader>
              <CardContent>
                {myTesters.length > 0 ? (
                  <div className="space-y-3">
                    {myTesters.map(tester => (
                      <div key={tester.id} className="border-l-4 border-purple-500 pl-4">
                        <div className="font-medium">{tester.name}</div>
                        <div className="text-sm text-gray-600">{tester.email}</div>
                        <div className="text-xs text-gray-500">
                          Joined {new Date(tester.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No testers in your team yet. Add your first tester to get started!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Testers Table */}
        {myTesters.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Tester Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Name</th>
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myTesters.map(tester => (
                      <tr key={tester.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{tester.name}</td>
                        <td className="p-2 text-gray-600">{tester.email}</td>
                        <td className="p-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            Active
                          </span>
                        </td>
                        <td className="p-2 text-gray-600">
                          {new Date(tester.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default TeamLeaderDashboard;
