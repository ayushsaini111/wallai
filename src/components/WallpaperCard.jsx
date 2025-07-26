"use client"
import { useState } from "react";
import { FaHeart, FaRegHeart, FaDownload, FaUserPlus, FaUserCheck } from "react-icons/fa";
import wallpaperService from "@/lib/appwrite/wallpaper.service";

const WallpaperCard = ({ wallpaper }) => {
  const [liked, setLiked] = useState(wallpaper.liked);
  const [likes, setLikes] = useState(wallpaper.likes);
  const [following, setFollowing] = useState(wallpaper.following);

  const handleLike = async () => {
    await wallpaperService.toggleLike(wallpaper.id);
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleFollow = async () => {
    await wallpaperService.toggleFollow(wallpaper.uploaderId);
    setFollowing(!following);
  };

  const handleDownload = () => {
    wallpaperService.download(wallpaper.imageUrl, wallpaper.title);
  };

  return (
    <div className="mb-4 break-inside-avoid rounded-lg overflow-hidden shadow hover:shadow-lg bg-white">
      <img src={wallpaper.imageUrl} alt={wallpaper.title} className="w-full object-cover" />
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={handleLike} className="text-pink-500 hover:text-pink-700">
            {liked ? <FaHeart /> : <FaRegHeart />}
          </button>
          <span>{likes}</span>
        </div>
        <button onClick={handleFollow} className="text-indigo-500 hover:text-indigo-700">
          {following ? <FaUserCheck /> : <FaUserPlus />}
        </button>
        <button onClick={handleDownload} className="text-green-500 hover:text-green-700">
          <FaDownload />
        </button>
      </div>
      <div className="p-2 text-xs text-gray-500 flex items-center gap-2">
        <img src={wallpaper.uploaderAvatar} alt="" className="w-6 h-6 rounded-full" />
        <span>{wallpaper.uploaderName}</span>
      </div>
    </div>
  );
};

export default WallpaperCard; 