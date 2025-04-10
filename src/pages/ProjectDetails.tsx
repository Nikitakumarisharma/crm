
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProjects, ProjectStatus } from "@/context/ProjectContext";
import { useAuth } from "@/context/AuthContext";
import { ProjectStatusBadge } from "@/components/ProjectStatusBadge";
import { Navbar } from "@/components/Navbar";
import { 
  Calendar, 
  Clock, 
  Edit, 
  Plus, 
  User, 
  FileText, 
  Key,
  RefreshCw 
} from "lucide-react";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProjectById, updateProjectStatus, addProjectNote, addCredential, updateCompletionDate, updateRenewalDate } = useProjects();
  const { user } = useAuth();
  
  const project = getProjectById(id || "");
  
  const [status, setStatus] = useState<ProjectStatus>(project?.status || "requirements");
  const [note, setNote] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [credentialType, setCredentialType] = useState("domain");
  const [credentialName, setCredentialName] = useState("");
  const [credentialValue, setCredentialValue] = useState("");
  const [completionDate, setCompletionDate] = useState(project?.completionDate || "");
  const [renewalDate, setRenewalDate] = useState(project?.renewalDate || "");
  
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
          <Button onClick={() => navigate("/dashboard")}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  const assignedDeveloper = project.assignedTo ? 
    (project.assignedTo === "3" ? "Developer 1" : "Developer 2") : 
    "Not assigned";

  const salesUser = "Sales User";
  
  const handleStatusChange = () => {
    updateProjectStatus(project.id, status);
  };
  
  const handleAddNote = () => {
    if (!note.trim()) return;
    
    addProjectNote(project.id, {
      content: note,
      author: user?.name || "Unknown",
      isPublic,
    });
    
    setNote("");
    setIsPublic(false);
  };
  
  const handleAddCredential = () => {
    if (!credentialName.trim() || !credentialValue.trim()) return;
    
    addCredential(project.id, {
      type: credentialType,
      name: credentialName,
      value: credentialValue,
    });
    
    setCredentialType("domain");
    setCredentialName("");
    setCredentialValue("");
  };
  
  const handleUpdateCompletionDate = () => {
    if (!completionDate) return;
    updateCompletionDate(project.id, completionDate);
  };
  
  const handleUpdateRenewalDate = () => {
    if (!renewalDate) return;
    updateRenewalDate(project.id, renewalDate);
  };
  
  const isDeveloper = user?.role === "developer";
  const isCTO = user?.role === "cto";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.clientName}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="reference-id">{project.referenceId}</span>
              <ProjectStatusBadge status={project.status} />
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard")}
            className="mt-4 md:mt-0"
          >
            Back to Dashboard
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <User className="h-4 w-4 mr-2" />
                Client Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Name:</span>
                  <p className="font-medium">{project.clientName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Email:</span>
                  <p className="font-medium">{project.clientEmail}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Phone:</span>
                  <p className="font-medium">{project.clientPhone}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Created by:</span>
                  <p className="font-medium">{salesUser}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Assigned to:</span>
                  <p className="font-medium">{assignedDeveloper}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Created on:</span>
                  <p className="font-medium">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Important Dates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {project.deadline && (
                  <div>
                    <span className="text-sm text-gray-500">Deadline:</span>
                    <p className="font-medium">
                      {new Date(project.deadline).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {project.completionDate && (
                  <div>
                    <span className="text-sm text-gray-500">Completion Date:</span>
                    <p className="font-medium">
                      {new Date(project.completionDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {project.renewalDate && (
                  <div>
                    <span className="text-sm text-gray-500">Renewal Date:</span>
                    <p className="font-medium">
                      {new Date(project.renewalDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{project.description}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Project Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{project.requirements}</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="notes" className="mb-6">
          <TabsList>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            {isDeveloper && (
              <>
                <TabsTrigger value="status">Update Status</TabsTrigger>
                <TabsTrigger value="credentials">Store Credentials</TabsTrigger>
                <TabsTrigger value="dates">Important Dates</TabsTrigger>
              </>
            )}
          </TabsList>
          
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Project Notes</CardTitle>
                <CardDescription>
                  View and add notes for this project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {project.notes.length > 0 ? (
                    project.notes
                      .filter(note => isCTO || isDeveloper || user?.id === project.createdBy || note.isPublic)
                      .map((note) => (
                        <div key={note.id} className="p-4 border rounded-lg bg-gray-50">
                          <div className="flex justify-between items-start">
                            <p className="whitespace-pre-line">{note.content}</p>
                            {note.isPublic && (
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                Public
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
                            <span>By: {note.author}</span>
                            <span>{new Date(note.createdAt).toLocaleString()}</span>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No notes added yet</p>
                  )}
                </div>
                
                {(isDeveloper || isCTO || user?.id === project.createdBy) && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-sm font-medium">Add New Note</h3>
                    <Textarea 
                      placeholder="Enter your note here..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={4}
                    />
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2 text-sm">
                        <input 
                          type="checkbox" 
                          checked={isPublic} 
                          onChange={(e) => setIsPublic(e.target.checked)}
                          className="form-checkbox"
                        />
                        <span>Make visible to client</span>
                      </label>
                      <Button 
                        onClick={handleAddNote}
                        disabled={!note.trim()}
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Note
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {isDeveloper && (
            <>
              <TabsContent value="status">
                <Card>
                  <CardHeader>
                    <CardTitle>Update Project Status</CardTitle>
                    <CardDescription>
                      Change the current status of this project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="status" className="text-sm font-medium">
                          Current Status:
                        </label>
                        <div className="mb-4">
                          <ProjectStatusBadge status={project.status} />
                        </div>
                        <Select
                          value={status}
                          onValueChange={(value) => setStatus(value as ProjectStatus)}
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select new status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="requirements">Waiting for Requirements</SelectItem>
                            <SelectItem value="development">Development In Progress</SelectItem>
                            <SelectItem value="payment">Waiting for Payment</SelectItem>
                            <SelectItem value="credentials">Waiting for Credentials</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        onClick={handleStatusChange}
                        disabled={status === project.status}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Update Status
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="credentials">
                <Card>
                  <CardHeader>
                    <CardTitle>Store Project Credentials</CardTitle>
                    <CardDescription>
                      Securely store important project credentials
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {project.credentials.length > 0 ? (
                        <div className="space-y-4">
                          {project.credentials.map((cred) => (
                            <div key={cred.id} className="p-4 border rounded-lg bg-gray-50">
                              <div className="flex justify-between">
                                <div>
                                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full mb-2 inline-block">
                                    {cred.type.charAt(0).toUpperCase() + cred.type.slice(1)}
                                  </span>
                                  <h4 className="font-medium">{cred.name}</h4>
                                  <p className="font-mono text-sm mt-1 bg-gray-100 p-1 rounded">
                                    {cred.value}
                                  </p>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {new Date(cred.dateAdded).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">No credentials stored yet</p>
                      )}
                      
                      <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-sm font-medium">Add New Credential</h3>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="credType" className="text-sm font-medium block mb-1">
                              Credential Type
                            </label>
                            <Select
                              value={credentialType}
                              onValueChange={setCredentialType}
                            >
                              <SelectTrigger id="credType">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="domain">Domain</SelectItem>
                                <SelectItem value="hosting">Hosting</SelectItem>
                                <SelectItem value="database">Database</SelectItem>
                                <SelectItem value="api">API Key</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label htmlFor="credName" className="text-sm font-medium block mb-1">
                              Name/Description
                            </label>
                            <Input
                              id="credName"
                              placeholder="e.g., Domain login, Database password"
                              value={credentialName}
                              onChange={(e) => setCredentialName(e.target.value)}
                            />
                          </div>
                          <div>
                            <label htmlFor="credValue" className="text-sm font-medium block mb-1">
                              Value
                            </label>
                            <Input
                              id="credValue"
                              placeholder="Credential value"
                              value={credentialValue}
                              onChange={(e) => setCredentialValue(e.target.value)}
                            />
                          </div>
                          <Button 
                            onClick={handleAddCredential}
                            disabled={!credentialName.trim() || !credentialValue.trim()}
                          >
                            <Key className="h-4 w-4 mr-2" />
                            Store Credential
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="dates">
                <Card>
                  <CardHeader>
                    <CardTitle>Important Project Dates</CardTitle>
                    <CardDescription>
                      Set completion and renewal dates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          Project Completion Date
                        </h3>
                        {project.completionDate ? (
                          <div className="flex items-center space-x-4">
                            <span className="font-medium">
                              {new Date(project.completionDate).toLocaleDateString()}
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setCompletionDate("")}
                            >
                              Change
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Input
                              type="date"
                              value={completionDate}
                              onChange={(e) => setCompletionDate(e.target.value)}
                            />
                            <Button 
                              onClick={handleUpdateCompletionDate}
                              disabled={!completionDate}
                              size="sm"
                            >
                              Set Completion Date
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium flex items-center">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Project Renewal Date
                        </h3>
                        {project.renewalDate ? (
                          <div className="flex items-center space-x-4">
                            <span className="font-medium">
                              {new Date(project.renewalDate).toLocaleDateString()}
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setRenewalDate("")}
                            >
                              Change
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Input
                              type="date"
                              value={renewalDate}
                              onChange={(e) => setRenewalDate(e.target.value)}
                            />
                            <Button 
                              onClick={handleUpdateRenewalDate}
                              disabled={!renewalDate}
                              size="sm"
                            >
                              Set Renewal Date
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectDetails;
