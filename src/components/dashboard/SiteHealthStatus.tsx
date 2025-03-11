
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, AlertTriangle, X } from "lucide-react";

// Mock data for site health issues
const healthItems = [
  {
    id: 1,
    status: "good",
    message: "WordPress version is up to date",
  },
  {
    id: 2,
    status: "warning",
    message: "3 plugin updates available",
  },
  {
    id: 3,
    status: "good",
    message: "PHP version is up to date",
  },
  {
    id: 4,
    status: "error",
    message: "SSL certificate expires in 5 days",
  },
  {
    id: 5,
    status: "good",
    message: "Database is optimized",
  },
];

export function SiteHealthStatus() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <Check className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "error":
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Health</CardTitle>
        <CardDescription>
          Current status and potential issues
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {healthItems.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-lg border p-3">
              <div>{getStatusIcon(item.status)}</div>
              <div className="text-sm">{item.message}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
