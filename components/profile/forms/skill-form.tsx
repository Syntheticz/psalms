"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
// import { useAddSkill } from "@/lib/api/mutations"
import { toast } from "sonner";

interface SkillFormProps {
  userId: string;
  skillType: "technical" | "hard" | "soft";
  onCancel: () => void;
  onSuccess: () => void;
}

export function SkillForm({
  userId,
  skillType,
  onCancel,
  onSuccess,
}: SkillFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  // const addSkillMutation = useAddSkill({
  //   onSuccess: () => {
  //     toast.success("Skill added", {
  //       description: `Your ${skillType} skill has been added to your profile.`,
  //     })
  //     onSuccess()
  //   },
  //   onError: (error) => {
  //     toast.error("Error", {
  //       description: error.message || "Failed to add skill. Please try again.",
  //     })
  //   },
  // })

  const onSubmit = (data: { name: string }) => {
    // addSkillMutation.mutate({
    //   userId,
    //   skillType,
    //   name: data.name,
    // })
  };

  const getSkillTypeLabel = () => {
    switch (skillType) {
      case "technical":
        return "Technical Skill";
      case "hard":
        return "Hard Skill";
      case "soft":
        return "Soft Skill";
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 border p-4 rounded-md"
    >
      <div className="space-y-2">
        <Label htmlFor="skillName">{getSkillTypeLabel()} Name</Label>
        <Input
          id="skillName"
          {...register("name", { required: "Skill name is required" })}
          placeholder={`Enter ${skillType} skill name`}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        {/* <Button type="submit" disabled={addSkillMutation.isPending}>
          {addSkillMutation.isPending ? "Adding..." : "Add Skill"}
        </Button> */}
      </div>
    </form>
  );
}
