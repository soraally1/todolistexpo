/**
 * API Service Layer
 * Handles all HTTP requests and responses
 */

// Base API configuration
const API_BASE_URL = 'http://localhost:4000/api/v1';
const API_TIMEOUT = 10000; // 10 seconds

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  completed?: boolean;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  completed?: boolean;
}

// API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Debug logging utility
const debugLog = (method: string, url: string, data?: any, response?: any) => {
  if (__DEV__) {
    console.log(`🚀 API ${method}: ${url}`);
    if (data) console.log(' Request data:', data);
    if (response) console.log('Response:', response);
  }
};

// Base fetch wrapper with error handling
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    timeout: API_TIMEOUT,
  };

  const requestOptions = { ...defaultOptions, ...options };

  try {
    debugLog(options.method || 'GET', url, options.body ? JSON.parse(options.body as string) : undefined);

    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    const data = await response.json();
    debugLog(options.method || 'GET', url, undefined, data);

    return {
      success: true,
      data,
    };
  } catch (error) {
    const errorMessage = error instanceof ApiError 
      ? error.message 
      : `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    
    console.error('API Error:', errorMessage);
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// Notes API endpoints
export const notesApi = {
  // GET /api/v1/notes - Get all notes
  getAllNotes: async (): Promise<ApiResponse<Note[]>> => {
    return apiRequest<Note[]>('/notes');
  },

  // GET /api/v1/notes/{id} - Get single note
  getNoteById: async (id: string): Promise<ApiResponse<Note>> => {
    return apiRequest<Note>(`/notes/${id}`);
  },

  // POST /api/v1/notes - Create new note
  createNote: async (noteData: CreateNoteRequest): Promise<ApiResponse<Note>> => {
    return apiRequest<Note>('/notes', {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
  },

  // PUT /api/v1/notes/{id} - Update note
  updateNote: async (id: string, noteData: UpdateNoteRequest): Promise<ApiResponse<Note>> => {
    return apiRequest<Note>(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(noteData),
    });
  },

  // DELETE /api/v1/notes/{id} - Delete note
  deleteNote: async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>(`/notes/${id}`, {
      method: 'DELETE',
    });
  },
};

// Export default API object
export default notesApi;
