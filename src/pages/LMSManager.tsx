
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BookOpen, 
  Pencil, 
  MoreHorizontal, 
  Trash2, 
  Search, 
  Filter,
  RefreshCw,
  Users,
  GraduationCap,
  BookmarkPlus,
  Clock
} from "lucide-react";
import { useWordPress } from "@/contexts/WordPressContext";
import { ConnectSiteWizard } from "@/components/ConnectSiteWizard";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const LMSManager = () => {
  const { 
    currentSite, 
    courses, 
    students, 
    fetchCourses, 
    fetchStudents,
    isLoading 
  } = useWordPress();
  const [searchTerm, setSearchTerm] = useState("");
  const [wizardOpen, setWizardOpen] = useState(false);

  // Filter content based on search term
  const filteredCourses = courses.filter(course => 
    course.title.rendered.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle refresh data
  const handleRefresh = async () => {
    await Promise.all([fetchCourses(), fetchStudents()]);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">LMS Manager</h1>
        <div className="flex gap-2">
          {currentSite && (
            <Button variant="outline" onClick={handleRefresh} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          )}
          {!currentSite && (
            <Button onClick={() => setWizardOpen(true)}>
              <BookmarkPlus className="mr-2 h-4 w-4" />
              <span>Connect WordPress Site</span>
            </Button>
          )}
        </div>
      </div>

      {!currentSite ? (
        <div className="text-center p-10 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Connect a WordPress Site</h2>
          <p className="mb-6 text-muted-foreground">
            Connect your WordPress site with LMS functionality to manage courses from this dashboard.
          </p>
          <Button onClick={() => setWizardOpen(true)}>
            <BookmarkPlus className="mr-2 h-4 w-4" />
            <span>Connect WordPress Site</span>
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="courses" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Courses</span>
              </TabsTrigger>
              <TabsTrigger value="students" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Students</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search..." 
                  className="pl-8 w-[200px] lg:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="courses">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
              <DashboardMetricCard
                title="Total Courses"
                value={courses.length}
                icon={<BookOpen className="h-5 w-5" />}
              />
              <DashboardMetricCard
                title="Total Students"
                value={students.length}
                icon={<Users className="h-5 w-5" />}
              />
              <DashboardMetricCard
                title="Course Completion"
                value="68%"
                icon={<GraduationCap className="h-5 w-5" />}
              />
            </div>
            
            {isLoading ? (
              <LoadingContent />
            ) : (
              <CourseTable 
                courses={filteredCourses}
              />
            )}
          </TabsContent>

          <TabsContent value="students">
            {isLoading ? (
              <LoadingContent />
            ) : (
              <StudentTable 
                students={filteredStudents}
              />
            )}
          </TabsContent>
        </Tabs>
      )}

      <ConnectSiteWizard 
        open={wizardOpen} 
        onOpenChange={setWizardOpen} 
      />
    </DashboardLayout>
  );
};

type DashboardMetricCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
};

const DashboardMetricCard = ({ title, value, icon }: DashboardMetricCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

const CourseTable = ({ courses }) => {
  if (courses.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">
          No courses found. Create your first course!
        </p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch (e) {
      return dateString || '';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Students</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell className="font-medium">
                <div dangerouslySetInnerHTML={{ __html: course.title.rendered }} />
                <div className="text-xs text-muted-foreground mt-1">
                  {course.difficulty_level && (
                    <Badge variant="outline" className="mr-2">
                      {course.difficulty_level}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{course.instructor || "Admin"}</TableCell>
              <TableCell>{course.enrolled_students || 0}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{course.course_duration || "8 weeks"}</span>
                </div>
              </TableCell>
              <TableCell>{formatDate(course.modified)}</TableCell>
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
                    <DropdownMenuItem className="flex items-center gap-2">
                      <a href={course.link} target="_blank" rel="noopener noreferrer" 
                        className="flex items-center gap-2 w-full">
                        <BookOpen className="h-4 w-4" />
                        <span>View</span>
                      </a>
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
  );
};

const StudentTable = ({ students }) => {
  if (students.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">
          No students found.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Enrolled Courses</TableHead>
            <TableHead>Completed Courses</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 mr-2 flex items-center justify-center">
                    {student.avatar_urls && Object.values(student.avatar_urls)[0] ? (
                      <img 
                        src={Object.values(student.avatar_urls)[0].toString()} 
                        alt={student.name} 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <Users className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div>{student.name}</div>
                    <div className="text-xs text-muted-foreground">{student.email || student.slug}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{student.enrolled_courses?.length || 0}</TableCell>
              <TableCell>{student.completed_courses?.length || 0}</TableCell>
              <TableCell>
                {student.progress && student.progress.length > 0 ? (
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${student.progress[0].progress_percentage}%` }}>
                      </div>
                    </div>
                    <span className="text-xs">{student.progress[0].progress_percentage}%</span>
                  </div>
                ) : (
                  <span>No progress data</span>
                )}
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
                    <DropdownMenuItem className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>View Progress</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 text-destructive">
                      <Trash2 className="h-4 w-4" />
                      <span>Remove</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const LoadingContent = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center space-x-4 p-4 border rounded-md">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    ))}
  </div>
);

export default LMSManager;
