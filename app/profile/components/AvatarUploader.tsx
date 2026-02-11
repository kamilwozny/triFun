'use client';

import { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import Image from 'next/image';
import { UploadButton } from '@/components/uploadButton/UploadButton';

interface AvatarUploaderProps {
  img: string | null;
  defaultImg: string | null;
}

export const AvatarUploader = ({ img, defaultImg }: AvatarUploaderProps) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    defaultImg ?? img,
  );
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
      </div>
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          console.log('Files: ', res);
          alert('Upload Completed');
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
    </div>
  );
};
