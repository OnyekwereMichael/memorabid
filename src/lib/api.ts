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
  title: string; // ← ADD this
  description: string;
  auction_start_time: string;
  auction_end_time: string;
  starting_bid: number;
  buy_now_price?: number; // Optional, if you want to allow buy now price
  media: File[] | File; // Assuming media is an array of files or a single file

  reserve_price?: number;
  bid_increment: number;
  auto_extend: boolean;
  featured: boolean;
  promotional_tags: string[];
  images: File[]; // if you plan to use this for file upload later
}

const API_BASE_URL = 'https://affliate.rosymaxpharmacy.com/api';

export const authAPI = {
  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/user/register`, {
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
  
  async login(data: { email: string; password: string; role: 'admin' | 'user' }): Promise<{
    success: boolean;
    message: string;
    data?: any;
    token?: string;
    errors?: Record<string, string[]>;
  }> {
    try {
      let endpoint = '';
      if (data.role === 'admin') {
        endpoint = `${API_BASE_URL}/auth/admin/login`;
      } else {
        endpoint = `${API_BASE_URL}/auth/user/login`;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Login failed',
          errors: result.errors || {},
        };
      }
      console.log('Login successful:', result);
      console.log('Token:', result.token);

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
      const response = await fetch(`${API_BASE_URL}/auth/user/logout`, {
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
      const response = await fetch(`${API_BASE_URL}/profile/user/fetch`, {
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

  async getMe_Admin(token?: string): Promise<{
    success: boolean;
    message: string;
    data?: any;
    errors?: Record<string, string[]>;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/admin/fetch`, {
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
  highest_bid?: any
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
  media_path?: string; // Assuming this is the path to the media
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
      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('auction_start_time', data.auction_start_time);
      formData.append('auction_end_time', data.auction_end_time);
      formData.append('starting_bid', String(data.starting_bid));
      formData.append('reserve_price', String(data.reserve_price));
      formData.append('bid_increment', String(data.bid_increment)); // ✅ ADDED HERE

      if (data.buy_now_price !== undefined && data.buy_now_price !== null) {
        formData.append('buy_now_price', String(data.buy_now_price));
      }

      formData.append('auto_extend', data.auto_extend ? '1' : '0');
      formData.append('featured', data.featured ? '1' : '0');

      if (Array.isArray(data.promotional_tags)) {
        data.promotional_tags
          .filter(tag => tag.trim() !== '')
          .forEach(tag => formData.append('promotional_tags[]', tag));
      }

      if (Array.isArray(data.images)) {
        data.images
          .filter(file => file instanceof File)
          .forEach(file => formData.append('media[]', file));
      }

      // Debugging: Log formData content properly
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await fetch(`${API_BASE_URL}/auction/admin/post`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          // Don't set 'Content-Type' manually for FormData
        },
        body: formData,
      });

      const contentType = response.headers.get('content-type');
      let result: any = {};
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.error("Server returned non-JSON response:", text);
        return {
          success: false,
          message: 'Server error — received non-JSON response.',
        };
      }

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
      const response = await fetch(`${API_BASE_URL}/profile/admin/fetch`, {
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
  async fetchAuctions_Admin(token?: string): Promise<{
    success: boolean;
    message: string;
    data?: Auction[];
    errors?: Record<string, string[]>;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auction/admin/fetch`, {
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

  async fetchAuctionById(id: number, token?: string): Promise<{
    success: boolean;
    message: string;
    data?: Auction;
    errors?: Record<string, string[]>;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auction/admin/view/${id}`, {
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
          message: result.message || result.error || 'Failed to fetch auction',
          errors: result.errors || {},
        };
      }
      return {
        success: true,
        message: result.message || 'Auction fetched successfully',
        data: result.data,
      };
    } catch (error) {
      console.error('Fetch auction by ID error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        errors: {},
      };
    }
  },

  
  async updateAuction(id: number, data: Partial<Auction>, token?: string): Promise<{
    success: boolean;
    message: string;
    data?: Auction;
    errors?: Record<string, string[]>;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auction/admin/update/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: result.message || result.error || 'Failed to update auction',
          errors: result.errors || {},
        };
      }
      return {
        success: true,
        message: result.message || 'Auction updated successfully',
        data: result.data,
      };
    } catch (error) {
      console.error('Update auction error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        errors: {},
      };
    }
  },

  async deleteAuction(id: number, token?: string): Promise<{
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auction/admin/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      const result = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: result.message || result.error || 'Failed to delete auction',
          errors: result.errors || {},
        };
      }
      return {
        success: true,
        message: result.message || 'Auction deleted successfully',
      };
    } catch (error) {
      console.error('Delete auction error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        errors: {},
      };
    }
  },

  async restartAuction(id: number, token?: string): Promise<{
    success: boolean;
    message: string;
    data?: Auction;
    errors?: Record<string, string[]>;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auction/admin/restart/${id}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      const result = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: result.message || result.error || 'Failed to restart auction',
          errors: result.errors || {},
        };
      }
      return {
        success: true,
        message: result.message || 'Auction restarted successfully',
        data: result.data,
      };
    } catch (error) {
      console.error('Restart auction error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        errors: {},
      };
    }
  },

  async cancelAuction(id: number, token?: string): Promise<{
    success: boolean;
    message: string;
    data?: Auction;
    errors?: Record<string, string[]>;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auction/admin/cancel/${id}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      const result = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: result.message || result.error || 'Failed to cancel auction',
          errors: result.errors || {},
        };
      }
      return {
        success: true,
        message: result.message || 'Auction cancelled successfully',
        data: result.data,
      };
    } catch (error) {
      console.error('Cancel auction error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        errors: {},
      };
    }
  },
};

