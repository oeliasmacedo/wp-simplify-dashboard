
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, User, Package, Database, RefreshCw, Clock } from "lucide-react";
import { useWordPress } from "@/contexts/WordPressContext";

// Mock data for recent activities
const defaultActivities = [
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
  const { posts, users } = useWordPress();
  
  // Generate more realistic activities based on actual WordPress data
  const generateActivities = () => {
    const activities = [...defaultActivities];
    
    // Add activities based on real posts if available
    if (posts && posts.length > 0) {
      // Get the 2 most recent posts
      const recentPosts = [...posts]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 2);
      
      recentPosts.forEach((post, index) => {
        // Format the date
        const postDate = new Date(post.date);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - postDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let timeAgo;
        if (diffDays === 0) {
          timeAgo = "Today";
        } else if (diffDays === 1) {
          timeAgo = "Yesterday";
        } else if (diffDays < 7) {
          timeAgo = `${diffDays} days ago`;
        } else {
          timeAgo = postDate.toLocaleDateString();
        }
        
        activities.unshift({
          id: 100 + index,
          type: "post",
          title: `New post published: '${post.title.rendered}'`,
          user: users.find(u => u.id === post.author)?.name || "Admin",
          timestamp: timeAgo,
          icon: FileText,
        });
      });
    }
    
    // Return only the most recent 5 activities
    return activities.slice(0, 5);
  };

  const activities = generateActivities();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
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
