
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, MoreHorizontal, Clock } from "lucide-react";
import { WordPressLesson } from "@/types/wordpress";

interface LessonItemProps {
  lesson: WordPressLesson;
  getIcon: (type: string) => React.ReactNode;
}

const LessonItem: React.FC<LessonItemProps> = ({ lesson, getIcon }) => {
  return (
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
  );
};

export default LessonItem;
