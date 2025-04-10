
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export type ProjectStatus = 
  | "requirements"   // Waiting for client requirements
  | "development"    // Development undergoing
  | "payment"        // Waiting for payment gateway
  | "credentials"    // Waiting for domain/hosting credentials
  | "completed";     // Project completed

export interface Credential {
  id: string;
  type: string;
  name: string;
  value: string;
  dateAdded: string;
}

export interface ProjectNote {
  id: string;
  content: string;
  author: string;
  isPublic: boolean;
  createdAt: string;
}

export interface Project {
  id: string;
  referenceId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  description: string;
  requirements: string;
  status: ProjectStatus;
  approved: boolean;
  assignedTo: string | null;
  deadline: string | null;
  createdBy: string;
  createdAt: string;
  completionDate: string | null;
  renewalDate: string | null;
  notes: ProjectNote[];
  credentials: Credential[];
}

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  createProject: (project: Omit<Project, "id" | "referenceId" | "approved" | "assignedTo" | "deadline" | "createdAt" | "completionDate" | "renewalDate" | "notes" | "credentials">) => void;
  approveProject: (id: string, developerId: string, deadline: string) => void;
  rejectProject: (id: string) => void;
  updateProjectStatus: (id: string, status: ProjectStatus) => void;
  addProjectNote: (projectId: string, note: Omit<ProjectNote, "id" | "createdAt">) => void;
  addCredential: (projectId: string, credential: Omit<Credential, "id" | "dateAdded">) => void;
  updateCompletionDate: (projectId: string, date: string) => void;
  updateRenewalDate: (projectId: string, date: string) => void;
  getProjectByReferenceId: (referenceId: string) => Project | null;
  getProjectById: (id: string) => Project | null;
}

// Generate a unique reference ID for new projects
const generateReferenceId = () => {
  const prefix = "CMT";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `${prefix}-${timestamp}-${random}`;
};

// Sample projects for demonstration
const INITIAL_PROJECTS: Project[] = [
  {
    id: "1",
    referenceId: "CMT-123456-001",
    clientName: "Acme Corp",
    clientEmail: "contact@acme.com",
    clientPhone: "555-123-4567",
    description: "E-commerce website for selling widgets",
    requirements: "Must include payment gateway, product catalog, and admin portal",
    status: "development",
    approved: true,
    assignedTo: "3", // Developer 1
    deadline: "2025-05-15",
    createdBy: "1", // Sales user
    createdAt: "2025-03-01",
    completionDate: null,
    renewalDate: "2026-03-01",
    notes: [
      {
        id: "n1",
        content: "Client prefers a minimalist design",
        author: "Sales User",
        isPublic: true,
        createdAt: "2025-03-01"
      },
      {
        id: "n2",
        content: "Using React and Node.js for this project",
        author: "Developer 1",
        isPublic: false,
        createdAt: "2025-03-05"
      }
    ],
    credentials: []
  },
  {
    id: "2",
    referenceId: "CMT-789012-002",
    clientName: "TechStart Inc",
    clientEmail: "info@techstart.com",
    clientPhone: "555-987-6543",
    description: "Startup landing page with contact form",
    requirements: "Modern design, newsletter signup, contact form",
    status: "requirements",
    approved: false,
    assignedTo: null,
    deadline: null,
    createdBy: "1", // Sales user
    createdAt: "2025-04-05",
    completionDate: null,
    renewalDate: null,
    notes: [
      {
        id: "n3",
        content: "Client is in a hurry, needs it within 2 weeks",
        author: "Sales User",
        isPublic: false,
        createdAt: "2025-04-05"
      }
    ],
    credentials: []
  }
];

const ProjectContext = createContext<ProjectContextType>({} as ProjectContextType);

export const useProjects = () => useContext(ProjectContext);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load projects from localStorage or use initial data

    const savedProjects = localStorage.getItem("cmtai_projects");
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      setProjects(INITIAL_PROJECTS);
    }
    setLoading(false);
  }, []);

  // Save projects to localStorage whenever they change
  // useEffect(() => {
  //   if (!loading) {
  //     localStorage.setItem("cmtai_projects", JSON.stringify(projects));
  //   }
  // }, [projects, loading]);
  useEffect(() => {
    // ❌ REMOVE this if you don't want to load from localStorage at all
    // ✅ Replace with just the initial data
    setProjects(INITIAL_PROJECTS);
    setLoading(false);
  }, []);
  

  const createProject = (projectData: Omit<Project, "id" | "referenceId" | "approved" | "assignedTo" | "deadline" | "createdAt" | "completionDate" | "renewalDate" | "notes" | "credentials">) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      referenceId: generateReferenceId(),
      approved: false,
      assignedTo: null,
      deadline: null,
      createdAt: new Date().toISOString(),
      completionDate: null,
      renewalDate: null,
      notes: [],
      credentials: []
    };
    
    setProjects([...projects, newProject]);
    toast({
      title: "Project Created",
      description: `Reference ID: ${newProject.referenceId}`,
    });
  };

  const approveProject = (id: string, developerId: string, deadline: string) => {
    setProjects(projects.map(project => 
      project.id === id 
        ? { ...project, approved: true, assignedTo: developerId, deadline } 
        : project
    ));
    
    toast({
      title: "Project Approved",
      description: "Project has been assigned to a developer",
    });
  };

  const rejectProject = (id: string) => {
    // For this demo, we'll just remove rejected projects
    setProjects(projects.filter(project => project.id !== id));
    
    toast({
      title: "Project Rejected",
      description: "Project has been removed from the system",
      variant: "destructive"
    });
  };

  const updateProjectStatus = (id: string, status: ProjectStatus) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, status } : project
    ));

    toast({
      title: "Status Updated",
      description: `Project now marked as: ${status}`,
    });
  };

  const addProjectNote = (projectId: string, note: Omit<ProjectNote, "id" | "createdAt">) => {
    const newNote: ProjectNote = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    setProjects(projects.map(project => 
      project.id === projectId 
        ? { ...project, notes: [...project.notes, newNote] } 
        : project
    ));

    toast({
      title: "Note Added",
      description: "Your note has been added to the project",
    });
  };

  const addCredential = (projectId: string, credential: Omit<Credential, "id" | "dateAdded">) => {
    const newCredential: Credential = {
      ...credential,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString()
    };

    setProjects(projects.map(project => 
      project.id === projectId 
        ? { ...project, credentials: [...project.credentials, newCredential] } 
        : project
    ));

    toast({
      title: "Credential Stored",
      description: `${credential.type} credential has been securely stored`,
    });
  };

  const updateCompletionDate = (projectId: string, date: string) => {
    setProjects(projects.map(project => 
      project.id === projectId ? { ...project, completionDate: date } : project
    ));

    toast({
      title: "Completion Date Updated",
      description: "Project completion date has been set",
    });
  };

  const updateRenewalDate = (projectId: string, date: string) => {
    setProjects(projects.map(project => 
      project.id === projectId ? { ...project, renewalDate: date } : project
    ));

    toast({
      title: "Renewal Date Updated",
      description: "Project renewal date has been set",
    });
  };

  const getProjectByReferenceId = (referenceId: string) => {
    return projects.find(project => project.referenceId === referenceId) || null;
  };

  const getProjectById = (id: string) => {
    return projects.find(project => project.id === id) || null;
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      loading,
      createProject,
      approveProject,
      rejectProject,
      updateProjectStatus,
      addProjectNote,
      addCredential,
      updateCompletionDate,
      updateRenewalDate,
      getProjectByReferenceId,
      getProjectById
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
