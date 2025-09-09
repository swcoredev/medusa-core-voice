export interface VoiceAssistant {
  id: string;
  name: string;
  language: string;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

export interface CreateVoiceAssistantRequest {
  name: string;
  language: string;
  status?: 'active' | 'inactive';
}

export interface UpdateVoiceAssistantRequest {
  name?: string;
  language?: string;
  status?: 'active' | 'inactive';
}

export interface VoiceAssistantResponse {
  success: boolean;
  data?: VoiceAssistant;
  message?: string;
  error?: string;
}

export interface VoiceAssistantsListResponse {
  success: boolean;
  data?: VoiceAssistant[];
  count?: number;
  message?: string;
  error?: string;
}
