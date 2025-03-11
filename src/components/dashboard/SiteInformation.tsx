
import { useWordPress } from "@/contexts/WordPressContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConnectSiteWizard } from "@/components/ConnectSiteWizard";
import { useState } from "react";
import { Globe, PlusCircle } from "lucide-react";

export function SiteInformation() {
  const { currentSite } = useWordPress();
  const [wizardOpen, setWizardOpen] = useState(false);

  if (!currentSite) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>WordPress Site</CardTitle>
          <CardDescription>
            Connect your WordPress site to manage it remotely
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center text-center p-4">
            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="mb-4">No WordPress site connected</p>
            <Button onClick={() => setWizardOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Connect Site
            </Button>
            <ConnectSiteWizard open={wizardOpen} onOpenChange={setWizardOpen} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected WordPress Site</CardTitle>
        <CardDescription>
          Currently managing {currentSite.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="font-medium">URL: </span>
            <span className="text-muted-foreground">{currentSite.url}</span>
          </div>
          <div>
            <span className="font-medium">Username: </span>
            <span className="text-muted-foreground">{currentSite.username}</span>
          </div>
          <div>
            <span className="font-medium">Authentication: </span>
            <span className="text-muted-foreground">
              {currentSite.authType === 'application_password' ? 'Application Password' : 'JWT Token'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
