// Types for Azure Blob Storage integration

export interface AzureBlobConfig {
  connectionString: string;
  containerName: string;
  pollingInterval: number; // in minutes
  isEnabled: boolean;
}

export interface BlobMetadata {
  name: string;
  contentType: string;
  lastModified: string;
  etag: string;
  size: number;
}

export type FileType = 'csv' | 'json' | 'xml' | 'txt' | 'unknown';

export interface ProcessedFile {
  name: string;
  type: FileType;
  lastModified: string;
  processedAt: string;
  recordsProcessed: number;
  errors: string[];
}

export interface SyncResult {
  startTime: string;
  endTime: string;
  filesProcessed: number;
  recordsProcessed: number;
  errors: string[];
  status: 'success' | 'partial' | 'failed';
}

// Mapping of file patterns to data types
export const filePatternMapping = {
  'inventory*.csv': 'inventory',
  'inventory*.json': 'inventory',
  'orders*.json': 'orders',
  'users*.json': 'users',
  'products*.csv': 'inventory',
  'suppliers*.json': 'suppliers'
};

// Data processor types
export type DataProcessor = (data: any) => Promise<ProcessingResult>;

export interface ProcessingResult {
  recordsProcessed: number;
  errors: string[];
  status: 'success' | 'partial' | 'failed';
}