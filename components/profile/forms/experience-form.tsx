"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// import type { Experience } from "@/lib/types"
import { useForm } from "react-hook-form";
// import { useAddExperience, useUpdateExperience } from "@/lib/api/mutations"
import { toast } from "sonner";
import { Experience } from "@prisma/client";

interface ExperienceFormProps {
  userId: string;
  experience?: Experience;
  onCancel: () => void;
  onSuccess: () => void;
}

export function ExperienceForm({
  userId,
  experience,
  onCancel,
  onSuccess,
}: ExperienceFormProps) {
  const isEditing = !!experience;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<Experience, "id" | "userId">>({
    defaultValues: experience
      ? {
          title: experience.title,
          company: experience.company,
          location: experience.location,
          startDate: experience.startDate,
          endDate: experience.endDate,
          description: experience.description,
        }
      : {
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
        },
  });

  // const addExperienceMutation = useAddExperience({
  //   onSuccess: () => {
  //     toast.success("Experience added", {
  //       description: "Your work experience has been added to your profile.",
  //     })
  //     onSuccess()
  //   },
  //   onError: (error) => {
  //     toast.error("Error", {
  //       description: error.message || "Failed to add experience. Please try again.",
  //     })
  //   },
  // })

  // const updateExperienceMutation = useUpdateExperience({
  //   onSuccess: () => {
  //     toast.success("Experience updated", {
  //       description: "Your work experience has been updated.",
  //     })
  //     onSuccess()
  //   },
  //   onError: (error) => {
  //     toast.error("Error", {
  //       description: error.message || "Failed to update experience. Please try again.",
  //     })
  //   },
  // })

  const onSubmit = (data: Omit<Experience, "id" | "userId">) => {
    // if (isEditing && experience) {
    //   updateExperienceMutation.mutate({
    //     userId,
    //     experienceId: experience.id,
    //     ...data,
    //   })
    // } else {
    //   addExperienceMutation.mutate({
    //     userId,
    //     ...data,
    //   })
    // }
  };

  // const isPending = addExperienceMutation.isPending || updateExperienceMutation.isPending

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 border p-4 rounded-md"
    >
      <div className="space-y-2">
        <Label htmlFor="title">Job Title</Label>
        <Input
          id="title"
          {...register("title", { required: "Job title is required" })}
          aria-invalid={!!errors.title}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          {...register("company", { required: "Company name is required" })}
          aria-invalid={!!errors.company}
        />
        {errors.company && (
          <p className="text-sm text-destructive">{errors.company.message}</p>
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
            placeholder="e.g., Jan 2020"
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
            placeholder="e.g., Present"
            aria-invalid={!!errors.endDate}
          />
          {errors.endDate && (
            <p className="text-sm text-destructive">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description", { required: "Description is required" })}
          rows={4}
          aria-invalid={!!errors.description}
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        {/* <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : isEditing ? "Update" : "Add Experience"}
        </Button> */}
      </div>
    </form>
  );
}
