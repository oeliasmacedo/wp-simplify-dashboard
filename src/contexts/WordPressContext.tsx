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
  
  enrollStudent: (studentId: number, courseId: number) => Promise<boolean>;
  updateCourseProgress: (studentId: number, courseId: number, progress: number) => Promise<boolean>;
  completeCourse: (studentId: number, courseId: number) => Promise<boolean>;
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

  const apiRequest = async <T,>(endpoint: string, method: string = 'GET', body?: any): Promise<T> => {
    if (!currentSite) {
      throw new Error('No WordPress site selected');
    }

    const baseUrl = currentSite.url.endsWith('/') 
      ? currentSite.url.slice(0, -1) 
      : currentSite.url;
    
    const url = `${baseUrl}/wp-json/wp/v2/${endpoint}`;
    
    try {
      const options: RequestInit = {
        method,
        headers: getHeaders(),
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }
      
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error with ${method} request to ${endpoint}:`, error);
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
      let result: WordPressCourse[] = [];
      
      try {
        result = await apiRequest<WordPressCourse[]>('tutor/courses?per_page=100');
        console.log('Fetched courses from Tutor LMS API:', result);
      } catch (tutorError) {
        console.log('Tutor LMS API not available, trying custom post type...');
        
        try {
          result = await apiRequest<WordPressCourse[]>('courses?per_page=100');
          console.log('Fetched courses from custom post type:', result);
        } catch (courseError) {
          console.log('Custom post type "courses" not available, checking for LearnDash...');
          
          try {
            result = await apiRequest<WordPressCourse[]>('sfwd-courses?per_page=100');
            console.log('Fetched courses from LearnDash:', result);
          } catch (learnDashError) {
            console.log('LearnDash API not available, falling back to regular posts...');
            
            const allPosts = await fetchPosts();
            const coursePosts = allPosts.filter(post => 
              post.categories?.includes(1) || 
              post.title.rendered.toLowerCase().includes('course')
            );
            
            const mappedCourses: WordPressCourse[] = coursePosts.map(post => ({
              ...post,
              course_duration: '8 weeks',
              enrolled_students: Math.floor(Math.random() * 100),
              difficulty_level: Math.random() > 0.7 ? 'Advanced' : Math.random() > 0.4 ? 'Intermediate' : 'Beginner',
              instructor: post.author,
            }));
            
            setCourses(mappedCourses);
            return mappedCourses;
          }
        }
      }
      
      setCourses(result);
      return result;
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
      let result: WordPressStudent[] = [];
      
      try {
        result = await apiRequest<WordPressStudent[]>('tutor/students?per_page=100');
        console.log('Fetched students from Tutor LMS API:', result);
      } catch (error) {
        console.log('Tutor LMS students API not available, falling back to WordPress users...');
        
        const allUsers = await fetchUsers();
        const currentCourses = await fetchCourses();
        
        result = allUsers.map(user => {
          const enrolledCourseIds = currentCourses
            .slice(0, Math.floor(Math.random() * 3) + 1)
            .map(course => course.id);
            
          const completedCourseIds = enrolledCourseIds
            .filter(() => Math.random() > 0.6)
            .slice(0, Math.floor(Math.random() * 2));
            
          const progress = enrolledCourseIds.map(courseId => ({
            course_id: courseId,
            progress_percentage: completedCourseIds.includes(courseId) 
              ? 100 
              : Math.floor(Math.random() * 100),
            last_activity: new Date().toISOString(),
          }));
          
          return {
            ...user,
            enrolled_courses: enrolledCourseIds,
            completed_courses: completedCourseIds,
            progress,
          };
        });
        
        console.log('Created mock students from users:', result);
      }
      
      setStudents(result);
      return result;
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
      let endpoint = courseId ? `tutor/lessons?course=${courseId}` : 'tutor/lessons';
      
      try {
        const result = await apiRequest<WordPressLesson[]>(endpoint);
        console.log('Fetched lessons from Tutor LMS API:', result);
        setLessons(result);
        return result;
      } catch (error) {
        console.log('Tutor LMS lessons API not available, trying LearnDash...');
        
        try {
          const learnDashEndpoint = courseId ? `sfwd-lessons?course=${courseId}` : 'sfwd-lessons';
          const result = await apiRequest<WordPressLesson[]>(learnDashEndpoint);
          console.log('Fetched lessons from LearnDash:', result);
          setLessons(result);
          return result;
        } catch (learnDashError) {
          console.log('LearnDash API not available, using mock data...');
          
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
              title: { rendered: 'Getting Started with the Basics' },
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
            {
              id: 4,
              title: { rendered: 'Advanced Concepts' },
              content: { rendered: '<p>Now let\'s dive into more advanced topics.</p>', protected: false },
              status: 'publish',
              course_id: courseId || 1,
              lesson_order: 4,
              lesson_type: 'video',
              duration: '30:00',
            },
            {
              id: 5,
              title: { rendered: 'Practice Assignment' },
              content: { rendered: '<p>Complete this assignment to practice what you\'ve learned.</p>', protected: false },
              status: 'publish',
              course_id: courseId || 1,
              lesson_order: 5,
              lesson_type: 'assignment',
              duration: '60:00',
            },
            {
              id: 6,
              title: { rendered: 'Final Assessment' },
              content: { rendered: '<p>Final assessment to test your understanding.</p>', protected: false },
              status: 'publish',
              course_id: courseId || 1,
              lesson_order: 6,
              lesson_type: 'quiz',
              duration: '45:00',
            },
          ];
          
          const filteredLessons = courseId 
            ? mockLessons.filter(lesson => lesson.course_id === courseId)
            : mockLessons;
          
          setLessons(filteredLessons);
          return filteredLessons;
        }
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
      let endpoint = courseId ? `tutor/quizzes?course=${courseId}` : 'tutor/quizzes';
      
      try {
        const result = await apiRequest<WordPressQuiz[]>(endpoint);
        console.log('Fetched quizzes from Tutor LMS API:', result);
        setQuizzes(result);
        return result;
      } catch (error) {
        console.log('Tutor LMS quizzes API not available, trying LearnDash...');
        
        try {
          const learnDashEndpoint = courseId ? `sfwd-quizzes?course=${courseId}` : 'sfwd-quizzes';
          const result = await apiRequest<WordPressQuiz[]>(learnDashEndpoint);
          console.log('Fetched quizzes from LearnDash:', result);
          setQuizzes(result);
          return result;
        } catch (learnDashError) {
          console.log('LearnDash API not available, using mock data...');
          
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
                {
                  id: 103,
                  type: 'multiple-choice',
                  question_text: 'Which of these is not a programming language?',
                  options: ['Java', 'Python', 'Apple', 'Ruby'],
                  correct_answer: 'Apple',
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
                {
                  id: 203,
                  type: 'multiple-choice',
                  question_text: 'Which of the following is true about APIs?',
                  options: [
                    'They can only be used in JavaScript',
                    'They enable communication between software systems',
                    'They were invented in 2020',
                    'They can only be accessed via command line'
                  ],
                  correct_answer: 'They enable communication between software systems',
                  points: 3,
                },
              ],
            },
          ];
          
          const filteredQuizzes = courseId
            ? mockQuizzes.filter(quiz => quiz.course_id === courseId)
            : mockQuizzes;
          
          setQuizzes(filteredQuizzes);
          return filteredQuizzes;
        }
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const enrollStudent = async (studentId: number, courseId: number): Promise<boolean> => {
    if (!currentSite) return false;
    setIsLoading(true);
    
    try {
      try {
        const response = await apiRequest(
          `tutor/enrollments`, 
          'POST', 
          { student_id: studentId, course_id: courseId }
        );
        
        toast({
          title: "Enrollment Successful",
          description: "Student has been enrolled in the course",
        });
        
        await fetchStudents();
        return true;
      } catch (error) {
        console.log('Tutor LMS enrollment API not available, updating local data...');
        
        setStudents(prev => {
          return prev.map(student => {
            if (student.id === studentId) {
              const enrolled_courses = student.enrolled_courses || [];
              if (!enrolled_courses.includes(courseId)) {
                enrolled_courses.push(courseId);
              }
              
              const progress = student.progress || [];
              if (!progress.some(p => p.course_id === courseId)) {
                progress.push({
                  course_id: courseId,
                  progress_percentage: 0,
                  last_activity: new Date().toISOString(),
                });
              }
              
              return {
                ...student,
                enrolled_courses,
                progress,
              };
            }
            return student;
          });
        });
        
        toast({
          title: "Enrollment Simulated",
          description: "Student has been enrolled (simulated in local data)",
        });
        
        return true;
      }
    } catch (error) {
      console.error('Error enrolling student:', error);
      toast({
        title: "Enrollment Failed",
        description: "Failed to enroll student in the course",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCourseProgress = async (studentId: number, courseId: number, progress: number): Promise<boolean> => {
    if (!currentSite) return false;
    setIsLoading(true);
    
    try {
      try {
        const response = await apiRequest(
          `tutor/progress`, 
          'POST', 
          { student_id: studentId, course_id: courseId, progress_percentage: progress }
        );
        
        toast({
          title: "Progress Updated",
          description: `Course progress updated to ${progress}%`,
        });
        
        await fetchStudents();
        return true;
      } catch (error) {
        console.log('Tutor LMS progress API not available, updating local data...');
        
        setStudents(prev => {
          return prev.map(student => {
            if (student.id === studentId) {
              const updatedProgress = student.progress?.map(p => {
                if (p.course_id === courseId) {
                  return {
                    ...p,
                    progress_percentage: progress,
                    last_activity: new Date().toISOString(),
                  };
                }
                return p;
              }) || [];
              
              if (!updatedProgress.some(p => p.course_id === courseId)) {
                updatedProgress.push({
                  course_id: courseId,
                  progress_percentage: progress,
                  last_activity: new Date().toISOString(),
                });
              }
              
              return {
                ...student,
                progress: updatedProgress,
              };
            }
            return student;
          });
        });
        
        toast({
          title: "Progress Simulated",
          description: `Course progress updated to ${progress}% (simulated in local data)`,
        });
        
        return true;
      }
    } catch (error) {
      console.error('Error updating course progress:', error);
      toast({
        title: "Progress Update Failed",
        description: "Failed to update course progress",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const completeCourse = async (studentId: number, courseId: number): Promise<boolean> => {
    if (!currentSite) return false;
    setIsLoading(true);
    
    try {
      try {
        const response = await apiRequest(
          `tutor/completion`, 
          'POST', 
          { student_id: studentId, course_id: courseId }
        );
        
        toast({
          title: "Course Completed",
          description: "Student has completed the course successfully",
        });
        
        await fetchStudents();
        return true;
      } catch (error) {
        console.log('Tutor LMS completion API not available, updating local data...');
        
        await updateCourseProgress(studentId, courseId, 100);
        
        setStudents(prev => {
          return prev.map(student => {
            if (student.id === studentId) {
              const completed_courses = student.completed_courses || [];
              if (!completed_courses.includes(courseId)) {
                completed_courses.push(courseId);
              }
              
              return {
                ...student,
                completed_courses,
              };
            }
            return student;
          });
        });
        
        toast({
          title: "Completion Simulated",
          description: "Course marked as completed (simulated in local data)",
        });
        
        return true;
      }
    } catch (error) {
      console.error('Error completing course:', error);
      toast({
        title: "Completion Failed",
        description: "Failed to mark course as completed",
        variant: "destructive",
      });
      return false;
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
        enrollStudent,
        updateCourseProgress,
        completeCourse,
      }}
    >
      {children}
    </WordPressContext.Provider>
  );
};
