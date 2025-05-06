"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Education } from "@prisma/client";
// import type { Education } from "@/lib/types"
import { useForm } from "react-hook-form";
// import { useAddEducation, useUpdateEducation } from "@/lib/api/mutations"
import { toast } from "sonner";

interface EducationFormProps {
  userId: string;
  education?: Education;
  onCancel: () => void;
  onSuccess: () => void;
}

export function EducationForm({
  userId,
  education,
  onCancel,
  onSuccess,
}: EducationFormProps) {
  const isEditing = !!education;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<Education, "id" | "userId">>({
    defaultValues: education
      ? {
          degree: education.degree,
          institution: education.institution,
          location: education.location,
          startDate: education.startDate,
          endDate: education.endDate,
          description: education.description,
        }
      : {
          degree: "",
          institution: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
        },
  });

  // const addEducationMutation = useAddEducation({
  //   onSuccess: () => {
  //     toast.success("Education added", {
  //       description: "Your education has been added to your profile.",
  //     })
  //     onSuccess()
  //   },
  //   onError: (error) => {
  //     toast.error("Error", {
  //       description: error.message || "Failed to add education. Please try again.",
  //     })
  //   },
  // })

  // const updateEducationMutation = useUpdateEducation({
  //   onSuccess: () => {
  //     toast.success("Education updated", {
  //       description: "Your education has been updated.",
  //     })
  //     onSuccess()
  //   },
  //   onError: (error) => {
  //     toast.error("Error", {
  //       description: error.message || "Failed to update education. Please try again.",
  //     })
  //   },
  // })

  const onSubmit = (data: Omit<Education, "id" | "userId">) => {
    // if (isEditing && education) {
    //   updateEducationMutation.mutate({
    //     userId,
    //     educationId: education.id,
    //     ...data,
    //   })
    // } else {
    //   addEducationMutation.mutate({
    //     userId,
    //     ...data,
    //   })
    // }
  };

  // const isPending = addEducationMutation.isPending || updateEducationMutation.isPending

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 border p-4 rounded-md"
    >
      <div className="space-y-2">
        <Label htmlFor="degree">Degree</Label>
        <Input
          id="degree"
          {...register("degree", { required: "Degree is required" })}
          aria-invalid={!!errors.degree}
        />
        {errors.degree && (
          <p className="text-sm text-destructive">{errors.degree.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="institution">Institution</Label>
        <Input
          id="institution"
          {...register("institution", { required: "Institution is required" })}
          aria-invalid={!!errors.institution}
        />
        {errors.institution && (
          <p className="text-sm text-destructive">
            {errors.institution.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          {...register("location", { required: "Location is required" })}
          aria-invalid={!!errors.location}
        />
        {errors.location && (
          <p className="text-sm text-destructive">{errors.location.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            {...register("startDate", { required: "Start date is required" })}
            placeholder="e.g., 2018"
            aria-invalid={!!errors.startDate}
          />
          {errors.startDate && (
            <p className="text-sm text-destructive">
              {errors.startDate.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            {...register("endDate", { required: "End date is required" })}
            placeholder="e.g., 2022"
            aria-invalid={!!errors.endDate}
          />
          {errors.endDate && (
            <p className="text-sm text-destructive">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} rows={4} />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        {/* <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : isEditing ? "Update" : "Add Education"}
        </Button> */}
      </div>
    </form>
  );
}
