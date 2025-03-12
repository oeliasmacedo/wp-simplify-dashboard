
import React, { useState, useEffect } from "react";
import { useWordPress } from "@/contexts/WordPressContext";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Pencil, 
  Trash2, 
  MoreHorizontal, 
  Search, 
  Plus,
  Clock,
  FileText,
  Video,
  ListChecks
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WordPressCourse, WordPressLesson, WordPressQuiz } from "@/types/wordpress";
import { toast } from "@/hooks/use-toast";

interface LessonManagerProps {
  courseId?: number;
}

const LessonManager: React.FC<LessonManagerProps> = ({ courseId }) => {
  const { lessons, quizzes, fetchLessons, fetchQuizzes, isLoading } = useWordPress();
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchLessons(courseId),
          fetchQuizzes(courseId)
        ]);
      } catch (error) {
        console.error("Failed to load lessons and quizzes", error);
        toast({
          title: "Failed to load content",
          description: "Could not load lessons and quizzes. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    loadData();
  }, [courseId]);
  
  // Filter lessons based on search term
  const filteredLessons = lessons.filter(lesson => 
    lesson.title.rendered.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter quizzes based on search term
  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title.rendered.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getIcon = (type: string) => {
    switch(type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'text':
        return <FileText className="h-4 w-4" />;
      case 'quiz':
        return <ListChecks className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {courseId ? "Course Content" : "All Content"}
        </h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search content..." 
              className="pl-8 w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button disabled size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            Add Content
          </Button>
        </div>
      </div>

      <Tabs defaultValue="lessons" className="space-y-4">
        <TabsList>
          <TabsTrigger value="lessons">
            <BookOpen className="h-4 w-4 mr-2" />
            Lessons
          </TabsTrigger>
          <TabsTrigger value="quizzes">
            <ListChecks className="h-4 w-4 mr-2" />
            Quizzes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="lessons">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-md">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredLessons.length === 0 ? (
            <div className="rounded-md border p-8 text-center">
              <p className="text-muted-foreground">
                No lessons found. Create your first lesson!
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lesson Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLessons.map(lesson => (
                    <TableRow key={lesson.id}>
                      <TableCell className="font-medium">
                        <div dangerouslySetInnerHTML={{ __html: lesson.title.rendered }} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getIcon(lesson.lesson_type)}
                          <span className="capitalize">{lesson.lesson_type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{lesson.duration}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Pencil className="h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 text-destructive">
                              <Trash2 className="h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="quizzes">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="flex items-center space-x-4 p-4 border rounded-md">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="rounded-md border p-8 text-center">
              <p className="text-muted-foreground">
                No quizzes found. Create your first quiz!
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quiz Title</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Passing Grade</TableHead>
                    <TableHead>Time Limit</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuizzes.map(quiz => (
                    <TableRow key={quiz.id}>
                      <TableCell className="font-medium">
                        <div dangerouslySetInnerHTML={{ __html: quiz.title.rendered }} />
                      </TableCell>
                      <TableCell>{quiz.questions?.length || 0}</TableCell>
                      <TableCell>
                        {quiz.passing_grade ? `${quiz.passing_grade}%` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {quiz.time_limit ? `${quiz.time_limit} min` : 'No limit'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Pencil className="h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 text-destructive">
                              <Trash2 className="h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LessonManager;
