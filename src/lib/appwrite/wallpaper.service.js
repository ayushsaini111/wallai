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

    // Fetch all wallpapers (stub)
    async getAllWallpapers() {
        // TODO: Replace with Appwrite DB fetch
        return [
            {
                id: '1',
                imageUrl: '/sample1.jpg',
                title: 'Sample 1',
                uploaderId: 'user1',
                uploaderName: 'Alice',
                uploaderAvatar: '/avatar1.png',
                likes: 12,
                liked: false,
                following: false,
            },
            {
                id: '2',
                imageUrl: '/sample2.jpg',
                title: 'Sample 2',
                uploaderId: 'user2',
                uploaderName: 'Bob',
                uploaderAvatar: '/avatar2.png',
                likes: 8,
                liked: true,
                following: true,
            },
        ];
    }

    // Toggle like (stub)
    async toggleLike(wallpaperId) {
        // TODO: Integrate with Appwrite DB
        return true;
    }

    // Toggle follow (stub)
    async toggleFollow(uploaderId) {
        // TODO: Integrate with Appwrite DB
        return true;
    }

    // Download wallpaper (stub)
    download(imageUrl, title) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = title || 'wallpaper';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

const wallpaperService = new WallpaperService();
export default wallpaperService;
