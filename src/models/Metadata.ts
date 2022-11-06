export type LicenseType = "Basic" | "Commercial" | "Exclusive";

export interface Stem {
  description: string;
  file: string;
}

export interface License {
  type: LicenseType;
  tokensRequired: number;
}

export interface Metadata {
  name: string;
  description: string;
  file: string;
  image: string;
  genre: string;
  bpm: number;
  format: string;
  duration: number;
  stems: Stem[];
  licenses: License[];
}
