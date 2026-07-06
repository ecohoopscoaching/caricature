
export enum CaricatureStyle {
  EGO_DISTORTER = 'EGO_DISTORTER',
  LEGEND_CANVAS = 'LEGEND_CANVAS',
  VECTOR_VAULT = 'VECTOR_VAULT'
}

export interface StyleConfig {
  id: CaricatureStyle;
  name: string;
  description: string;
  prompt: string;
  icon: string;
}

export interface ProcessingState {
  isProcessing: boolean;
  error: string | null;
  resultUrl: string | null;
}
