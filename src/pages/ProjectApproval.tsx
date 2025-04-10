
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, ChevronRight } from "lucide-react";
import { useProjects } from "@/context/ProjectContext";
import { useAuth, User } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";

const ProjectApproval = () => {
  const navigate = useNavigate();
  const { projects, approveProject, rejectProject } = useProjects();
  const { user } = useAuth();
  
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [developer, setDeveloper] = useState("");
  const [deadline, setDeadline] = useState("");
  
  // Get all unapproved projects
  const pendingProjects = projects.filter(project => !project.approved);
  
  // Get all developers from the mock data
  const developers: User[] = [
    { id: "3", name: "Developer 1", email: "dev1@cmtai.com", role: "developer" },
    { id: "4", name: "Developer 2", email: "dev2@cmtai.com", role: "developer" },
  ];
  
  const handleApprove = () => {
    if (selectedProject && developer && deadline) {
      approveProject(selectedProject, developer, deadline);
      setSelectedProject(null);
      setDeveloper("");
      setDeadline("");
    }
  };
  
  const handleReject = (projectId: string) => {
    rejectProject(projectId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 px-4 md:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Project Approval</h1>
          <p className="text-gray-500 mt-1">
            Review and assign new projects to developers
          </p>
        </div>

        {pendingProjects.length === 0 ? (
          <Card>
            <CardContent className="py-10">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">No projects pending approval</h3>
                <p className="text-gray-500 mb-4">
                  All projects have been reviewed and assigned.
                </p>
                <Button onClick={() => navigate("/dashboard")}>
                  Return to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span>{project.clientName}</span>
                    <span className="reference-id">{project.referenceId}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Description</h4>
                      <p className="text-gray-600">{project.description}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Requirements</h4>
                      <p className="text-gray-600 whitespace-pre-line">{project.requirements}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Client Email</h4>
                        <p className="text-gray-600">{project.clientEmail}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Client Phone</h4>
                        <p className="text-gray-600">{project.clientPhone}</p>
                      </div>
                    </div>
                    <div className="pt-2 flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReject(project.id)}
                        className="flex items-center"
                      >
                        <XCircle className="h-4 w-4 mr-1 text-destructive" />
                        Reject
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => setSelectedProject(project.id)}
                        className="flex items-center"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve & Assign
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Project</DialogTitle>
              <DialogDescription>
                Select a developer and set a deadline for this project
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="developer" className="text-sm font-medium">
                  Assign to Developer
                </label>
                <Select
                  value={developer}
                  onValueChange={setDeveloper}
                >
                  <SelectTrigger id="developer">
                    <SelectValue placeholder="Select a developer" />
                  </SelectTrigger>
                  <SelectContent>
                    {developers.map((dev) => (
                      <SelectItem key={dev.id} value={dev.id}>
                        {dev.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="deadline" className="text-sm font-medium">
                  Project Deadline
                </label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setSelectedProject(null)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleApprove} disabled={!developer || !deadline}>
                Assign Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProjectApproval;
