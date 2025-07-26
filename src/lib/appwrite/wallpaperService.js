import { storage, databases } from './config';
import config from './config';
import { ID, Query } from 'appwrite';

class WallpaperService {
  async uploadWallpaper(file) {
    try {
      const uploadedFile = await storage.createFile(
        config.bucketId,
        ID.unique(),
        file
      );
      
      return uploadedFile;
    } catch (error) {
      throw error;
    }
  }

  async getWallpapers(page = 1, limit = 12) {
    try {
      const offset = (page - 1) * limit;
      const response = await storage.listFiles(
        config.bucketId,
        [
          Query.orderDesc('$createdAt'),
          Query.limit(limit),
          Query.offset(offset)
        ]
      );
      
      return response.files.map(file => ({
        id: file.$id,
        name: file.name,
        url: storage.getFilePreview(
          config.bucketId,
          file.$id,
          2000,
          2000,
          'center',
          100
        ).href,
        width: file.width || 1920,
        height: file.height || 1080,
        createdAt: file.$createdAt,
      }));
    } catch (error) {
      console.error("Error fetching wallpapers:", error);
      return [];
    }
  }

  async deleteWallpaper(fileId) {
    try {
      await storage.deleteFile(config.bucketId, fileId);
      return true;
    } catch (error) {
      console.error("Error deleting wallpaper:", error);
      return false;
    }
  }

  getFilePreview(fileId, width = 2000, height = 2000) {
    return storage.getFilePreview(
      config.bucketId,
      fileId,
      width,
      height,
      'center',
      100
    ).href;
  }

  async getWallpaperStats(wallpaperId) {
    try {
      const [likes, favorites] = await Promise.all([
        databases.listDocuments(
          config.databaseId,
          config.collections.likes,
          [Query.equal('wallpaperId', wallpaperId)]
        ),
        databases.listDocuments(
          config.databaseId,
          config.collections.favorites,
          [Query.equal('wallpaperId', wallpaperId)]
        )
      ]);

      return {
        likes: likes.total,
        favorites: favorites.total
      };
    } catch (error) {
      console.error("Error fetching wallpaper stats:", error);
      return { likes: 0, favorites: 0 };
    }
  }
}

const wallpaperService = new WallpaperService();
export default wallpaperService;
