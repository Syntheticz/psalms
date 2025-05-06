"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { CertificateForm } from "./forms/certificate-form";

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

interface ProfileCertificatesSectionProps {
  userId: string;
  isEditing: boolean;
}

export function ProfileCertificatesSection({
  userId,
  isEditing,
}: ProfileCertificatesSectionProps) {
  const [isAddingCertificate, setIsAddingCertificate] = useState(false);
  const [editingCertificateId, setEditingCertificateId] = useState<
    string | null
  >(null);
  const [certificateToDelete, setCertificateToDelete] = useState<string | null>(
    null
  );

  const { data: certificates, isLoading } = useQuery({
    queryKey: ["certificates", userId],
    queryFn: async () => {
      const record = await fetchUserInfo(userId);
      return record?.certificates;
    },
  });

  // const deleteCertificateMutation = useDeleteCertificate({
  //   onSuccess: () => {
  //     toast.success("Certificate deleted", {
  //       description: "The certificate has been removed from your profile.",
  //     })
  //     setCertificateToDelete(null)
  //   },
  //   onError: (error) => {
  //     toast.error("Error", {
  //       description: error.message || "Failed to delete certificate. Please try again.",
  //     })
  //   },
  // })

  // const handleDelete = () => {
  //   if (certificateToDelete) {
  //     deleteCertificateMutation.mutate({ userId, certificateId: certificateToDelete })
  //   }
  // }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Certificates & Licenses</CardTitle>
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
          <CardTitle>Certificates & Licenses</CardTitle>
          {isEditing && !isAddingCertificate && !editingCertificateId && (
            <Button size="sm" onClick={() => setIsAddingCertificate(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Certificate
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {isAddingCertificate && isEditing ? (
            <CertificateForm
              userId={userId}
              onCancel={() => setIsAddingCertificate(false)}
              onSuccess={() => setIsAddingCertificate(false)}
            />
          ) : (
            <>
              {certificates && certificates.length > 0 ? (
                certificates.map((cert) => (
                  <div key={cert.id} className="relative">
                    {isEditing && !editingCertificateId && (
                      <div className="absolute right-0 top-0 flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setEditingCertificateId(cert.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => setCertificateToDelete(cert.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {editingCertificateId === cert.id ? (
                      <CertificateForm
                        userId={userId}
                        certificate={cert}
                        onCancel={() => setEditingCertificateId(null)}
                        onSuccess={() => setEditingCertificateId(null)}
                      />
                    ) : (
                      <div className="flex items-start">
                        <div className="mr-4 mt-1">
                          <Award className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">{cert.name}</h3>
                          <p className="text-muted-foreground">{cert.issuer}</p>
                          <p className="text-sm text-muted-foreground">
                            Issued: {cert.issueDate} • Expires:{" "}
                            {cert.expiryDate}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Credential ID: {cert.credentialId}
                          </p>
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm mt-1 inline-block"
                          >
                            See credential
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No certificates added yet.
                  {isEditing && (
                    <Button
                      variant="link"
                      className="p-0 h-auto ml-1"
                      onClick={() => setIsAddingCertificate(true)}
                    >
                      Add your first certificate
                    </Button>
                  )}
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!certificateToDelete}
        onOpenChange={(open) => !open && setCertificateToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this certificate from your profile.
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
