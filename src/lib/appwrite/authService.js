import { account } from './config';
import { ID } from 'appwrite';
import { cookies } from 'next/headers';

class AuthService {
  async createAccount({ email, password, name }) {
    try {
      const user = await account.create(
        ID.unique(),
        email,
        password,
        name
      );
      return user;
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      const session = await account.createEmailSession(email, password);
      return session;
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const user = await account.get();
      return user;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  }

  async logout() {
    try {
      await account.deleteSession('current');
      return true;
    } catch (error) {
      console.error("Error during logout:", error);
      return false;
    }
  }

  async updateProfile({ name, avatarUrl }) {
    try {
      const user = await account.updatePrefs({
        name,
        avatarUrl
      });
      return user;
    } catch (error) {
      throw error;
    }
  }
}

const authService = new AuthService();
export default authService;
