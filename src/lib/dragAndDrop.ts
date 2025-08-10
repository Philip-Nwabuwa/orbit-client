export interface DragDropFile {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  file: File;
}

export interface DragDropCallbacks {
  onDragEnter?: (event: DragEvent) => void;
  onDragOver?: (event: DragEvent) => void;
  onDragLeave?: (event: DragEvent) => void;
  onDrop?: (files: DragDropFile[], event: DragEvent) => void;
}

/**
 * Convert FileList to our DragDropFile format
 */
export function convertFileListToDropFiles(fileList: FileList): DragDropFile[] {
  return Array.from(fileList).map((file) => ({
    id: `${file.name}-${file.size}-${file.lastModified}`,
    fileName: file.name,
    fileType: file.name.split('.').pop()?.toUpperCase() || 'FILE',
    fileSize: file.size,
    file
  }));
}

/**
 * Check if drag event contains files
 */
export function dragEventHasFiles(event: DragEvent): boolean {
  if (!event.dataTransfer) return false;
  
  return Array.from(event.dataTransfer.types).includes('Files') ||
         Array.from(event.dataTransfer.types).includes('application/x-moz-file');
}

/**
 * Setup drag and drop event handlers for an element
 */
export function setupDragAndDrop(
  element: HTMLElement,
  callbacks: DragDropCallbacks
): () => void {
  let dragCounter = 0;

  const handleDragEnter = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    dragCounter++;
    
    if (dragEventHasFiles(event) && callbacks.onDragEnter) {
      callbacks.onDragEnter(event);
    }
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
    
    if (dragEventHasFiles(event) && callbacks.onDragOver) {
      callbacks.onDragOver(event);
    }
  };

  const handleDragLeave = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    dragCounter--;
    
    if (dragCounter === 0 && callbacks.onDragLeave) {
      callbacks.onDragLeave(event);
    }
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    dragCounter = 0;
    
    if (event.dataTransfer?.files && callbacks.onDrop) {
      const files = convertFileListToDropFiles(event.dataTransfer.files);
      callbacks.onDrop(files, event);
    }
  };

  // Add event listeners
  element.addEventListener('dragenter', handleDragEnter);
  element.addEventListener('dragover', handleDragOver);
  element.addEventListener('dragleave', handleDragLeave);
  element.addEventListener('drop', handleDrop);

  // Return cleanup function
  return () => {
    element.removeEventListener('dragenter', handleDragEnter);
    element.removeEventListener('dragover', handleDragOver);
    element.removeEventListener('dragleave', handleDragLeave);
    element.removeEventListener('drop', handleDrop);
  };
}

/**
 * React hook for drag and drop functionality
 */
export function useDragAndDrop(callbacks: DragDropCallbacks) {
  const setupDragDrop = (element: HTMLElement | null) => {
    if (!element) return;
    return setupDragAndDrop(element, callbacks);
  };

  return { setupDragDrop };
}

/**
 * Validate dropped files (size, type restrictions)
 */
export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[]; // file extensions
  maxFiles?: number;
}

export interface FileValidationResult {
  validFiles: DragDropFile[];
  rejectedFiles: Array<{
    file: DragDropFile;
    reason: string;
  }>;
}

export function validateDroppedFiles(
  files: DragDropFile[], 
  options: FileValidationOptions = {}
): FileValidationResult {
  const {
    maxSize = 50 * 1024 * 1024, // 50MB default
    allowedTypes,
    maxFiles
  } = options;

  const result: FileValidationResult = {
    validFiles: [],
    rejectedFiles: []
  };

  // Check max files limit
  if (maxFiles && files.length > maxFiles) {
    files.slice(maxFiles).forEach(file => {
      result.rejectedFiles.push({
        file,
        reason: `Exceeds maximum file limit of ${maxFiles}`
      });
    });
    files = files.slice(0, maxFiles);
  }

  files.forEach(file => {
    // Check file size
    if (file.fileSize > maxSize) {
      result.rejectedFiles.push({
        file,
        reason: `File too large (max ${Math.round(maxSize / 1024 / 1024)}MB)`
      });
      return;
    }

    // Check file type
    if (allowedTypes && allowedTypes.length > 0) {
      const fileExt = file.fileName.split('.').pop()?.toLowerCase();
      if (!fileExt || !allowedTypes.includes(fileExt)) {
        result.rejectedFiles.push({
          file,
          reason: `File type not allowed (allowed: ${allowedTypes.join(', ')})`
        });
        return;
      }
    }

    result.validFiles.push(file);
  });

  return result;
}