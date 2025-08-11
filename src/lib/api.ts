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
  title: string;
  description: string;
  auction_start_time: string;
  auction_end_time: string;
  starting_bid: number;
  buy_now_price?: number;
  reserve_price?: number;
  bid_increment: number;
  auto_extend: boolean;
  featured: boolean;
  promotional_tags: string[];
  media: string[] | File[]; // <-- changed from images to media
}

export interface Bidder {
  bidder_id: number;
  bidder_type: string;
  user_id: number;
  name: string;
  email: string;
  total_bids: number;
  highest_bid_by_bidder: string;
}

export interface BiddersResponse {
  auction_id: number;
  total_bidders: number;
  bidders: Bidder[];
  highest_bidder: {
    bidder_id: number;
    bidder_type: string;
    user_id: number;
    name: string;
    email: string;
    amount: string;
  };
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
  media?: Array<{
    id: number;
    auction_id: string;
    media_type: string;
    media_path: string;
    media_url: string;
    created_at: string;
    updated_at: string;
  }>;
  media_url?: string; 
  media_path?: string; // Assuming this is the path to the media
  winner?: {
    id: number;
    name: string;
    email: string;
    type: string;
  } | null;
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
      const endpoint = `${API_BASE_URL}/auction/admin/post`;
      
      // Check if we have media files to send
      const hasMediaFiles = data.media && Array.isArray(data.media) && data.media.length > 0 && data.media.some(item => item instanceof File);
      
      if (hasMediaFiles) {
        // Send as FormData with files
        const formData = new FormData();
        
        // Add text fields
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('auction_start_time', data.auction_start_time);
        formData.append('auction_end_time', data.auction_end_time);
        formData.append('starting_bid', data.starting_bid.toString());
        formData.append('reserve_price', data.reserve_price?.toString() || '');
        formData.append('bid_increment', 'Auto'); // send as 'Auto' or 'Fixed' instead of a number
        if (data.buy_now_price) {
          formData.append('buy_now_price', data.buy_now_price.toString());
        }
        formData.append('auto_extend', data.auto_extend.toString());
        formData.append('featured', data.featured.toString());
        
        // Add promotional tags as JSON string
        const cleanedTags = (data.promotional_tags || []).filter(tag => tag.trim() !== '');
        formData.append('promotional_tags', JSON.stringify(cleanedTags));

        // formData.append('media[0]', data.featured.toString());
        
        // Add media files with proper field names
        const mediaFiles = data.media.filter(item => item instanceof File);
        if (mediaFiles.length > 0) {
          // Only append the first file
          const firstFile = mediaFiles[0];
          formData.append('media[0]', firstFile);
          console.log(`Added first file:`, firstFile.name, firstFile.type, firstFile.size);
        } else if (Array.isArray(data.media) && data.media.length > 0) {
          // If we have Base64 strings, include them in the FormData
          const mediaBase64 = data.media.filter(item => typeof item === 'string');
          if (mediaBase64.length > 0) {
            formData.append('media_base64', JSON.stringify(mediaBase64));
            console.log('Added Base64 media to FormData');
          }
        }
        
        // console.log(`Sending FormData with ${firstFile} files:`, formData);
        
        // Debug: Log all FormData entries
        for (let [key, value] of formData.entries()) {
          console.log(`FormData entry - ${key}:`, value);
        }
        
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
              // Don't set Content-Type for FormData, let browser set it with boundary
            },
            body: formData,
          });
          
          const contentType = response.headers.get('content-type');
          let result: any = {};
          if (contentType && contentType.includes('application/json')) {
            result = await response.json();
          } else {
            const text = await response.text();
            console.error("Non-JSON response:", text);
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
          console.error('FormData upload failed, trying without files:', error);
          // Fallback to JSON without files if FormData fails
          return this.createAuctionWithoutFiles(data, token);
        }
      } else {
        // Send as JSON without files
        const jsonPayload = {
          title: data.title,
          description: data.description,
          auction_start_time: data.auction_start_time,
          auction_end_time: data.auction_end_time,
          starting_bid: data.starting_bid,
          reserve_price: data.reserve_price,
          bid_increment: 'Auto', // send as 'Auto' or 'Fixed' instead of a number
          buy_now_price: data.buy_now_price,
          auto_extend: data.auto_extend,
          featured: data.featured,
          promotional_tags: (data.promotional_tags || []).filter(tag => tag.trim() !== ''),
          media: data.media, // Include the media field (Base64 strings)
        };
        
        console.log("Sending JSON payload without files:", jsonPayload);
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(jsonPayload),
        });
        
        const contentType = response.headers.get('content-type');
        let result: any = {};
        if (contentType && contentType.includes('application/json')) {
          result = await response.json();
        } else {
          const text = await response.text();
          console.error("Non-JSON response:", text);
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
      }
    } catch (error) {
      console.error('Create auction error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        errors: {},
      };
    }
  },

  // Helper function to create auction without files
  async createAuctionWithoutFiles(data: CreateAuctionData, token?: string): Promise<{
    success: boolean;
    message: string;
    data?: any;
    errors?: Record<string, string[]>;
  }> {
    try {
      const endpoint = `${API_BASE_URL}/auction/admin/post`;
      
      // Prepare the JSON payload
      const jsonPayload = {
        title: data.title,
        description: data.description,
        auction_start_time: data.auction_start_time,
        auction_end_time: data.auction_end_time,
        starting_bid: data.starting_bid,
        reserve_price: data.reserve_price,
        bid_increment: 'Auto', // send as 'Auto' or 'Fixed' instead of a number
        buy_now_price: data.buy_now_price,
        auto_extend: data.auto_extend,
        featured: data.featured,
        promotional_tags: (data.promotional_tags || []).filter(tag => tag.trim() !== ''),
        media: data.media, // Include the media field (Base64 strings)
      };
      
      console.log("Sending JSON payload in createAuctionWithoutFiles:", jsonPayload);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(jsonPayload),
      });
      
      const contentType = response.headers.get('content-type');
      let result: any = {};
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.error("Non-JSON response in createAuctionWithoutFiles:", text);
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
      console.error('Create auction without files error:', error);
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

  async fetchAuctionById_Admin(id: number, token?: string): Promise<{
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
  async fetchAuctionById_bidders(id: number, token?: string): Promise<{
    success: boolean;
    message: string;
    data?: BiddersResponse;
    errors?: Record<string, string[]>;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auction/admin/${id}/bidder`, {
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

  async fetchAuctionById_Admin(id: number, token?: string): Promise<{
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

  async declareWinner(auctionId: number, userId: number, token?: string): Promise<{
    success: boolean;
    message: string;
    data?: any;
    errors?: Record<string, string[]>;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auction/admin/set/${auctionId}/winner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ user_id: userId }),
      });

      const result = await response.json();
      if (!response.ok) {
        return {
          success: false,
          message: result.message || result.error || 'Failed to declare winner',
          errors: result.errors || {},
        };
      }
      return {
        success: true,
        message: result.message || 'Winner declared successfully',
        data: result.data,
      };
    } catch (error) {
      console.error('Declare winner error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        errors: {},
      };
    }
  },
}