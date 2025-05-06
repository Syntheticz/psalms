"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { SkillForm } from "./forms/skill-form";

import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInfo } from "@/lib/queries/user";

interface ProfileSkillsSectionProps {
  userId: string;
  isEditing: boolean;
}

const useTechnicalSkills = (userId: string) => {
  return useQuery({
    queryKey: ["technicalSkills", userId],
    queryFn: async () => {
      const res = await fetchUserInfo(userId);
      return res?.technicalSkills;
    },
  });
};

const useHardSkills = (userId: string) => {
  return useQuery({
    queryKey: ["hardSkills", userId],
    queryFn: async () => {
      const res = await fetchUserInfo(userId);
      return res?.hardSkills;
    },
  });
};

const useSoftSkills = (userId: string) => {
  return useQuery({
    queryKey: ["softSkills", userId],
    queryFn: async () => {
      const res = await fetchUserInfo(userId);
      return res?.softSkills;
    },
  });
};

export function ProfileSkillsSection({
  userId,
  isEditing,
}: ProfileSkillsSectionProps) {
  const [addingSkillType, setAddingSkillType] = useState<
    "technical" | "hard" | "soft" | null
  >(null);

  const { data: technicalSkills, isLoading: isLoadingTechnical } =
    useTechnicalSkills(userId);
  const { data: hardSkills, isLoading: isLoadingHard } = useHardSkills(userId);
  const { data: softSkills, isLoading: isLoadingSoft } = useSoftSkills(userId);

  // const deleteSkillMutation = useDeleteSkill({
  //   onSuccess: (_, variables) => {
  //     toast.success("Skill deleted", {
  //       description: `The ${variables.skillType} skill has been removed from your profile.`,
  //     })
  //   },
  //   onError: (error) => {
  //     toast.error("Error", {
  //       description: error.message || "Failed to delete skill. Please try again.",
  //     })
  //   },
  // })

  // const handleDeleteSkill = (skillId: string, skillType: "technical" | "hard" | "soft") => {
  //   deleteSkillMutation.mutate({ userId, skillId, skillType })
  // }

  const renderSkillsSection = (
    title: string,
    skills: any[] | undefined,
    isLoading: boolean,
    skillType: "technical" | "hard" | "soft",
    variant: "outline" | "secondary" = "outline"
  ) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>{title}</CardTitle>
        {isEditing && !addingSkillType && (
          <Button size="sm" onClick={() => setAddingSkillType(skillType)}>
            <Plus className="mr-2 h-4 w-4" />
            Add {title.replace(" Skills", "")} Skill
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {addingSkillType === skillType ? (
          <SkillForm
            userId={userId}
            skillType={skillType}
            onCancel={() => setAddingSkillType(null)}
            onSuccess={() => setAddingSkillType(null)}
          />
        ) : isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills && skills.length > 0 ? (
              skills.map((skill) => (
                <div key={skill.id} className="group relative inline-flex">
                  <Badge
                    variant={variant}
                    className={`${isEditing ? "pr-8" : ""}`}
                  >
                    {skillType === "soft" && (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    )}
                    {skill.name}
                  </Badge>
                  {/* {isEditing && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteSkill(skill.id, skillType)}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  )} */}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No {title.toLowerCase()} added yet.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      {renderSkillsSection(
        "Technical Skills",
        technicalSkills,
        isLoadingTechnical,
        "technical"
      )}
      {renderSkillsSection("Hard Skills", hardSkills, isLoadingHard, "hard")}
      {renderSkillsSection(
        "Soft Skills",
        softSkills,
        isLoadingSoft,
        "soft",
        "secondary"
      )}
    </div>
  );
}
