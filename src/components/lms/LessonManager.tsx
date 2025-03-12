
import React, { useState, useEffect } from "react";
import { useWordPress } from "@/contexts/WordPressContext";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Plus,
  FileText,
  Video,
  ListChecks
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import LessonItem from "./LessonItem";
import QuizItem from "./QuizItem";
import SearchBar from "./SearchBar";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";

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
  }, [courseId, fetchLessons, fetchQuizzes]);
  
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
          <SearchBar 
            value={searchTerm}
            onChange={setSearchTerm}
          />
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
            <LoadingState />
          ) : filteredLessons.length === 0 ? (
            <EmptyState message="No lessons found. Create your first lesson!" />
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
                    <LessonItem 
                      key={lesson.id}
                      lesson={lesson} 
                      getIcon={getIcon}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="quizzes">
          {isLoading ? (
            <LoadingState count={2} />
          ) : filteredQuizzes.length === 0 ? (
            <EmptyState message="No quizzes found. Create your first quiz!" />
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
                    <QuizItem 
                      key={quiz.id}
                      quiz={quiz} 
                    />
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
