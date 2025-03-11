
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { SitesManager } from "@/components/SitesManager";
import { useWordPress } from "@/contexts/WordPressContext";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ConnectSiteWizard } from "@/components/ConnectSiteWizard";

const UserManager = () => {
  const { currentSite } = useWordPress();
  const [wizardOpen, setWizardOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="grid gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          {!currentSite && (
            <Button onClick={() => setWizardOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Connect WordPress Site
            </Button>
          )}
        </div>

        {!currentSite ? (
          <SitesManager />
        ) : (
          <div>
            {/* WordPress users management will go here in future */}
            <p className="text-muted-foreground">
              Connected to {currentSite.name}. User management features coming soon.
            </p>
          </div>
        )}

        <ConnectSiteWizard 
          open={wizardOpen} 
          onOpenChange={setWizardOpen} 
        />
      </div>
    </DashboardLayout>
  );
};

export default UserManager;
