// lib/api.ts
// T006: API client with 401 interceptor and Bearer token handling

import {
  Task,
  TaskCreate,
  TaskUpdate,
  TaskStatusUpdate,
  TaskListResponse,
  TaskFilter,
  LoginCredentials,
  SignupCredentials,
  AuthSession,
  ChatRequest,
  ChatResponse,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const token = this.getToken();

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
    });

    // 401 interceptor - redirect to login on unauthorized
    if (response.status === 401) {
      if (typeof window !== 'undefined' && !endpoint.includes('/auth/login')) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
      }
      throw new Error('Invalid email or password');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(
        typeof errorData.detail === 'string'
          ? errorData.detail
          : 'Request failed'
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    return this.request<AuthSession>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signup(credentials: SignupCredentials): Promise<AuthSession> {
    return this.request<AuthSession>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async demoLogin(): Promise<AuthSession> {
    return this.request<AuthSession>('/auth/demo', {
      method: 'POST',
    });
  }

  // Task endpoints
  async getTasks(
    filter: TaskFilter = 'all',
    page: number = 1,
    perPage: number = 20
  ): Promise<TaskListResponse> {
    const params = new URLSearchParams({
      status: filter,
      page: String(page),
      per_page: String(perPage),
    });

    return this.request<TaskListResponse>(`/tasks?${params}`);
  }

  async createTask(data: TaskCreate): Promise<Task> {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: number, data: TaskUpdate): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async toggleTaskStatus(id: number, data: TaskStatusUpdate): Promise<Task> {
    return this.request<Task>(`/tasks/${id}/complete`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: number): Promise<void> {
    return this.request<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Chat endpoint
  async chat(data: ChatRequest): Promise<ChatResponse> {
    return this.request<ChatResponse>('/chat/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
