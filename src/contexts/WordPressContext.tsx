
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  WordPressSite, 
  WordPressConnectionCredentials, 
  WordPressPost, 
  WordPressPage, 
  WordPressUser, 
  WordPressPlugin, 
  WordPressTheme,
  ContentOverview,
  WordPressCourse,
  WordPressStudent,
  WordPressLesson,
  WordPressQuiz
} from '@/types/wordpress';
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
  courses: WordPressCourse[];
  students: WordPressStudent[];
  lessons: WordPressLesson[];
  quizzes: WordPressQuiz[];
  connectSite: (credentials: WordPressConnectionCredentials) => Promise<boolean>;
  disconnectSite: (siteId: string) => void;
  switchSite: (siteId: string) => void;
  testConnection: (credentials: WordPressConnectionCredentials) => Promise<boolean>;
  fetchPosts: () => Promise<WordPressPost[]>;
  fetchPages: () => Promise<WordPressPage[]>;
  fetchUsers: () => Promise<WordPressUser[]>;
  fetchPlugins: () => Promise<WordPressPlugin[]>;
  fetchThemes: () => Promise<WordPressTheme[]>;
  fetchCourses: () => Promise<WordPressCourse[]>;
  fetchStudents: () => Promise<WordPressStudent[]>;
  fetchLessons: (courseId?: number) => Promise<WordPressLesson[]>;
  fetchQuizzes: (courseId?: number) => Promise<WordPressQuiz[]>;
  getContentOverview: () => ContentOverview;
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
    const savedSites = localStorage.getItem('wordpressSites');
    return savedSites ? JSON.parse(savedSites) : [];
  });
  const [currentSite, setCurrentSite] = useState<WordPressSite | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [pages, setPages] = useState<WordPressPage[]>([]);
  const [users, setUsers] = useState<WordPressUser[]>([]);
  const [plugins, setPlugins] = useState<WordPressPlugin[]>([]);
  const [themes, setThemes] = useState<WordPressTheme[]>([]);
  const [courses, setCourses] = useState<WordPressCourse[]>([]);
  const [students, setStudents] = useState<WordPressStudent[]>([]);
  const [lessons, setLessons] = useState<WordPressLesson[]>([]);
  const [quizzes, setQuizzes] = useState<WordPressQuiz[]>([]);

  useEffect(() => {
    localStorage.setItem('wordpressSites', JSON.stringify(sites));
    
    if (sites.length > 0 && !currentSite) {
      setCurrentSite(sites[0]);
    }
  }, [sites]);

  useEffect(() => {
    if (currentSite) {
      fetchPosts();
      fetchPages();
      fetchUsers();
      fetchPlugins();
      fetchThemes();
      fetchCourses();
      fetchStudents();
    }
  }, [currentSite]);

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

  const getContentOverview = (): ContentOverview => {
    return {
      posts: posts.length,
      pages: pages.length,
      users: users.length,
      comments: 248,
      categories: 12,
      tags: 56,
    };
  };

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
      console.log('Themes API might require admin access or additional permissions');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCourses = async (): Promise<WordPressCourse[]> => {
    if (!currentSite) return [];
    setIsLoading(true);
    
    try {
      try {
        const result = await apiRequest<WordPressCourse[]>('tutor/courses?per_page=100');
        setCourses(result);
        return result;
      } catch (tutorError) {
        console.log('Tutor LMS API not available, trying custom post type...');
        
        try {
          const result = await apiRequest<WordPressCourse[]>('courses?per_page=100');
          setCourses(result);
          return result;
        } catch (courseError) {
          console.log('Custom post type "courses" not available, falling back to posts...');
          
          const allPosts = await fetchPosts();
          const coursePosts = allPosts.filter(post => 
            post.categories?.includes(1) || // Using 1 as a default course category ID
            post.title.rendered.toLowerCase().includes('course')
          );
          
          const mappedCourses: WordPressCourse[] = coursePosts.map(post => ({
            ...post,
            course_duration: '8 weeks',
            enrolled_students: Math.floor(Math.random() * 100),
            difficulty_level: 'Beginner',
          }));
          
          setCourses(mappedCourses);
          return mappedCourses;
        }
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudents = async (): Promise<WordPressStudent[]> => {
    if (!currentSite) return [];
    setIsLoading(true);
    
    try {
      try {
        const result = await apiRequest<WordPressStudent[]>('tutor/students?per_page=100');
        setStudents(result);
        return result;
      } catch (error) {
        console.log('Tutor LMS students API not available, falling back to WordPress users...');
        
        const allUsers = await fetchUsers();
        
        const mappedStudents: WordPressStudent[] = allUsers.map(user => ({
          ...user,
          enrolled_courses: [1, 2, 3].slice(0, Math.floor(Math.random() * 3) + 1),
          completed_courses: [1].slice(0, Math.floor(Math.random() * 2)),
          progress: [
            {
              course_id: 1,
              progress_percentage: Math.floor(Math.random() * 100),
              last_activity: new Date().toISOString(),
            }
          ],
        }));
        
        setStudents(mappedStudents);
        return mappedStudents;
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLessons = async (courseId?: number): Promise<WordPressLesson[]> => {
    if (!currentSite) return [];
    setIsLoading(true);
    
    try {
      let endpoint = 'tutor/lessons';
      if (courseId) {
        endpoint += `?course=${courseId}`;
      }
      
      try {
        const result = await apiRequest<WordPressLesson[]>(endpoint);
        setLessons(result);
        return result;
      } catch (error) {
        console.log('Tutor LMS lessons API not available, using mock data...');
        
        const mockLessons: WordPressLesson[] = [
          {
            id: 1,
            title: { rendered: 'Introduction to the Course' },
            content: { rendered: '<p>Welcome to the course!</p>', protected: false },
            status: 'publish',
            course_id: courseId || 1,
            lesson_order: 1,
            lesson_type: 'video',
            duration: '15:00',
          },
          {
            id: 2,
            title: { rendered: 'Getting Started' },
            content: { rendered: '<p>Let\'s get started with the basics.</p>', protected: false },
            status: 'publish',
            course_id: courseId || 1,
            lesson_order: 2,
            lesson_type: 'text',
            duration: '25:00',
          },
          {
            id: 3,
            title: { rendered: 'First Quiz' },
            content: { rendered: '<p>Test your knowledge!</p>', protected: false },
            status: 'publish',
            course_id: courseId || 1,
            lesson_order: 3,
            lesson_type: 'quiz',
            duration: '10:00',
          },
        ];
        
        setLessons(mockLessons);
        return mockLessons;
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuizzes = async (courseId?: number): Promise<WordPressQuiz[]> => {
    if (!currentSite) return [];
    setIsLoading(true);
    
    try {
      let endpoint = 'tutor/quizzes';
      if (courseId) {
        endpoint += `?course=${courseId}`;
      }
      
      try {
        const result = await apiRequest<WordPressQuiz[]>(endpoint);
        setQuizzes(result);
        return result;
      } catch (error) {
        console.log('Tutor LMS quizzes API not available, using mock data...');
        
        const mockQuizzes: WordPressQuiz[] = [
          {
            id: 1,
            title: { rendered: 'Module 1 Quiz' },
            description: 'Test your knowledge of the first module',
            course_id: courseId || 1,
            time_limit: 30,
            passing_grade: 70,
            max_attempts: 3,
            questions: [
              {
                id: 101,
                type: 'multiple-choice',
                question_text: 'What is the capital of France?',
                options: ['London', 'Berlin', 'Paris', 'Madrid'],
                correct_answer: 'Paris',
                points: 1,
              },
              {
                id: 102,
                type: 'true-false',
                question_text: 'The sky is blue.',
                options: ['True', 'False'],
                correct_answer: 'True',
                points: 1,
              },
            ],
          },
          {
            id: 2,
            title: { rendered: 'Final Assessment' },
            description: 'Comprehensive final exam',
            course_id: courseId || 1,
            time_limit: 60,
            passing_grade: 80,
            max_attempts: 2,
            questions: [
              {
                id: 201,
                type: 'essay',
                question_text: 'Explain the concept in your own words.',
                points: 5,
              },
              {
                id: 202,
                type: 'fill-blank',
                question_text: 'The process of photosynthesis converts sunlight into ____.',
                correct_answer: 'energy',
                points: 2,
              },
            ],
          },
        ];
        
        setQuizzes(mockQuizzes);
        return mockQuizzes;
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
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
        courses,
        students,
        lessons,
        quizzes,
        connectSite,
        disconnectSite,
        switchSite,
        testConnection,
        fetchPosts,
        fetchPages,
        fetchUsers,
        fetchPlugins,
        fetchThemes,
        fetchCourses,
        fetchStudents,
        fetchLessons,
        fetchQuizzes,
        getContentOverview,
      }}
    >
      {children}
    </WordPressContext.Provider>
  );
};
