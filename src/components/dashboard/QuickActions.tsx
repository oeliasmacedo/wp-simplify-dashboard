
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FilePlus, Upload, UserPlus, Package } from "lucide-react";

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common tasks you might want to perform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="flex flex-col h-24 items-center justify-center gap-1"
          >
            <FilePlus className="h-5 w-5" />
            <span className="text-xs">New Post</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col h-24 items-center justify-center gap-1"
          >
            <Upload className="h-5 w-5" />
            <span className="text-xs">Upload Media</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col h-24 items-center justify-center gap-1"
          >
            <UserPlus className="h-5 w-5" />
            <span className="text-xs">Add User</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col h-24 items-center justify-center gap-1"
          >
            <Package className="h-5 w-5" />
            <span className="text-xs">Manage Plugins</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
