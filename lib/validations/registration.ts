import { z } from "zod"

export const teamMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  role: z.string().optional(),
})

export const registrationSchema = z.object({
  // Leader Details
  leaderName: z.string().min(2, "Name must be at least 2 characters"),
  leaderEmail: z.string().email("Invalid email address"),
  leaderPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  collegeName: z.string().min(2, "Organization name is required"),
  organizationType: z.enum(["student", "entrepreneur", "msme"], {
    required_error: "Please select an organization type",
  }),

  // Team Details
  teamSize: z.number().min(1).max(4),
  teamName: z.string().min(2, "Team name must be at least 2 characters"),
  teamMembers: z.array(teamMemberSchema).optional(),

  // Theme and Idea
  selectedTheme: z.string().min(1, "Please select a theme"),
  ideaTitle: z.string().min(5, "Idea title must be at least 5 characters"),
  ideaDescription: z.string().min(50, "Idea description must be at least 50 characters"),
  problemStatement: z.string().min(50, "Problem statement must be at least 50 characters"),
  proposedSolution: z.string().min(50, "Proposed solution must be at least 50 characters"),
  expectedImpact: z.string().min(30, "Expected impact must be at least 30 characters"),

  // Additional
  previousExperience: z.string().optional(),
  whyThisTheme: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
})

export type RegistrationData = z.infer<typeof registrationSchema>
