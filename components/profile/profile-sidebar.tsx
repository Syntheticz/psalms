import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Download,
  File,
  Globe,
  Mail,
  MapPin,
  Phone,
  Upload,
} from "lucide-react";
// import type { UserData } from "@/lib/types"
// import { useDocuments } from "@/lib/api/queries"
import { Skeleton } from "@/components/ui/skeleton";
import { UserInfo } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInfo } from "@/lib/queries/user";

interface ProfileSidebarProps {
  user: UserInfo;
  isEditing: boolean;
}

export function ProfileSidebar({ user, isEditing }: ProfileSidebarProps) {
  const { data: document, isLoading: isLoadingDocuments } = useQuery({
    queryKey: ["document", user.id],
    queryFn: async () => {
      const record = await fetchUserInfo(user.id);
      return record?.resume;
    },
  });

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage
                src="/placeholder.svg?height=96&width=96"
                alt={user.name}
              />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">Senior Frontend Developer</p>
            <p className="flex items-center text-sm mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {user.location}
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-muted-foreground mr-3" />
              <span>{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-muted-foreground mr-3" />
                <span>{user.phone}</span>
              </div>
            )}
            {user.website && (
              <div className="flex items-center">
                <Globe className="h-4 w-4 text-muted-foreground mr-3" />
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {user.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-sm font-medium">
                {user.profileCompletion}%
              </span>
            </div>
            <Progress value={user.profileCompletion} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingDocuments ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : document ? (
            <div
              key={document.id}
              className="flex justify-between items-center p-3 border rounded-md"
            >
              <div className="flex items-center">
                <div className="bg-primary/10 p-2 rounded mr-3">
                  <File className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{document.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Uploaded on{" "}
                    {new Date(document.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-2">
              No documents uploaded yet
            </p>
          )}

          <Button variant="outline" className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
