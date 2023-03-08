export interface payloadType {
  reference: string;
  callback_url: string;
  country: string;
  language: string;
  redirect_url?: string;
  verification_mode: string;
  document?: documentType;
  ttl?: number;
}

interface documentType {
  proof: string;
  additional_proof: string;
  name: string;
  dob: string;
  age: string;
  document_number: string;
  expiry_date: string;
  issue_date: string;
  allow_offline: string;
  allow_online: string;
  supported_types: string[];
  gender: string;
}

export const token = btoa(
  `${process.env.VUE_APP_SHUFTIPRO_CLIENT_ID}:${process.env.VUE_APP_SECRET_KEY}`
);
