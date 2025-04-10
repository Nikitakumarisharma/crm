
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus, Users } from "lucide-react";
import { useAuth, User } from "@/context/AuthContext";
import { useProjects } from "@/context/ProjectContext";
import { Navbar } from "@/components/Navbar";

const ManageDevelopers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createDeveloper, getAllDevelopers } = useAuth();
  const { projects } = useProjects();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const developers = getAllDevelopers();
  
  // Calculate projects assigned to each developer
  const getAssignedProjectsCount = (developerId: string) => {
    return projects.filter(project => project.assignedTo === developerId).length;
  };
  
  const handleCreateDeveloper = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createDeveloper(name, email, password);
      
      toast({
        title: "Developer Added",
        description: "The developer account has been created successfully",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create developer account",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Manage Developers</h1>
          <p className="text-gray-500 mt-1">
            Add and manage developer team members
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="h-5 w-5 mr-2" />
                Add New Developer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateDeveloper} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter developer's full name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter developer's email"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Set initial password"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating Account..." : "Create Developer Account"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Developer Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              {developers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Projects</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {developers.map((developer) => (
                      <TableRow key={developer.id}>
                        <TableCell className="font-medium">{developer.name}</TableCell>
                        <TableCell>{developer.email}</TableCell>
                        <TableCell className="text-right">{getAssignedProjectsCount(developer.id)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No developers added yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManageDevelopers;
