"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

import { toast } from "sonner";
import type { User, UserInfo } from "@prisma/client";
import { useState } from "react";
// import { updateUserInfo, updatePassword } from "@/lib/api/user-actions"

interface ProfileSettingsSectionProps {
  user: UserInfo;
  isEditing: boolean;
}

export function ProfileSettingsSection({
  user,
  isEditing,
}: ProfileSettingsSectionProps) {
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const {
    register: registerUserInfo,
    handleSubmit: handleSubmitUserInfo,
    formState: { isDirty: isUserInfoDirty, errors: userInfoErrors },
  } = useForm({
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmitUserInfo = async (data: any) => {
    try {
      setIsUpdatingInfo(true);
      // await updateUserInfo({
      //   userId: user.id,
      //   name: data.name,
      //   email: data.email,
      //   image: data.image,
      // })
      toast.success("Profile updated", {
        description: "Your personal information has been updated successfully.",
      });
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to update profile. Please try again.",
      });
    } finally {
      setIsUpdatingInfo(false);
    }
  };

  const onSubmitPassword = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords don't match", {
        description: "New password and confirmation must match.",
      });
      return;
    }

    try {
      setIsUpdatingPassword(true);
      // await updatePassword({
      //   userId: user.id,
      //   currentPassword: data.currentPassword,
      //   newPassword: data.newPassword,
      // })
      toast.success("Password updated", {
        description: "Your password has been changed successfully.",
      });
      resetPassword();
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to update password. Please try again.",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmitUserInfo(onSubmitUserInfo)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...registerUserInfo("name", {
                    required: "Name is required",
                  })}
                  disabled={!isEditing}
                  aria-invalid={!!userInfoErrors.name}
                />
                {userInfoErrors.name && (
                  <p className="text-sm text-destructive">
                    {userInfoErrors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...registerUserInfo("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  disabled={!isEditing}
                  aria-invalid={!!userInfoErrors.email}
                />
                {userInfoErrors.email && (
                  <p className="text-sm text-destructive">
                    {userInfoErrors.email.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {isEditing && isUserInfoDirty && (
              <Button
                type="submit"
                className="ml-auto"
                disabled={isUpdatingInfo}
              >
                {isUpdatingInfo ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your password</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                {...registerPassword("currentPassword", {
                  required: "Current password is required",
                })}
                disabled={!isEditing}
                aria-invalid={!!passwordErrors.currentPassword}
              />
              {passwordErrors.currentPassword && (
                <p className="text-sm text-destructive">
                  {passwordErrors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                {...registerPassword("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                disabled={!isEditing}
                aria-invalid={!!passwordErrors.newPassword}
              />
              {passwordErrors.newPassword && (
                <p className="text-sm text-destructive">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...registerPassword("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value, formValues) =>
                    value === formValues.newPassword || "Passwords don't match",
                })}
                disabled={!isEditing}
                aria-invalid={!!passwordErrors.confirmPassword}
              />
              {passwordErrors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            {isEditing && (
              <Button
                type="submit"
                className="ml-auto"
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
