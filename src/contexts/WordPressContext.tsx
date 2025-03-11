
import React, { createContext, useContext, useState, useEffect } from 'react';
import { WordPressSite, WordPressConnectionCredentials } from '@/types/wordpress';
import { toast } from '@/hooks/use-toast';

interface WordPressContextType {
  sites: WordPressSite[];
  currentSite: WordPressSite | null;
  isConnecting: boolean;
  connectSite: (credentials: WordPressConnectionCredentials) => Promise<boolean>;
  disconnectSite: (siteId: string) => void;
  switchSite: (siteId: string) => void;
  testConnection: (credentials: WordPressConnectionCredentials) => Promise<boolean>;
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

  // Save sites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('wordpressSites', JSON.stringify(sites));
    
    // Set current site to first site if none selected
    if (sites.length > 0 && !currentSite) {
      setCurrentSite(sites[0]);
    }
  }, [sites]);

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

  return (
    <WordPressContext.Provider
      value={{
        sites,
        currentSite,
        isConnecting,
        connectSite,
        disconnectSite,
        switchSite,
        testConnection,
      }}
    >
      {children}
    </WordPressContext.Provider>
  );
};
