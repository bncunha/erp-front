export type LegalDocumentType = 'TERMS' | 'PRIVACY';

export interface LegalTermStatusResponse {
  doc_type: LegalDocumentType;
  doc_version: string;
  accepted: boolean;
}
