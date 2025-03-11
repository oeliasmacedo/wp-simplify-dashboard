
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WordPressSite, WordPressConnectionCredentials, WordPressPost, WordPressPage, WordPressUser, WordPressPlugin, WordPressTheme } from '@/types/wordpress';
import { toast } from '@/hooks/use-toast';

interface WordPressContextType {
  sites: WordPressSite[];
  currentSite: WordPressSite | null;
  isConnecting: boolean;
  isLoading: boolean;
  posts: WordPressPost[];
  pages: WordPressPage[];
  users: WordPressUser[];
  plugins: WordPressPlugin[];
  themes: WordPressTheme[];
  connectSite: (credentials: WordPressConnectionCredentials) => Promise<boolean>;
  disconnectSite: (siteId: string) => void;
  switchSite: (siteId: string) => void;
  testConnection: (credentials: WordPressConnectionCredentials) => Promise<boolean>;
  fetchPosts: () => Promise<WordPressPost[]>;
  fetchPages: () => Promise<WordPressPage[]>;
  fetchUsers: () => Promise<WordPressUser[]>;
  fetchPlugins: () => Promise<WordPressPlugin[]>;
  fetchThemes: () => Promise<WordPressTheme[]>;
}

const WordPressContext = createContext<WordPressContextType | undefined>(undefined);

export const useWordPress = () => {
  const context = useContext(WordPressContext);
  if (context === undefined) {
    throw new Error('useWordPress must be used within a WordPressProvider');
  }
  return context;
};

