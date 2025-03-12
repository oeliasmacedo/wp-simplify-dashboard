
import React, { useState, useEffect } from "react";
import { useWordPress } from "@/contexts/WordPressContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Users,
  Clock,
  CalendarDays,
  GraduationCap,
  BookOpen,
  RefreshCw,
  Award,
  BarChart3,
  Pencil
} from "lucide-react";
import { WordPressCourse, WordPressUser } from "@/types/wordpress";
import LessonManager from "./LessonManager";

interface CourseDetailsProps {
  courseId: number;
  onBack: () => void;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({ courseId, onBack }) => {
  const { courses, users, lessons, students, fetchCourses, fetchLessons, fetchStudents } = useWordPress();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchCourses(),
          fetchLessons(courseId),
          fetchStudents()
        ]);
      } catch (error) {
        console.error("Failed to load course details", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [courseId]);
  
  const course = courses.find(c => c.id === courseId);
  
  if (!course) {
    return (
      <div className="p-8 text-center">
        <p>Course not found. Please select another course.</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>
      </div>
    );
  }
  
  // Get instructor data
  const instructor = users.find(user => user.id === course.instructor) || users[0];
  
  // Filter students enrolled in this course
  const enrolledStudents = students.filter(student => 
    student.enrolled_courses?.includes(courseId)
  );
  
  // Calculate completion rate
  const completedStudents = students.filter(student => 
    student.completed_courses?.includes(courseId)
  );
  
  const completionRate = enrolledStudents.length 
    ? Math.round((completedStudents.length / enrolledStudents.length) * 100) 
    : 0;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>
        <Button onClick={() => fetchCourses()} variant="outline" size="sm" disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">
                  <div dangerouslySetInnerHTML={{ __html: course.title.rendered }} />
                </CardTitle>
                {course.difficulty_level && (
                  <Badge variant="outline" className="mt-2">
                    {course.difficulty_level}
                  </Badge>
                )}
              </div>
              <Button variant="outline" size="sm" disabled>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Course
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{course.enrolled_students || 0} students enrolled</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{course.course_duration || "8 weeks"}</span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-1" />
                  <span>Updated {new Date(course.modified).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Course Description</h3>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: course.content.rendered }} 
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Instructor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  {instructor && instructor.avatar_urls && (
                    <AvatarImage 
                      src={Object.values(instructor.avatar_urls)[0]?.toString()} 
                      alt={instructor?.name || "Instructor"} 
                    />
                  )}
                  <AvatarFallback>{instructor?.name?.charAt(0) || "I"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{instructor?.name || "Admin"}</p>
                  <p className="text-sm text-muted-foreground">Instructor</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Course Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Completion Rate</span>
                  <span className="font-medium">{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg flex flex-col items-center">
                  <BookOpen className="h-4 w-4 mb-1 text-muted-foreground" />
                  <span className="text-xl font-semibold">{lessons.length}</span>
                  <span className="text-xs text-muted-foreground">Lessons</span>
                </div>
                <div className="p-3 bg-muted rounded-lg flex flex-col items-center">
                  <GraduationCap className="h-4 w-4 mb-1 text-muted-foreground" />
                  <span className="text-xl font-semibold">{enrolledStudents.length}</span>
                  <span className="text-xs text-muted-foreground">Students</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Tabs defaultValue="content" className="mt-8">
        <TabsList>
          <TabsTrigger value="content">
            <BookOpen className="h-4 w-4 mr-2" />
            Course Content
          </TabsTrigger>
          <TabsTrigger value="students">
            <Users className="h-4 w-4 mr-2" />
            Enrolled Students
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="pt-4">
          <LessonManager courseId={courseId} />
        </TabsContent>
        
        <TabsContent value="students" className="pt-4">
          <div className="rounded-md border">
            {enrolledStudents.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No students enrolled in this course yet.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="h-12 px-4 text-left align-middle font-medium">Student</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Progress</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Enrollment Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {enrolledStudents.map(student => {
                    const courseProgress = student.progress?.find(p => p.course_id === courseId);
                    const progressValue = courseProgress?.progress_percentage || 0;
                    
                    return (
                      <tr key={student.id} className="border-b">
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              {student.avatar_urls && (
                                <AvatarImage 
                                  src={Object.values(student.avatar_urls)[0]?.toString()} 
                                  alt={student.name} 
                                />
                              )}
                              <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-xs text-muted-foreground">{student.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            <Progress value={progressValue} className="h-2 w-[100px]" />
                            <span className="text-sm">{progressValue}%</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle text-sm">
                          {new Date().toLocaleDateString()}
                        </td>
                        <td className="p-4 align-middle">
                          {student.completed_courses?.includes(courseId) ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              <Award className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          ) : (
                            <Badge variant="outline">In Progress</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="pt-4">
          <div className="rounded-md border p-8 text-center">
            <p className="text-muted-foreground">Course analytics coming soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseDetails;
