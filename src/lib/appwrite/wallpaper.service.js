import { ID, Query } from 'appwrite';
import { databases } from './config';
import config from './config';


class WallpaperService {
    // Create wallpaper
    async createWallpaper({ title, description, imageUrl, category, tags = [], owner }) {
        try {
            return await databases.createDocument(
                config.databaseId,
                config.collections.wallpapers,
                ID.unique(),
                {
                    title,
                    description,
                    imageUrl,
                    category,
                    tags,
                    owner,
                    likes: 0,
                    favorites: 0,
                    createdAt: new Date().toISOString()
                }
            );
        } catch (error) {
            console.error("WallpaperService :: createWallpaper :: error", error);
            throw error;
        }
    }

    // Get all wallpapers with filtering and search
    async getWallpapers({ search = '', category = '', page = 1, limit = 12 }) {
        try {
            let queries = [
                Query.limit(limit),
                Query.offset((page - 1) * limit),
                Query.orderDesc('createdAt')
            ];

            // Add search query if provided
            if (search) {
                queries.push(Query.search('title', search));
            }

            // Add category filter if provided
            if (category) {
                queries.push(Query.equal('category', category));
            }

            return await databases.listDocuments(
                config.databaseId,
                config.collections.wallpapers,
                queries
            );
        } catch (error) {
            console.error("WallpaperService :: getWallpapers :: error", error);
            throw error;
        }
    }

    // Get trending wallpapers
    async getTrendingWallpapers(limit = 10) {
        try {
            return await databases.listDocuments(
                config.databaseId,
                config.collections.wallpapers,
                [
                    Query.orderDesc('likes'),
                    Query.limit(limit)
                ]
            );
        } catch (error) {
            console.error("WallpaperService :: getTrendingWallpapers :: error", error);
            throw error;
        }
    }

    // Get wallpaper by ID
    async getWallpaper(wallpaperId) {
        try {
            return await databases.getDocument(
                config.databaseId,
                config.collections.wallpapers,
                wallpaperId
            );
        } catch (error) {
            console.error("WallpaperService :: getWallpaper :: error", error);
            throw error;
        }
    }

    // Get wallpapers by owner
    async getUserWallpapers(owner) {
        try {
            return await databases.listDocuments(
                config.databaseId,
                config.collections.wallpapers,
                [
                    Query.equal('owner', owner),
                    Query.orderDesc('createdAt')
                ]
            );
        } catch (error) {
            console.error("WallpaperService :: getUserWallpapers :: error", error);
            throw error;
        }
    }

    // Delete wallpaper
    async deleteWallpaper(wallpaperId) {
        try {
            return await databases.deleteDocument(
                config.databaseId,
                config.collections.wallpapers,
                wallpaperId
            );
        } catch (error) {
            console.error("WallpaperService :: deleteWallpaper :: error", error);
            throw error;
        }
    }

    // Update wallpaper
    async updateWallpaper(wallpaperId, { title, description, category, tags, imageUrl, owner }) {
        try {
            // First check if wallpaper exists
            await this.getWallpaper(wallpaperId);
            
            return await databases.updateDocument(
                config.databaseId,
                config.collections.wallpapers,
                wallpaperId,
                {
                    title,
                    description,
                    category,
                    tags,
                    imageUrl,
                    ...(owner && { owner }) // Only update owner if provided
                }
            );
        } catch (error) {
            console.error("WallpaperService :: updateWallpaper :: error", error);
            throw error;
        }
    }
}

const wallpaperService = new WallpaperService();
export default wallpaperService;
