
import React, { useState } from "react";
import { useWordPress } from "@/contexts/WordPressContext";
import { ConnectSiteWizard } from "@/components/ConnectSiteWizard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, MoreVertical, PlusCircle, RefreshCw, Trash } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export function SitesManager() {
  const { sites, currentSite, disconnectSite, switchSite } = useWordPress();
  const [wizardOpen, setWizardOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Connected Sites</h2>
        <Button onClick={() => setWizardOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Connect New Site
        </Button>
      </div>

      {sites.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[200px] text-center">
            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No WordPress Sites Connected</h3>
            <p className="text-muted-foreground mb-4">
              Connect your first WordPress site to start managing it remotely.
            </p>
            <Button onClick={() => setWizardOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Connect Site
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <Card 
              key={site.id} 
              className={`transition-all ${currentSite?.id === site.id ? 'ring-2 ring-primary' : ''}`}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-primary" />
                    <CardTitle className="text-lg">{site.name}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Site Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => switchSite(site.id)}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        <span>Switch to Site</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive" 
                        onClick={() => disconnectSite(site.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Disconnect Site</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4 truncate">
                  {site.url}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    {site.authType === 'application_password' ? 'App Password' : 'JWT'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {site.username}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="pt-1 text-xs text-muted-foreground">
                {site.lastConnected && (
                  <span>Last connected: {format(new Date(site.lastConnected), 'PPP')}</span>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <ConnectSiteWizard 
        open={wizardOpen} 
        onOpenChange={setWizardOpen} 
      />
    </div>
  );
}