export const WordPressProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [sites, setSites] = useState<WordPressSite[]>(() => {
    // Load from localStorage if available
    const savedSites = localStorage.getItem('wordpressSites');
    return savedSites ? JSON.parse(savedSites) : [];
  });
  const [currentSite, setCurrentSite] = useState<WordPressSite | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for WordPress data
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [pages, setPages] = useState<WordPressPage[]>([]);
  const [users, setUsers] = useState<WordPressUser[]>([]);
  const [plugins, setPlugins] = useState<WordPressPlugin[]>([]);
  const [themes, setThemes] = useState<WordPressTheme[]>([]);

  // Save sites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('wordpressSites', JSON.stringify(sites));
    
    // Set current site to first site if none selected
    if (sites.length > 0 && !currentSite) {
      setCurrentSite(sites[0]);
    }
  }, [sites]);

  // Fetch initial data when currentSite changes
  useEffect(() => {
    if (currentSite) {
      fetchPosts();
      fetchPages();
      fetchUsers();
      fetchPlugins();
      fetchThemes();
    }
  }, [currentSite]);

  // Prepare API request headers based on auth type
  const getHeaders = () => {
    if (!currentSite) return {};

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (currentSite.authType === 'application_password') {
      headers.Authorization = `Basic ${btoa(`${currentSite.username}:${currentSite.applicationPassword}`)}`;
    } else if (currentSite.authType === 'jwt' && currentSite.token) {
      headers.Authorization = `Bearer ${currentSite.token}`;
    }
    
    return headers;
  };

  // Helper function to make API requests
  const apiRequest = async <T,>(endpoint: string): Promise<T> => {
    if (!currentSite) {
      throw new Error('No WordPress site selected');
    }

    const baseUrl = currentSite.url.endsWith('/') 
      ? currentSite.url.slice(0, -1) 
      : currentSite.url;
    
    const url = `${baseUrl}/wp-json/wp/v2/${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      toast({
        title: "WordPress API Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      throw error;
    }
  };

  const testConnection = async (credentials: WordPressConnectionCredentials): Promise<boolean> => {
    try {
      // Format the site URL correctly
      const baseUrl = credentials.url.endsWith('/') 
        ? credentials.url.slice(0, -1) 
        : credentials.url;
      
      const endpoint = `${baseUrl}/wp-json/wp/v2/users/me`;
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (credentials.authType === 'application_password') {
        headers.Authorization = `Basic ${btoa(`${credentials.username}:${credentials.applicationPassword}`)}`;
      } else if (credentials.authType === 'jwt' && credentials.token) {
        headers.Authorization = `Bearer ${credentials.token}`;
      }
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        console.error('Connection test failed:', await response.text());
        return false;
      }
      
      const userData = await response.json();
      console.log('Connection successful:', userData);
      return true;
    } catch (error) {
      console.error('Error testing connection:', error);
      return false;
    }
  };

  const connectSite = async (credentials: WordPressConnectionCredentials): Promise<boolean> => {
    setIsConnecting(true);
    
    try {
      const isConnected = await testConnection(credentials);
      
      if (!isConnected) {
        toast({
          title: "Connection Failed",
          description: "Could not connect to WordPress site. Please check your credentials.",
          variant: "destructive",
        });
        return false;
      }
      
      // Create new site object
      const newSite: WordPressSite = {
        id: crypto.randomUUID(),
        name: new URL(credentials.url).hostname,
        url: credentials.url,
        username: credentials.username,
        applicationPassword: credentials.applicationPassword,
        token: credentials.token,
        authType: credentials.authType,
        isConnected: true,
        lastConnected: new Date(),
      };
      
      setSites(prev => [...prev, newSite]);
      setCurrentSite(newSite);
      
      toast({
        title: "Site Connected",
        description: `Successfully connected to ${newSite.name}`,
      });
      
      return true;
    } catch (error) {
      console.error('Error connecting site:', error);
      toast({
        title: "Connection Error",
        description: "An unexpected error occurred while connecting to the site.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectSite = (siteId: string) => {
    setSites(prev => prev.filter(site => site.id !== siteId));
    
    if (currentSite?.id === siteId) {
      const remainingSites = sites.filter(site => site.id !== siteId);
      setCurrentSite(remainingSites.length > 0 ? remainingSites[0] : null);
    }
    
    toast({
      title: "Site Disconnected",
      description: "The site has been removed from your dashboard.",
    });
  };

  const switchSite = (siteId: string) => {
    const site = sites.find(site => site.id === siteId);
    if (site) {
      setCurrentSite(site);
    }
  };

  // API Data Fetching Functions
  const fetchPosts = async (): Promise<WordPressPost[]> => {
    if (!currentSite) return [];
    setIsLoading(true);
    
    try {
      const result = await apiRequest<WordPressPost[]>('posts?per_page=100');
      setPosts(result);
      return result;
    } catch (error) {
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPages = async (): Promise<WordPressPage[]> => {
    if (!currentSite) return [];
    setIsLoading(true);
    
    try {
      const result = await apiRequest<WordPressPage[]>('pages?per_page=100');
      setPages(result);
      return result;
    } catch (error) {
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async (): Promise<WordPressUser[]> => {
    if (!currentSite) return [];
    setIsLoading(true);
    
    try {
      const result = await apiRequest<WordPressUser[]>('users?per_page=100');
      setUsers(result);
      return result;
    } catch (error) {
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPlugins = async (): Promise<WordPressPlugin[]> => {
    if (!currentSite) return [];
    setIsLoading(true);
    
    try {
      const result = await apiRequest<WordPressPlugin[]>('plugins?per_page=100');
      setPlugins(result);
      return result;
    } catch (error) {
      // Note: Plugin API endpoint might require additional permissions
      console.log('Plugins API might require admin access or additional permissions');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchThemes = async (): Promise<WordPressTheme[]> => {
    if (!currentSite) return [];
    setIsLoading(true);
    
    try {
      const result = await apiRequest<WordPressTheme[]>('themes?per_page=100');
      setThemes(result);
      return result;
    } catch (error) {
      // Note: Theme API endpoint might require additional permissions
      console.log('Themes API might require admin access or additional permissions');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WordPressContext.Provider
      value={{
        sites,
        currentSite,
        isConnecting,
        isLoading,
        posts,
        pages,
        users,
        plugins,
        themes,
        connectSite,
        disconnectSite,
        switchSite,
        testConnection,
        fetchPosts,
        fetchPages,
        fetchUsers,
        fetchPlugins,
        fetchThemes,
      }}
    >
      {children}
    </WordPressContext.Provider>
  );
};
