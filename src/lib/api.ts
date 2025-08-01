// API service for authentication endpoints

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'customer' | 'seller' | 'user';
  phone: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
      phone: string;
    };
    token?: string;
  };
  errors?: Record<string, string[]>;
}

export interface CreateAuctionData {
  name: string; // ← ADD this
  description: string;
  auction_start_time: string;
  auction_end_time: string;
  starting_bid: number;
  reserve_price?: number;
  bid_increment: number;
  auto_extend: boolean;
  featured: boolean;
  promotional_tags: string[];
  images: File[]; // if you plan to use this for file upload later
}

const API_BASE_URL = 'http://ecc.lafmax.com/api';

export const authAPI = {
  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Registration failed',
          errors: result.errors || {},
        };
      }

      return {
        success: true,
        message: result.message || 'Registration successful',
        data: result.data,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        errors: {},
      };
    }
  },
  
  async login(data: { email: string; password: string; role: 'admin' | 'seller' | 'user' }): Promise<{
    success: boolean;
    message: string;
    data?: any;
    token?: string;
    errors?: Record<string, string[]>;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Login failed',
          errors: result.errors || {},
        };
      }
      return {
        success: true,
        message: result.message || 'Login successful',
        data: result.data,
        token: result.token,
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        errors: {},
      };
    }
  },

  async logout(token?: string): Promise<{
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      const result = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Logout failed',
          errors: result.errors || {},
        };
      }
      return {
        success: true,
        message: result.message || 'Logout successful',
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        errors: {},
      };
    }
  },

  async getMe(token?: string): Promise<{
    success: boolean;
    message: string;
    data?: any;
    errors?: Record<string, string[]>;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/fetch`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      const result = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Failed to fetch user',
          errors: result.errors || {},
        };
      }
      return {
        success: true,
        message: result.message || 'User fetched',
        data: result.data,
      };
    } catch (error) {
      console.error('GetMe error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        errors: {},
      };
    }
  },

  // async checkEmailAvailability(email: string, role: 'admin' | 'seller' | 'user'): Promise<{
  //   success: boolean;
  //   message: string;
  //   available: boolean;
  //   errors?: Record<string, string[]>;
  // }> {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/auth/check-email`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Accept': 'application/json',
  //       },
  //       body: JSON.stringify({ email, role }),
  //     });
  //     const result = await response.json();
  //     if (!response.ok) {
  //       return {
  //         success: false,
  //         message: result.message || 'Failed to check email availability',
  //         available: false,
  //         errors: result.errors || {},
  //       };
  //     }
  //     return {
  //       success: true,
  //       message: result.message || 'Email availability checked',
  //       available: result.available || false,
  //     };
  //   } catch (error) {
  //     console.error('Check email availability error:', error);
  //     return {
  //       success: false,
  //       message: 'Network error. Please check your connection and try again.',
  //       available: false,
  //       errors: {},
  //     };
  //   }
  // },
};

export interface Auction {
  id: number;
  title: string;
  description: string;
  auction_start_time: string;
  auction_end_time: string;
  starting_bid: number;
  reserve_price: number;
  bid_increment: number;
  auto_extend: boolean;
  featured: boolean;
  promotional_tags: string[];
  current_bid?: number;
  watchers?: number;
  status?: string;
  stage?: string; // Assuming you want to track the stage of the auction
  seller?: string;
  media?: File[];
  media_url?: string; 
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    phone?: string; // Optional, if you want to include phone number
  }
  // Assuming media is an array of image URLs
  // Add any other fields that might be returned by the API
}

export const adminAPI = {
  async createAuction(data: CreateAuctionData, token?: string): Promise<{
    success: boolean;
    message: string;
    data?: any;
    errors?: Record<string, string[]>;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/auction/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: data.name, // ← ADD this
          description: data.description,
          auction_start_time: data.auction_start_time,
          auction_end_time: data.auction_end_time,
          starting_bid: data.starting_bid,
          reserve_price: data.reserve_price,
          bid_increment: data.bid_increment,
          auto_extend: data.auto_extend,
          featured: data.featured,
          promotional_tags: data.promotional_tags.filter(tag => tag.trim() !== ''),        
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: result.message || result.error || 'Failed to create auction',
          errors: result.errors || {},
        };
      }
      return {
        success: true,
        message: result.message || 'Auction created successfully',
        data: result.data,
      };
    } catch (error) {
      console.error('Create auction error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        errors: {},
      };
    }
  },
  
  async fetchAuctions(token?: string): Promise<{
    success: boolean;
    message: string;
    data?: Auction[];
    errors?: Record<string, string[]>;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/auction/fetch`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      const result = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: result.message || result.error || 'Failed to fetch auctions',
          errors: result.errors || {},
        };
      }
      return {
        success: true,
        message: result.message || 'Auctions fetched successfully',
        data: result.data,
      };
    } catch (error) {
      console.error('Fetch auctions error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        errors: {},
      };
    }
  },
};