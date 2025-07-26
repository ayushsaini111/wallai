"use client";
import React, { useEffect, useState } from "react";
import { storage } from "@/lib/appwrite/config";
import config from "@/lib/appwrite/config";
import Image from "next/image";

const WallpaperGallery = () => {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallpapers = async () => {
      try {
        const response = await storage.listFiles(config.bucketId);
        const wallpaperData = await Promise.all(response.files.map(async (file) => {
          const fileUrl = `${config.appwriteUrl}/storage/buckets/${config.bucketId}/files/${file.$id}/view?project=${config.appwriteProjectId}`;
          return {
            id: file.$id,
            name: file.name,
            url: fileUrl,
            width: file.width || 1920,
            height: file.height || 1080
          };
        }));
        setWallpapers(wallpaperData);
      } catch (error) {
        console.error("❌ Failed to load wallpapers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWallpapers();
  }, []);

  if (loading) {
    return <div>Loading wallpapers...</div>;
  }

  return (
    <div className="columns-1 sm:columns-2 md:columns-3  mt-20 lg:columns-3 gap-4 p-4">
      {wallpapers.map(wp => (
        <div key={wp.id} className="mb-4 break-inside-avoid rounded-lg overflow-hidden shadow hover:shadow-lg bg-white">
          {wp.url ? (
            <Image
              src={wp.url}
              alt={wp.name}
              width={wp.width}
              height={wp.height}
              className="w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
          <div className="p-2 text-xs text-gray-500">{wp.name}</div>
        </div>
      ))}
    </div>
  );
};

export default WallpaperGallery; 