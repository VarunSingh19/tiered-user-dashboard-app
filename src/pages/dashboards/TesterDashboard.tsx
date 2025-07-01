
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar, Shield } from 'lucide-react';

const TesterDashboard: React.FC = () => {
  const { user, getAllUsers } = useAuth();
  
  const allUsers = getAllUsers();
  const myTeamLeader = allUsers.find(u => u.id === user?.parentId);
  const myAdmin = allUsers.find(u => u.id === myTeamLeader?.parentId);

  return (
    <Layout title="Tester Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Welcome back, {user?.name}!
                </h2>
                <p className="text-gray-600">Ready to test some amazing features today?</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="text-lg font-semibold">{user?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-800">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Role</label>
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  Tester
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Member Since</label>
                <p className="text-gray-800 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Team Hierarchy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Team Hierarchy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {myAdmin && (
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="font-medium text-blue-900">{myAdmin.name}</div>
                  <div className="text-sm text-blue-600">Admin</div>
                </div>
              )}
              
              {myTeamLeader && (
                <div className="border-l-4 border-green-500 pl-4 ml-4">
                  <div className="font-medium text-green-900">{myTeamLeader.name}</div>
                  <div className="text-sm text-green-600">Team Leader</div>
                </div>
              )}
              
              <div className="border-l-4 border-purple-500 pl-4 ml-8">
                <div className="font-medium text-purple-900">{user?.name}</div>
                <div className="text-sm text-purple-600">Tester (You)</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Testing Tasks Section */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Tasks Assigned Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Your testing tasks will appear here once your team leader assigns them to you. 
                Check back later or contact your team leader for more information.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TesterDashboard;
