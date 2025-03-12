
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { WordPressQuiz } from "@/types/wordpress";

interface QuizItemProps {
  quiz: WordPressQuiz;
}

const QuizItem: React.FC<QuizItemProps> = ({ quiz }) => {
  return (
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
  );
};

export default QuizItem;