export const auctionAPI = {
  async fetchAuctions(token?: string): Promise<{
    success: boolean;
    message: string;
    data?: Auction[];
    errors?: Record<string, string[]>;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auction/user/fetch_autcions_cards`, {
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

  async fetchAuctionById(id: number, token?: string): Promise<{
    success: boolean;
    message: string;
    data?: Auction;
    errors?: Record<string, string[]>;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auction/user/view/card/${id}`, {
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
          message: result.message || result.error || 'Failed to fetch auction',
          errors: result.errors || {},
        };
      }
      return {
        success: true,
        message: result.message || 'Auction fetched successfully',
        data: result.data,
      };
    } catch (error) {
      console.error('Fetch auction by ID error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        errors: {},
      };
    }
  },

  async fetchAuctionsByCategory(
    filter: string,
    token?: string
  ): Promise<{
    success: boolean;
    message: string;
    data?: Auction[];
    errors?: Record<string, string[]>;
  }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/auction/user/fetch?filter=${encodeURIComponent(filter)}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
        }
      );
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
      console.error('Fetch auctions by category error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        errors: {},
      };
    }
  },

  async placeBid (
    auctionId: number,
    bidAmount: number,
    token?: string
  ): Promise<{
    success: boolean;
    message: string;
    data?: any;
    errors?: Record<string, string[]>;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/bid/place/${auctionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ amount: bidAmount }),
      });

      const result = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: result.message || result.error || 'Failed to place bid',
          errors: result.errors || {},
        };
      }
      return {
        success: true,
        message: result.message || 'Bid placed successfully',
        data: result.data,
      };
    } catch (error) {
      console.error('Place bid error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        errors: {},
      };
    }
  },

  async fetchBidsByAuctionId(
    auctionId: number,
    token?: string
  ): Promise<{
    success: boolean;
    message: string;
    data?: any[];
    errors?: Record<string, string[]>;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/bid/public_bid_history/${auctionId}`, {
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
          message: result.message || result.error || 'Failed to fetch bids',
          errors: result.errors || {},
        };
      }
      return {
        success: true,
        message: result.message || 'Bids Details fetched successfully',
        data: result.data,
      };
    } catch (error) {
      console.error('Fetch bids by auction ID error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        errors: {},
      };
    }
  },

  // async fetchAuctionsByCategor(
  //   filter: string,
  //   token?: string
  // ): Promise<{
  //   success: boolean;
  //   message: string;
  //   data?: Auction[];
  //   errors?: Record<string, string[]>;
  // }> {
  //    try {
  //     const response = await fetch(`${API_BASE_URL}/auction/user/fetch_autcions_cards`, {
  //       method: 'GET',
  //       headers: {
  //         'Accept': 'application/json',
  //         ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  //       },
  //     });

  //     const result = await response.json();
  //     if (!response.ok) {
  //       return {
  //         success: false,
  //         message: result.message || result.error || 'Failed to fetch auctions',
  //         errors: result.errors || {},
  //       };
  //     }
  //     return {
  //       success: true,
  //       message: result.message || 'Auctions fetched successfully',
  //       data: result.data,
  //     };
  //   } catch (error) {
  //     console.error('Fetch auctions error:', error);
  //     return {
  //       success: false,
  //       message: 'Network error. Please check your connection and try again.',
  //       errors: {},
  //     };
  //   }
  // },

}