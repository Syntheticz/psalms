import { z } from "zod";

// Basic validation schema for skills
const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
});

// Experience schema
const experienceSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  location: z.string().min(1, "Location is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  description: z.string().min(1, "Description is required"),
});

// Education schema
const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  location: z.string().min(1, "Location is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  description: z.string().min(1, "Description is required"),
});

// Certificate schema
const certificateSchema = z.object({
  name: z.string().min(1, "Certificate name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  expiryDate: z.string(),
  credentialId: z.string(),
  url: z
    .string()
    .url("Please enter a valid URL")
    .or(z.string().length(0))
    .optional(),
});

// Technical skill schema
const technicalSkillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  category: z.string().default("Technical").optional(),
});

// Soft skill schema
const softSkillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  category: z.string().default("Soft").optional(),
});

// Hard skill schema
const hardSkillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  category: z.string().default("Hard").optional(),
});

// Main user profile schema
export const userProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z
    .string()
    .url("Please enter a valid URL")
    .or(z.string().length(0))
    .optional(),
  bio: z.string().optional(),
  skills: z.array(skillSchema),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  certificates: z.array(certificateSchema),
  technicalSkills: z.array(technicalSkillSchema),
  softSkills: z.array(softSkillSchema),
  hardSkills: z.array(hardSkillSchema),
});
