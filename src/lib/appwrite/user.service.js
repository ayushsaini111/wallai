import { ID, Query } from 'appwrite';
import { account, storage } from './config';
import config from './config';

class UserService {
    // Get current user session
    async getCurrentUser() {
        try {
            return await account.get();
        } catch (error) {
            console.error("UserService :: getCurrentUser :: error", error);
            throw error;
        }
    }

    // Get user's OAuth provider data (including Google profile)
    async getOAuthData() {
        try {
            const sessions = await account.listSessions();
            // Find the Google OAuth session
            const googleSession = sessions.sessions.find(
                session => session.provider === 'google'
            );

            if (googleSession) {
                // Get the provider data which includes profile image
                const userData = await account.getSession(googleSession.$id);
                return {
                    name: userData.providerAccessToken.name,
                    email: userData.providerAccessToken.email,
                    profileImage: userData.providerAccessToken.picture // Google profile image URL
                };
            }
            return null;
        } catch (error) {
            console.error("UserService :: getOAuthData :: error", error);
            throw error;
        }
    }

    // Update user preferences including profile image
    async updateUserPrefs(prefs) {
        try {
            return await account.updatePrefs(prefs);
        } catch (error) {
            console.error("UserService :: updateUserPrefs :: error", error);
            throw error;
        }
    }

    // Upload profile image to storage
    async uploadProfileImage(file) {
        try {
            // Create unique file ID
            const fileId = ID.unique();
            
            // Upload file to storage
            const uploadedFile = await storage.createFile(
                config.bucketId,
                fileId,
                file
            );

            // Get file preview URL
            const fileUrl = storage.getFilePreview(
                config.bucketId,
                fileId,
                400, // width
                400, // height
                'center', // gravity
                'crop', // crop mode
                100 // quality
            );

            // Save file URL to user preferences
            await this.updateUserPrefs({
                profileImage: fileUrl.href
            });

            return fileUrl.href;
        } catch (error) {
            console.error("UserService :: uploadProfileImage :: error", error);
            throw error;
        }
    }

    // Save Google profile image to user preferences
    async saveGoogleProfileImage() {
        try {
            const oauthData = await this.getOAuthData();
            if (oauthData?.profileImage) {
                // Save the profile image URL to user preferences
                await this.updateUserPrefs({
                    profileImage: oauthData.profileImage
                });
                return oauthData.profileImage;
            }
            return null;
        } catch (error) {
            console.error("UserService :: saveGoogleProfileImage :: error", error);
            throw error;
        }
    }
}

const userService = new UserService();
export default userService;
