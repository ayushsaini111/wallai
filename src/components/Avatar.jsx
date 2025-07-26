'use client';

import Image from 'next/image';

const Avatar = ({ user }) => {
    return (
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
            {user?.profileImage ? (
                <Image
                    src={user.profileImage}
                    alt={user.name || 'User avatar'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 40px) 100vw, 40px"
                />
            ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-xl uppercase">
                        {user?.name?.charAt(0) || '?'}
                    </span>
                </div>
            )}
        </div>
    );
};

export default Avatar;
