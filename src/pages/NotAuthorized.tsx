
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';

const NotAuthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <Shield className="h-24 w-24 text-red-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-xl text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-700">
            Please contact your administrator if you believe this is an error.
          </p>
          
          <Button 
            onClick={() => navigate(-1)}
            className="bg-red-600 hover:bg-red-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorized;
