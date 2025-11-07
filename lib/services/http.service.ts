import axios, { AxiosRequestConfig } from 'axios';

export class HttpService {
  // Use external backend URL if provided, otherwise use relative paths for Next.js API routes
  // For separate backend deployment, set NEXT_PUBLIC_API_URL environment variable
  // For integrated deployment (with API routes), leave empty to use relative paths
  private url = process.env.NEXT_PUBLIC_API_URL || 'https://climate-fisheries-backend.vercel.app';

  async sendGet(url: string, requestOptions: AxiosRequestConfig = {}, params?: any): Promise<any> {
    try {
      // For static assets in Next.js public folder, use fetch instead of axios
      if (url.startsWith('/assets/') || url.startsWith('./assets/')) {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
        }
        const text = await response.text();
        if (!text.trim()) {
          return null;
        }
        try {
          return JSON.parse(text);
        } catch (parseError) {
          console.warn('Failed to parse JSON response:', parseError);
          throw new Error(`Invalid JSON response from ${url}`);
        }
      }
      
      // For API endpoints, use axios
      // Fix double slashes in URL
      let apiUrl = url;
      if (url.startsWith('http')) {
        apiUrl = url.replace(/([^:]\/)\/+/g, '$1'); // Remove double slashes except after protocol
      } else {
        // Relative URL - use as-is (Next.js API routes are relative)
        // Ensure it starts with /api/ for API routes
        if (!url.startsWith('/api/') && !url.startsWith('/assets/')) {
          apiUrl = url.startsWith('/') ? url : `/${url}`;
        } else {
          apiUrl = url;
        }
      }
      
      const config: AxiosRequestConfig = {
        ...requestOptions,
        params: params || requestOptions.params,
        timeout: 10000 // 10 second timeout for API
      };
      
      // Log the request for debugging
      console.log('API Request:', { url: apiUrl, params: config.params });
      
      const response = await axios.get(apiUrl, config);
      return response.data;
    } catch (error: any) {
      // Reconstruct apiUrl for error logging (in case it wasn't set)
      let apiUrlForError = url;
      if (url.startsWith('http')) {
        apiUrlForError = url.replace(/([^:]\/)\/+/g, '$1');
      } else {
        if (!url.startsWith('/api/') && !url.startsWith('/assets/')) {
          apiUrlForError = url.startsWith('/') ? url : `/${url}`;
        } else {
          apiUrlForError = url;
        }
      }
      
      // Log all errors for debugging, but handle network errors gracefully
      const isNetworkError = error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT';
      
      // Log detailed error information for debugging
      console.error('API Request Error:', {
        url: apiUrlForError,
        code: error.code || 'UNKNOWN',
        message: error.message || 'Unknown error',
        status: error.response?.status,
        statusText: error.response?.statusText,
        response: error.response?.data,
        isNetworkError,
        fullError: error
      });
      
      // Throw error so calling code can handle gracefully
      throw error;
    }
  }

  getUrl(): string {
    return this.url;
  }

  async sendPost(url: string, params?: any): Promise<any> {
    if (
      params &&
      params.email &&
      params.subject &&
      params.message &&
      params.name
    ) {
      try {
        // Fix URL for relative paths (Next.js API routes)
        let apiUrl = url;
        if (!url.startsWith('http')) {
          if (!url.startsWith('/api/')) {
            apiUrl = url.startsWith('/') ? url : `/${url}`;
          } else {
            apiUrl = url;
          }
        }
        
        const config: AxiosRequestConfig = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        // Send params in request body, not as query parameters
        const response = await axios.post(apiUrl, params, config);
        return response.data;
      } catch (error) {
        console.error('POST request failed:', error);
        throw error;
      }
    }
    return Promise.resolve(null);
  }
}

