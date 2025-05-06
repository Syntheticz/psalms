"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, GraduationCap, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { EducationForm } from "./forms/education-form";
// import { useEducation } from "@/lib/api/queries"
// import { useDeleteEducation } from "@/lib/api/mutations"
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInfo } from "@/lib/queries/user";

interface ProfileEducationSectionProps {
  userId: string;
  isEditing: boolean;
}

export function ProfileEducationSection({
  userId,
  isEditing,
}: ProfileEducationSectionProps) {
  const [isAddingEducation, setIsAddingEducation] = useState(false);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(
    null
  );
  const [educationToDelete, setEducationToDelete] = useState<string | null>(
    null
  );

  const { data: education, isLoading } = useQuery({
    queryKey: ["education", userId],
    queryFn: async () => {
      const record = await fetchUserInfo(userId);
      return record?.education;
    },
  });

  // const deleteEducationMutation = useDeleteEducation({
  //   onSuccess: () => {
  //     toast.success("Education deleted", {
  //       description: "The education entry has been removed from your profile.",
  //     });
  //     setEducationToDelete(null);
  //   },
  //   onError: (error) => {
  //     toast.error("Error", {
  //       description:
  //         error.message || "Failed to delete education. Please try again.",
  //     });
  //   },
  // });

  // const handleDelete = () => {
  //   if (educationToDelete) {
  //     deleteEducationMutation.mutate({
  //       userId,
  //       educationId: educationToDelete,
  //     });
  //   }
  // };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Education</CardTitle>
          {isEditing && !isAddingEducation && !editingEducationId && (
            <Button size="sm" onClick={() => setIsAddingEducation(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Education
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {isAddingEducation && isEditing ? (
            <EducationForm
              userId={userId}
              onCancel={() => setIsAddingEducation(false)}
              onSuccess={() => setIsAddingEducation(false)}
            />
          ) : (
            <>
              {education && education.length > 0 ? (
                education.map((edu) => (
                  <div key={edu.id} className="relative">
                    {isEditing && !editingEducationId && (
                      <div className="absolute right-0 top-0 flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setEditingEducationId(edu.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => setEducationToDelete(edu.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {editingEducationId === edu.id ? (
                      <EducationForm
                        userId={userId}
                        education={edu}
                        onCancel={() => setEditingEducationId(null)}
                        onSuccess={() => setEditingEducationId(null)}
                      />
                    ) : (
                      <div className="flex items-start">
                        <div className="mr-4 mt-1">
                          <GraduationCap className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">{edu.degree}</h3>
                          <p className="text-muted-foreground">
                            {edu.institution} • {edu.location}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {edu.startDate} - {edu.endDate}
                          </p>
                          <p className="mt-2 text-sm">{edu.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No education added yet.
                  {isEditing && (
                    <Button
                      variant="link"
                      className="p-0 h-auto ml-1"
                      onClick={() => setIsAddingEducation(true)}
                    >
                      Add your education
                    </Button>
                  )}
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!educationToDelete}
        onOpenChange={(open) => !open && setEducationToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this education entry from your
              profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {/* <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction> */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
