
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar, ShoppingBag, BarChart3 } from 'lucide-react';

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();

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
    <Layout title="Client Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Welcome, {user?.name}!
                </h2>
                <p className="text-gray-600">Manage your account and view your activity</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Active Orders" 
            value="0" 
            icon={ShoppingBag} 
            color="text-green-600"
          />
          <StatCard 
            title="Total Orders" 
            value="0" 
            icon={BarChart3} 
            color="text-blue-600"
          />
          <StatCard 
            title="Account Status" 
            value="Active" 
            icon={User} 
            color="text-orange-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <p className="text-lg font-semibold">{user?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email Address</label>
                <p className="text-gray-800">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Account Type</label>
                <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                  Client
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

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Activity</h3>
                <p className="text-gray-600">
                  Your recent orders and activities will appear here.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Section */}
        <Card>
          <CardHeader>
            <CardTitle>Available Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                <ShoppingBag className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Product Catalog</h3>
                <p className="text-gray-600 text-sm">Browse our extensive product range</p>
              </div>
              
              <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Analytics</h3>
                <p className="text-gray-600 text-sm">View your usage and order analytics</p>
              </div>
              
              <div className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                <User className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Support</h3>
                <p className="text-gray-600 text-sm">Get help from our support team</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ClientDashboard;
