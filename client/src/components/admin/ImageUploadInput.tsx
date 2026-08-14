import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, Cloud, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImage } from '../../services/uploadService';

interface ImageUploadInputProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  aspectRatio?: 'video' | 'square' | 'wide' | 'auto';
  className?: string;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  label = 'Image / Thumbnail',
  value,
  onChange,
  folder = 'mohitdecodes/uploads',
  placeholder = 'https://... or upload from system',
  required = false,
  helpText,
  aspectRatio = 'video',
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WebP, SVG)');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error('Image size must be less than 8MB');
      return;
    }

    setUploading(true);
    setImageError(false);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
      toast.success('Image uploaded to cloud storage successfully!');
    } catch (err: any) {
      console.error('Image upload failed:', err);
      toast.error(err?.message || 'Failed to upload image. Please try again or paste image URL.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    setImageError(false);
  };

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square max-w-[120px]'
      : aspectRatio === 'wide'
      ? 'aspect-[21/9] max-h-48'
      : aspectRatio === 'video'
      ? 'aspect-video max-h-44'
      : 'max-h-44';

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label and Storage status */}
      <div className="flex items-center justify-between gap-2">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 dark:text-purple-400">
          <Cloud size={12} />
          <span>Cloud Storage</span>
        </span>
      </div>

      {/* Input + Upload Button Row */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setImageError(false);
          }}
          placeholder={placeholder}
          required={required}
          className="input flex-1 text-sm font-medium"
        />

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Upload Button */}
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="btn-primary py-2.5 px-4 rounded-xl font-bold text-xs inline-flex items-center gap-2 shrink-0 bg-purple-600 hover:bg-purple-700 text-white border-none shadow-md cursor-pointer disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload size={15} />
              <span>Upload Image</span>
            </>
          )}
        </button>
      </div>

      {/* Live Preview Box */}
      {value && (
        <div className="relative group/preview mt-2 rounded-2xl overflow-hidden border border-slate-200 dark:border-dark-700 bg-slate-100 dark:bg-dark-800/80 p-2 flex items-center gap-3">
          <div className={`relative rounded-xl overflow-hidden bg-slate-200 dark:bg-dark-900 border border-slate-300 dark:border-dark-700 shrink-0 ${aspectClass}`}>
            {!imageError ? (
              <img
                src={value}
                alt="Preview"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center text-slate-400">
                <ImageIcon size={20} className="mb-1" />
                <span className="text-[10px]">Preview unavailable</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 pr-8">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              {value.startsWith('data:') ? 'Local preview data' : value}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <Check size={12} />
              <span>Ready for save</span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            title="Remove Image"
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {helpText && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
          {helpText}
        </p>
      )}
    </div>
  );
};

export default ImageUploadInput;
