'use client';

import { useAuth } from '@/context/AuthContext';
import ProfileImageUpload from '@/components/ProfileImageUpload';

const ProfilePage = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Please login to view your profile</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>
                    
                    {/* Profile Image Upload Component */}
                    <div className="mb-8">
                        <ProfileImageUpload />
                    </div>

                    {/* User Details */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-gray-600 text-sm">Name</label>
                            <p className="text-gray-900 font-medium">{user.name}</p>
                        </div>
                        <div>
                            <label className="text-gray-600 text-sm">Email</label>
                            <p className="text-gray-900 font-medium">{user.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
