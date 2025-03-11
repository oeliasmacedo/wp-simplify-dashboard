
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, User, Package, Database, RefreshCw } from "lucide-react";

// Mock data for recent activities
const activities = [
  {
    id: 1,
    type: "post",
    title: "New Blog Post: 'Summer Collection'",
    user: "Jane Cooper",
    timestamp: "2 hours ago",
    icon: FileText,
  },
  {
    id: 2,
    type: "user",
    title: "User 'Steve Johnson' created",
    user: "Admin",
    timestamp: "Yesterday",
    icon: User,
  },
  {
    id: 3,
    type: "plugin",
    title: "WooCommerce plugin updated to v7.1",
    user: "System",
    timestamp: "2 days ago",
    icon: Package,
  },
  {
    id: 4,
    type: "backup",
    title: "Automatic backup completed",
    user: "System",
    timestamp: "3 days ago",
    icon: Database,
  },
];

export function RecentActivityList() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest actions and updates from your site
          </CardDescription>
        </div>
        <Button variant="ghost" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary">
                  <activity.icon className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>by {activity.user}</span>
                  <span className="mx-1">•</span>
                  <span>{activity.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
