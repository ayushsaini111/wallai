'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Simulate checking auth on mount
    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            
            // For now, just set loading to false after a brief delay
            // Later we'll add real Appwrite auth checking
            setTimeout(() => {
                console.log('Auth check completed - no user found');
                setUser(null);
                setLoading(false);
            }, 1000);
        };

        checkAuth();
    }, []);

    const loginWithGoogle = async () => {
        try {
            setLoading(true);
            console.log('Google login initiated');
            
            // For now, just simulate login
            setTimeout(() => {
                console.log('Google login completed');
                setLoading(false);
            }, 2000);
            
        } catch (error) {
            console.error('Google login failed:', error);
            setLoading(false);
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            setUser(null);
            console.log('User logged out');
            return { success: true };
        } catch (error) {
            console.error('Logout failed:', error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const updateUser = (userData) => {
        setUser(prevUser => ({
            ...prevUser,
            ...userData
        }));
    };

    const value = {
        user,
        loading,
        loginWithGoogle,
        logout,
        setUser,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;