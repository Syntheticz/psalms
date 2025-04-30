import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userProfileSchema } from "@/lib/validation/user-profile-schema";
import {
  BriefcaseIcon,
  GraduationCapIcon,
  AwardIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeIcon,
} from "lucide-react";
import { z } from "zod";
type UserProfileFormValues = z.infer<typeof userProfileSchema>;

// This component takes the form data and displays it in a structured format
export function ProfilePreview({ data }: { data: UserProfileFormValues }) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Review Your Information</h2>
      <p className="text-muted-foreground">
        Please review all your information before submitting.
      </p>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border flex items-center justify-center">
              <UserIcon className="h-8 w-8" />
            </Avatar>
            <div className="space-y-1.5">
              <CardTitle className="text-2xl">
                {data.name || "Your Name"}
              </CardTitle>
              <CardDescription className="flex flex-col gap-1">
                {data.email && (
                  <span className="flex items-center gap-1.5">
                    <MailIcon className="h-3.5 w-3.5" />
                    {data.email}
                  </span>
                )}
                {data.phone && (
                  <span className="flex items-center gap-1.5">
                    <PhoneIcon className="h-3.5 w-3.5" />
                    {data.phone}
                  </span>
                )}
                {data.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPinIcon className="h-3.5 w-3.5" />
                    {data.location}
                  </span>
                )}
                {data.website && (
                  <span className="flex items-center gap-1.5">
                    <GlobeIcon className="h-3.5 w-3.5" />
                    <a
                      href={data.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {data.website}
                    </a>
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        {data.bio && (
          <CardContent className="pt-0">
            <p className="text-sm">{data.bio}</p>
          </CardContent>
        )}
      </Card>

      <Tabs defaultValue="experience" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="experience" className="space-y-4 pt-4">
          {data.experience && data.experience.length > 0 ? (
            data.experience.map((exp, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{exp.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {exp.company} • {exp.location}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {exp.startDate} - {exp.endDate}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm">{exp.description}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No experience entries added.
            </p>
          )}
        </TabsContent>

        <TabsContent value="education" className="space-y-4 pt-4">
          {data.education && data.education.length > 0 ? (
            data.education.map((edu, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{edu.degree}</CardTitle>
                      <CardDescription className="text-sm">
                        {edu.institution} • {edu.location}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {edu.startDate} - {edu.endDate}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm">{edu.description}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No education entries added.
            </p>
          )}
        </TabsContent>

        <TabsContent value="skills" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Technical Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {data.technicalSkills && data.technicalSkills.length > 0 ? (
                    data.technicalSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No technical skills added.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Soft Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {data.softSkills && data.softSkills.length > 0 ? (
                    data.softSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No soft skills added.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Hard Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {data.hardSkills && data.hardSkills.length > 0 ? (
                    data.hardSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No hard skills added.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {data.skills && data.skills.length > 0 && (
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle className="text-base">Other Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4 pt-4">
          {data.certificates && data.certificates.length > 0 ? (
            data.certificates.map((cert, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{cert.name}</CardTitle>
                      <CardDescription className="text-sm">
                        Issued by {cert.issuer}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {cert.issueDate}
                      {cert.expiryDate ? ` - ${cert.expiryDate}` : ""}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {cert.credentialId && (
                    <p className="text-sm">
                      <span className="font-medium">Credential ID:</span>{" "}
                      {cert.credentialId}
                    </p>
                  )}
                  {cert.url && (
                    <p className="text-sm mt-1">
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        View Certificate
                      </a>
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No certificates added.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
