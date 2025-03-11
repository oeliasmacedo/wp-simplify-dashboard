
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContentOverview } from "@/types/wordpress";
import { FileText, Users, MessageSquare, Tag, FolderTree } from "lucide-react";

interface ContentOverviewCardProps {
  data?: ContentOverview;
}

export function ContentOverviewCard({ data }: ContentOverviewCardProps) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Content Overview</CardTitle>
          <CardDescription>Content statistics not available</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <p className="text-muted-foreground">Connect a WordPress site to view content metrics</p>
        </CardContent>
      </Card>
    );
  }

  const contentItems = [
    {
      id: 1,
      name: "Posts",
      value: data.posts,
      icon: FileText,
    },
    {
      id: 2,
      name: "Pages",
      value: data.pages,
      icon: FolderTree,
    },
    {
      id: 3,
      name: "Users",
      value: data.users,
      icon: Users,
    },
    {
      id: 4,
      name: "Comments",
      value: data.comments,
      icon: MessageSquare,
    },
    {
      id: 5,
      name: "Categories & Tags",
      value: data.categories + data.tags,
      icon: Tag,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Overview</CardTitle>
        <CardDescription>
          Summary of your WordPress content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contentItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b pb-2 last:border-0">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-primary/10">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">{item.name}</span>
              </div>
              <span className="text-xl font-bold">{item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
