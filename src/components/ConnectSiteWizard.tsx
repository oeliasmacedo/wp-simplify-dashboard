
import React, { useState } from "react";
import { useWordPress } from "@/contexts/WordPressContext";
import { WordPressConnectionCredentials } from "@/types/wordpress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Key, Lock, User } from "lucide-react";
import { Label } from "@/components/ui/label";

interface ConnectSiteWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConnectSiteWizard({ open, onOpenChange }: ConnectSiteWizardProps) {
  const { connectSite, testConnection, isConnecting } = useWordPress();
  const [step, setStep] = useState(1);
  const [authType, setAuthType] = useState<'application_password' | 'jwt'>('application_password');
  const [credentials, setCredentials] = useState<WordPressConnectionCredentials>({
    url: '',
    username: '',
    applicationPassword: '',
    token: '',
    authType: 'application_password',
  });
  const [testingConnection, setTestingConnection] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleAuthTypeChange = (value: string) => {
    if (value === 'application_password' || value === 'jwt') {
      setAuthType(value);
      setCredentials(prev => ({ ...prev, authType: value }));
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    const success = await testConnection(credentials);
    setTestingConnection(false);
    
    if (success) {
      setStep(3);
    }
  };

  const handleConnect = async () => {
    const success = await connectSite(credentials);
    if (success) {
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setCredentials({
      url: '',
      username: '',
      applicationPassword: '',
      token: '',
      authType: 'application_password',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Connect WordPress Site</DialogTitle>
          <DialogDescription>
            Connect your WordPress site to manage it remotely
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="url">WordPress Site URL</Label>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <Input
                  id="url"
                  name="url"
                  placeholder="https://yoursite.com"
                  value={credentials.url}
                  onChange={handleInputChange}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Enter the complete URL of your WordPress site
              </p>
            </div>

            <DialogFooter>
              <Button onClick={() => setStep(2)}>Next</Button>
            </DialogFooter>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-4">
            <Tabs defaultValue="application_password" onValueChange={handleAuthTypeChange}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="application_password">Application Password</TabsTrigger>
                <TabsTrigger value="jwt">JWT Auth</TabsTrigger>
              </TabsList>
              
              <TabsContent value="application_password" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">WordPress Username</Label>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="username"
                      name="username"
                      placeholder="admin"
                      value={credentials.username}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="applicationPassword">Application Password</Label>
                  <div className="flex items-center space-x-2">
                    <Key className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="applicationPassword"
                      name="applicationPassword"
                      type="password"
                      placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
                      value={credentials.applicationPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Generate this in your WordPress admin under Users → Profile → Application Passwords
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="jwt" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">WordPress Username</Label>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="username"
                      name="username"
                      placeholder="admin"
                      value={credentials.username}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="token">JWT Token</Label>
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <Input
                      id="token"
                      name="token"
                      type="password"
                      placeholder="eyJhbGciOiJIUzI1..."
                      value={credentials.token}
                      onChange={handleInputChange}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Requires JWT Authentication plugin installed on your WordPress site
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button 
                onClick={handleTestConnection} 
                disabled={testingConnection}
              >
                {testingConnection ? "Testing..." : "Test Connection"}
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 py-4">
            <div className="rounded-md bg-green-50 p-4 border border-green-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Connection successful!</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Your site is ready to be connected to the dashboard.</p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button 
                onClick={handleConnect}
                disabled={isConnecting}
              >
                {isConnecting ? "Connecting..." : "Add to Dashboard"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
