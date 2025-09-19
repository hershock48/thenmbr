// API Service for NMBR Mobile App

import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://api.nmbr.com/v1';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private static instance: ApiService;
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.loadToken();
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private async loadToken(): Promise<void> {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      this.token = token;
    } catch (error) {
      console.error('Failed to load auth token:', error);
    }
  }

  private async getHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const headers = await this.getHeaders();

      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Request failed',
        };
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Authentication
  async login(email: string, password: string): Promise<ApiResponse<any>> {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data?.token) {
      this.token = response.data.token;
      await AsyncStorage.setItem('auth_token', response.data.token);
    }

    return response;
  }

  async logout(): Promise<void> {
    this.token = null;
    await AsyncStorage.removeItem('auth_token');
  }

  async register(userData: any): Promise<ApiResponse<any>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // User Profile
  async getProfile(): Promise<ApiResponse<any>> {
    return this.request('/user/profile');
  }

  async updateProfile(userData: any): Promise<ApiResponse<any>> {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Organization
  async getOrganization(orgId: string): Promise<ApiResponse<any>> {
    return this.request(`/organizations/${orgId}`);
  }

  async updateOrganization(orgId: string, orgData: any): Promise<ApiResponse<any>> {
    return this.request(`/organizations/${orgId}`, {
      method: 'PUT',
      body: JSON.stringify(orgData),
    });
  }

  // Products
  async getProducts(category?: string): Promise<ApiResponse<any[]>> {
    const endpoint = category ? `/products?category=${category}` : '/products';
    return this.request(endpoint);
  }

  async getProduct(productId: string): Promise<ApiResponse<any>> {
    return this.request(`/products/${productId}`);
  }

  async createProduct(productData: any): Promise<ApiResponse<any>> {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  // Stories
  async getStories(orgId: string): Promise<ApiResponse<any[]>> {
    return this.request(`/organizations/${orgId}/stories`);
  }

  async getStory(storyId: string): Promise<ApiResponse<any>> {
    return this.request(`/stories/${storyId}`);
  }

  async createStory(storyData: any): Promise<ApiResponse<any>> {
    return this.request('/stories', {
      method: 'POST',
      body: JSON.stringify(storyData),
    });
  }

  // Revenue
  async getRevenueMetrics(orgId: string): Promise<ApiResponse<any>> {
    return this.request(`/organizations/${orgId}/revenue`);
  }

  async getRevenueByCategory(orgId: string): Promise<ApiResponse<any[]>> {
    return this.request(`/organizations/${orgId}/revenue/categories`);
  }

  // Community
  async getCommunityMembers(orgId: string): Promise<ApiResponse<any[]>> {
    return this.request(`/organizations/${orgId}/community`);
  }

  async getReferralCodes(orgId: string): Promise<ApiResponse<any[]>> {
    return this.request(`/organizations/${orgId}/referrals`);
  }

  async createReferralCode(codeData: any): Promise<ApiResponse<any>> {
    return this.request('/referrals', {
      method: 'POST',
      body: JSON.stringify(codeData),
    });
  }

  // Analytics
  async getAnalytics(orgId: string, timeframe?: string): Promise<ApiResponse<any>> {
    const endpoint = timeframe 
      ? `/organizations/${orgId}/analytics?timeframe=${timeframe}`
      : `/organizations/${orgId}/analytics`;
    return this.request(endpoint);
  }

  // File Upload
  async uploadFile(file: any, type: 'image' | 'document' = 'image'): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.request('/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  }

  // Notifications
  async getNotifications(): Promise<ApiResponse<any[]>> {
    return this.request('/notifications');
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<any>> {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  // Settings
  async getSettings(): Promise<ApiResponse<any>> {
    return this.request('/settings');
  }

  async updateSettings(settings: any): Promise<ApiResponse<any>> {
    return this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }
}

export const apiService = ApiService.getInstance();
