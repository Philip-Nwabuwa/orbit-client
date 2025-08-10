import { FileImage, FileText, FileVideo, FileAudio, File, FileSpreadsheet, Archive, FileCode, FileX } from 'lucide-react';

export interface FileTypeConfig {
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  category: 'image' | 'document' | 'video' | 'audio' | 'code' | 'archive' | 'other';
}

export const FILE_TYPE_CONFIG: Record<string, FileTypeConfig> = {
  // Images
  png: {
    icon: FileImage,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    category: 'image'
  },
  jpg: {
    icon: FileImage,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    category: 'image'
  },
  jpeg: {
    icon: FileImage,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    category: 'image'
  },
  gif: {
    icon: FileImage,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    category: 'image'
  },
  webp: {
    icon: FileImage,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    category: 'image'
  },
  svg: {
    icon: FileImage,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    category: 'image'
  },

  // Documents
  pdf: {
    icon: FileText,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    category: 'document'
  },
  doc: {
    icon: FileText,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    category: 'document'
  },
  docx: {
    icon: FileText,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    category: 'document'
  },
  txt: {
    icon: FileText,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    category: 'document'
  },
  rtf: {
    icon: FileText,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    category: 'document'
  },

  // Spreadsheets
  xls: {
    icon: FileSpreadsheet,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    category: 'document'
  },
  xlsx: {
    icon: FileSpreadsheet,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    category: 'document'
  },
  csv: {
    icon: FileSpreadsheet,
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    category: 'document'
  },

  // Videos
  mp4: {
    icon: FileVideo,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    category: 'video'
  },
  avi: {
    icon: FileVideo,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    category: 'video'
  },
  mov: {
    icon: FileVideo,
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    category: 'video'
  },
  mkv: {
    icon: FileVideo,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    category: 'video'
  },
  webm: {
    icon: FileVideo,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    category: 'video'
  },

  // Audio
  mp3: {
    icon: FileAudio,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    category: 'audio'
  },
  wav: {
    icon: FileAudio,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    category: 'audio'
  },
  flac: {
    icon: FileAudio,
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    category: 'audio'
  },
  aac: {
    icon: FileAudio,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    category: 'audio'
  },

  // Code files
  js: {
    icon: FileCode,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    category: 'code'
  },
  ts: {
    icon: FileCode,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    category: 'code'
  },
  tsx: {
    icon: FileCode,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    category: 'code'
  },
  jsx: {
    icon: FileCode,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    category: 'code'
  },
  html: {
    icon: FileCode,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    category: 'code'
  },
  css: {
    icon: FileCode,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    category: 'code'
  },
  json: {
    icon: FileCode,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    category: 'code'
  },
  xml: {
    icon: FileCode,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    category: 'code'
  },

  // Archives
  zip: {
    icon: Archive,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    category: 'archive'
  },
  rar: {
    icon: Archive,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    category: 'archive'
  },
  '7z': {
    icon: Archive,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    category: 'archive'
  },
  tar: {
    icon: Archive,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    category: 'archive'
  },

  // Default/Unknown
  default: {
    icon: File,
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    category: 'other'
  }
};

/**
 * Get file type configuration based on file extension
 */
export function getFileTypeConfig(fileName: string): FileTypeConfig {
  const extension = fileName.toLowerCase().split('.').pop();
  return FILE_TYPE_CONFIG[extension || 'default'] || FILE_TYPE_CONFIG.default;
}

/**
 * Extract file extension from filename
 */
export function getFileExtension(fileName: string): string {
  return fileName.toLowerCase().split('.').pop() || '';
}

/**
 * Check if file type is an image
 */
export function isImageFile(fileName: string): boolean {
  const config = getFileTypeConfig(fileName);
  return config.category === 'image';
}

/**
 * Check if file type is a video
 */
export function isVideoFile(fileName: string): boolean {
  const config = getFileTypeConfig(fileName);
  return config.category === 'video';
}

/**
 * Check if file type supports preview
 */
export function canPreviewFile(fileName: string): boolean {
  const config = getFileTypeConfig(fileName);
  return config.category === 'image' || config.category === 'video';
}

/**
 * Get readable file type name
 */
export function getFileTypeName(fileName: string): string {
  const extension = getFileExtension(fileName);
  return extension.toUpperCase();
}