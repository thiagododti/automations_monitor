import { useState, useRef } from 'react';

export function useUserPhotoUpload() {
    const [photoFile, setPhotoFile] = useState<File | undefined>(undefined);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetPhoto = () => {
        setPhotoFile(undefined);
        setPhotoPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return {
        photoFile,
        setPhotoFile,
        photoPreview,
        setPhotoPreview,
        fileInputRef,
        resetPhoto,
    };
}
