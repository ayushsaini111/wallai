import { account } from './config';
import userService from './user.service';

class AuthService {
    // Google OAuth Login
    async loginWithGoogle() {
        try {
            // Start Google OAuth login
            await account.createOAuth2Session(
                'google',
                'http://localhost:3000/auth/google/callback',
                'http://localhost:3000/auth/login'
            );
        } catch (error) {
            console.error("AuthService :: loginWithGoogle :: error", error);
            throw error;
        }
    }

    // Handle Google OAuth callback
    async handleGoogleCallback() {
        try {
            // Get current session
            const session = await account.get();
            if (session) {
                // Save Google profile image
                const profileImage = await userService.saveGoogleProfileImage();
                return {
                    ...session,
                    profileImage
                };
            }
            return null;
        } catch (error) {
            console.error("AuthService :: handleGoogleCallback :: error", error);
            throw error;
        }
    }

    // Get current user
    async getCurrentUser() {
        try {
            const user = await account.get();
            // Get user preferences which include saved profile image
            const prefs = await account.getPrefs();
            return {
                ...user,
                profileImage: prefs.profileImage
            };
        } catch (error) {
            console.error("AuthService :: getCurrentUser :: error", error);
            return null;
        }
    }

    // Logout
    async logout() {
        try {
            return await account.deleteSession('current');
        } catch (error) {
            console.error("AuthService :: logout :: error", error);
            throw error;
        }
    }
}

const authService = new AuthService();
export default authService;
