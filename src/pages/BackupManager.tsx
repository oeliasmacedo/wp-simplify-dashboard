
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useWordPress } from "@/contexts/WordPressContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  CloudUpload, 
  Database, 
  Download, 
  HardDrive, 
  History, 
  RefreshCw, 
  Shield,
  ArrowDownToLine,
  Trash2,
  Calendar
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

// Mock backup type for future integration
interface BackupItem {
  id: string;
  type: 'full' | 'database' | 'files' | 'theme' | 'plugin';
  status: 'completed' | 'in-progress' | 'failed';
  size: string;
  created: Date;
  description: string;
}

const BackupManager = () => {
  const { currentSite, isLoading } = useWordPress();
  const [backups, setBackups] = useState<BackupItem[]>([
    {
      id: '1',
      type: 'full',
      status: 'completed',
      size: '245.8 MB',
      created: new Date(Date.now() - 86400000),
      description: 'Daily automated backup'
    },
    {
      id: '2',
      type: 'database',
      status: 'completed',
      size: '42.5 MB',
      created: new Date(Date.now() - 172800000),
      description: 'Pre-update backup'
    },
    {
      id: '3',
      type: 'files',
      status: 'completed',
      size: '158.3 MB',
      created: new Date(Date.now() - 259200000),
      description: 'Manual backup before theme change'
    }
  ]);
  const [backupInProgress, setBackupInProgress] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('backups');

  const handleCreateBackup = async (type: 'full' | 'database' | 'files') => {
    if (!currentSite) {
      toast({
        title: "Error",
        description: "Please connect a WordPress site first",
        variant: "destructive",
      });
      return;
    }

    setBackupInProgress(true);
    setBackupProgress(0);

    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    // Simulate completion after progress reaches 100%
    setTimeout(() => {
      clearInterval(interval);
      setBackupInProgress(false);
      setBackupProgress(0);
      
      const newBackup: BackupItem = {
        id: Date.now().toString(),
        type,
        status: 'completed',
        size: type === 'full' ? '248.2 MB' : type === 'database' ? '45.7 MB' : '189.3 MB',
        created: new Date(),
        description: `Manual ${type} backup`
      };
      
      setBackups(prev => [newBackup, ...prev]);
      
      toast({
        title: "Backup Completed",
        description: `Your ${type} backup has been created successfully.`,
      });
    }, 6000);
  };

  const handleDownloadBackup = (id: string) => {
    toast({
      title: "Download Started",
      description: "Your backup is being prepared for download.",
    });
    
    // In a real implementation, this would trigger a download of the backup file
    setTimeout(() => {
      toast({
        title: "Download Ready",
        description: "Your backup download has started.",
      });
    }, 2000);
  };

  const handleDeleteBackup = (id: string) => {
    setBackups(prev => prev.filter(backup => backup.id !== id));
    toast({
      title: "Backup Deleted",
      description: "The backup has been permanently deleted.",
    });
  };

  const handleRestoreBackup = (id: string) => {
    toast({
      title: "Restore Initiated",
      description: "Restoration process has begun. This may take several minutes.",
    });
    
    // In a real implementation, this would restore the site from the backup
    setTimeout(() => {
      toast({
        title: "Restore Completed",
        description: "Your site has been restored successfully.",
      });
    }, 5000);
  };

  const getBackupTypeIcon = (type: string) => {
    switch(type) {
      case 'full': return <HardDrive className="h-4 w-4" />;
      case 'database': return <Database className="h-4 w-4" />;
      case 'files': return <CloudUpload className="h-4 w-4" />;
      case 'theme': return <Shield className="h-4 w-4" />;
      case 'plugin': return <Shield className="h-4 w-4" />;
      default: return <HardDrive className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Backup & Restore</h1>
        <Button variant="outline" disabled={isLoading} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </Button>
      </div>

      {!currentSite ? (
        <div className="text-center p-10 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Connect a WordPress Site</h2>
          <p className="mb-6 text-muted-foreground">
            Connect your WordPress site to manage backups and restore points.
          </p>
          <Button disabled>
            <HardDrive className="mr-2 h-4 w-4" />
            <span>Connect WordPress Site</span>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Site Backups</CardTitle>
                <CardDescription>Full site backups including database and files</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{backups.filter(b => b.type === 'full').length}</div>
                <p className="text-sm text-muted-foreground">Latest: {
                  backups.filter(b => b.type === 'full').length > 0 
                    ? format(backups.filter(b => b.type === 'full')[0].created, 'PPP')
                    : 'None'
                }</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleCreateBackup('full')}
                  disabled={backupInProgress}
                >
                  <HardDrive className="mr-2 h-4 w-4" />
                  <span>Create Full Backup</span>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Database Only</CardTitle>
                <CardDescription>Database backups for content and settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{backups.filter(b => b.type === 'database').length}</div>
                <p className="text-sm text-muted-foreground">Latest: {
                  backups.filter(b => b.type === 'database').length > 0 
                    ? format(backups.filter(b => b.type === 'database')[0].created, 'PPP')
                    : 'None'
                }</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleCreateBackup('database')}
                  disabled={backupInProgress}
                  variant="outline"
                >
                  <Database className="mr-2 h-4 w-4" />
                  <span>Backup Database</span>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Files Only</CardTitle>
                <CardDescription>Files, uploads, themes and plugins</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{backups.filter(b => b.type === 'files').length}</div>
                <p className="text-sm text-muted-foreground">Latest: {
                  backups.filter(b => b.type === 'files').length > 0 
                    ? format(backups.filter(b => b.type === 'files')[0].created, 'PPP')
                    : 'None'
                }</p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleCreateBackup('files')}
                  disabled={backupInProgress}
                  variant="outline"
                >
                  <CloudUpload className="mr-2 h-4 w-4" />
                  <span>Backup Files</span>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {backupInProgress && (
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Backup in Progress</CardTitle>
                <CardDescription>Please wait while your backup is being created</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={backupProgress} className="h-2 mb-2" />
                <p className="text-sm text-muted-foreground">{backupProgress}% complete</p>
              </CardContent>
            </Card>
          )}

          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList>
              <TabsTrigger value="backups" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span>Backup History</span>
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Schedule</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="backups">
              {backups.length === 0 ? (
                <div className="text-center p-8 border rounded-md">
                  <p className="text-muted-foreground">No backups found. Create your first backup.</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {backups.map((backup) => (
                        <TableRow key={backup.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getBackupTypeIcon(backup.type)}
                              <span className="capitalize">{backup.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>{format(backup.created, 'PPP p')}</TableCell>
                          <TableCell>{backup.size}</TableCell>
                          <TableCell>{backup.description}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={backup.status === 'completed' ? 'outline' : 
                                       backup.status === 'in-progress' ? 'secondary' : 'destructive'}
                            >
                              {backup.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadBackup(backup.id)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRestoreBackup(backup.id)}
                            >
                              <ArrowDownToLine className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteBackup(backup.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle>Backup Schedule</CardTitle>
                  <CardDescription>Configure automatic backup schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Automated backup scheduling will be available in the next update.</p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Daily Database Backup</h3>
                        <p className="text-sm text-muted-foreground">Every day at 1:00 AM</p>
                      </div>
                      <Badge variant="outline">Coming Soon</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Weekly Full Backup</h3>
                        <p className="text-sm text-muted-foreground">Every Sunday at 2:00 AM</p>
                      </div>
                      <Badge variant="outline">Coming Soon</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Pre-Update Backup</h3>
                        <p className="text-sm text-muted-foreground">Before WordPress updates</p>
                      </div>
                      <Badge variant="outline">Coming Soon</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </DashboardLayout>
  );
};

export default BackupManager;
