import { type FileInputConfig } from '../types/types.js';

const fileInputDefaultsConfig: FileInputConfig = {
  multiple: false,
  maxFiles: 10,
  maxSizeBytes: 20_971_520,
  minSizeBytes: 0,
  accept: {
    'image/png': ['.png'],
    'image/jpg': ['.jpg'],
    'image/jpeg': ['.jpeg'],
    'image/bmp': ['.bmp'],
    'image/webp': ['.webp'],
  },
};

export { fileInputDefaultsConfig };
