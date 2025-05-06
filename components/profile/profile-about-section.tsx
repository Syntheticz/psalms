"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
// import { useUpdateBio } from "@/lib/api/mutations"
// import { useBio } from "@/lib/api/queries"
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInfo } from "@/lib/queries/user";

interface ProfileAboutSectionProps {
  bio?: string;
  isEditing: boolean;
  userId: string;
}

export function ProfileAboutSection({
  bio: initialBio,
  isEditing,
  userId,
}: ProfileAboutSectionProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["bio", userId],
    queryFn: async () => await fetchUserInfo(userId),
  });

  // const { data, isLoading } = useBio(userId, { initialData: initialBio ? { bio: initialBio } : undefined })

  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      bio: data?.bio || "",
    },
  });

  // const updateBioMutation = useUpdateBio({
  //   onSuccess: () => {
  //     toast.success("Bio updated", {
  //       description: "Your bio has been updated successfully.",
  //     })
  //   },
  //   onError: (error) => {
  //     toast.error("Error", {
  //       description: error.message || "Failed to update bio. Please try again.",
  //     })
  //   },
  // })

  const onSubmit = (formData: { bio: string }) => {
    // updateBioMutation.mutate({ userId, bio: formData.bio })
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>About Me</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>About Me</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Textarea
              {...register("bio")}
              placeholder="Write a short bio about yourself..."
              className="min-h-[150px] mb-4"
            />
            {/* {isDirty && (
              <div className="flex justify-end">
                <Button type="submit" disabled={updateBioMutation.isPending}>
                  {updateBioMutation.isPending ? "Saving..." : "Save Bio"}
                </Button>
              </div>
            )} */}
          </form>
        ) : (
          <p>{data?.bio || "No bio information provided yet."}</p>
        )}
      </CardContent>
    </Card>
  );
}
