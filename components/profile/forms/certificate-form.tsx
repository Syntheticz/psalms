"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Certificate } from "@prisma/client";

interface CertificateFormProps {
  userId: string;
  certificate?: Certificate;
  onCancel: () => void;
  onSuccess: () => void;
}

export function CertificateForm({
  userId,
  certificate,
  onCancel,
  onSuccess,
}: CertificateFormProps) {
  const isEditing = !!certificate;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<Certificate, "id" | "userId">>({
    defaultValues: certificate
      ? {
          name: certificate.name,
          issuer: certificate.issuer,
          issueDate: certificate.issueDate,
          expiryDate: certificate.expiryDate,
          credentialId: certificate.credentialId,
          url: certificate.url,
        }
      : {
          name: "",
          issuer: "",
          issueDate: "",
          expiryDate: "",
          credentialId: "",
          url: "",
        },
  });

  // const addCertificateMutation = useAddCertificate({
  //   onSuccess: () => {
  //     toast.success("Certificate added", {
  //       description: "Your certificate has been added to your profile.",
  //     })
  //     onSuccess()
  //   },
  //   onError: (error) => {
  //     toast.error("Error", {
  //       description: error.message || "Failed to add certificate. Please try again.",
  //     })
  //   },
  // })

  // const updateCertificateMutation = useUpdateCertificate({
  //   onSuccess: () => {
  //     toast.success("Certificate updated", {
  //       description: "Your certificate has been updated.",
  //     })
  //     onSuccess()
  //   },
  //   onError: (error) => {
  //     toast.error("Error", {
  //       description: error.message || "Failed to update certificate. Please try again.",
  //     })
  //   },
  // })

  const onSubmit = (data: Omit<Certificate, "id" | "userId">) => {
    // if (isEditing && certificate) {
    //   updateCertificateMutation.mutate({
    //     userId,
    //     certificateId: certificate.id,
    //     ...data,
    //   })
    // } else {
    //   addCertificateMutation.mutate({
    //     userId,
    //     ...data,
    //   })
    // }
  };

  // const isPending = addCertificateMutation.isPending || updateCertificateMutation.isPending

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 border p-4 rounded-md"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Certificate Name</Label>
        <Input
          id="name"
          {...register("name", { required: "Certificate name is required" })}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="issuer">Issuing Organization</Label>
        <Input
          id="issuer"
          {...register("issuer", { required: "Issuer is required" })}
          aria-invalid={!!errors.issuer}
        />
        {errors.issuer && (
          <p className="text-sm text-destructive">{errors.issuer.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="issueDate">Issue Date</Label>
          <Input
            id="issueDate"
            {...register("issueDate", { required: "Issue date is required" })}
            placeholder="e.g., May 2023"
            aria-invalid={!!errors.issueDate}
          />
          {errors.issueDate && (
            <p className="text-sm text-destructive">
              {errors.issueDate.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input
            id="expiryDate"
            {...register("expiryDate", { required: "Expiry date is required" })}
            placeholder="e.g., May 2026 or No Expiration"
            aria-invalid={!!errors.expiryDate}
          />
          {errors.expiryDate && (
            <p className="text-sm text-destructive">
              {errors.expiryDate.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="credentialId">Credential ID</Label>
        <Input
          id="credentialId"
          {...register("credentialId", {
            required: "Credential ID is required",
          })}
          aria-invalid={!!errors.credentialId}
        />
        {errors.credentialId && (
          <p className="text-sm text-destructive">
            {errors.credentialId.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">Credential URL</Label>
        <Input
          id="url"
          type="url"
          {...register("url", {
            required: "URL is required",
            pattern: {
              value:
                /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
              message: "Please enter a valid URL",
            },
          })}
          aria-invalid={!!errors.url}
        />
        {errors.url && (
          <p className="text-sm text-destructive">{errors.url.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        {/* <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : isEditing ? "Update" : "Add Certificate"}
        </Button> */}
      </div>
    </form>
  );
}
