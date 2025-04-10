
import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronRight, Clock } from "lucide-react";
import { useProjects } from "@/context/ProjectContext";
import { useAuth } from "@/context/AuthContext";
import { ProjectStatusBadge } from "@/components/ProjectStatusBadge";
import { Navbar } from "@/components/Navbar";
import { ProjectCard } from "@/components/ProjectCard";

const AllProjects = () => {
  const { projects } = useProjects();
  const { user, getDeveloperById } = useAuth();
  
  // Sort projects by deadline (closest first)
  const sortedProjects = [...projects].sort((a, b) => {
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">All Projects</h1>
          <p className="text-gray-500 mt-1">
            Complete view of all projects in the system
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {sortedProjects.length > 0 ? (
            <div className="space-y-4">
              {sortedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">No projects found</h3>
                  <p className="text-gray-500 mb-4">
                    There are no projects in the system yet.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProjects;
