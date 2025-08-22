export interface Standard {
  id: string;
  name: string;
  createDate: string;
  standardData: StandardData[];
}

export interface StandardData {
  conditionMax: string;
  conditionMin: string;
  key: string;
  name: string;
  shape: string[];
  maxLength: number;
  minLength: number;
}

export interface InspectionFormData {
  name: string;
  standard: string;
  note: string;
  price?: number;
  samplingPoints: string[];
  dateTimeOfSampling?: Date;
  uploadFile?: File;
}

export interface RiceGrain {
  length: number;
  weight: number;
  shape: 'wholegrain' | 'broken';
  type: 'white' | 'chalky' | 'yellow' | 'red' | 'damage' | 'glutinous' | 'paddy';
}

export interface RawData {
  requestID: string;
  imageURL: string;
  grains: RiceGrain[];
}

export interface CompositionResult {
  name: string;
  length: string;
  actual: string;
}

export interface DefectResult {
  name: string;
  actual: string;
}

export interface InspectionResult {
  id: string;
  createdAt: string;
  updatedAt: string;
  standardName: string;
  totalSample: number;
  note: string;
  price?: number;
  dateTimeOfSampling?: string;
  samplingPoint?: string;
  composition: CompositionResult[];
  defectRice: DefectResult[];
}

export interface HistoryItem {
  id: string;
  name: string;
  createDate: string;
  standard: string;
  note: string;
}

export type SamplingPoint = 'Front End' | 'Back End' | 'Other';
