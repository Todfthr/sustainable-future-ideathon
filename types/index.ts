import type {
  User,
  Hackathon,
  Participation,
  Submission,
  Judgment,
  Mentorship,
  Sponsorship,
  Prize,
  Newsletter,
  Partner,
} from "@prisma/client"

// Export Prisma types
export type {
  User,
  Hackathon,
  Participation,
  Submission,
  Judgment,
  Mentorship,
  Sponsorship,
  Prize,
  Newsletter,
  Partner,
}

// Extended types with relations
export type HackathonWithDetails = Hackathon & {
  organizer: User
  participations: (Participation & { user: User })[]
  submissions: (Submission & { user: User })[]
  _count: {
    participations: number
    submissions: number
  }
}

export type UserWithProfile = User & {
  organizedHackathons: Hackathon[]
  participations: (Participation & { hackathon: Hackathon })[]
  submissions: (Submission & { hackathon: Hackathon })[]
}

export type SubmissionWithDetails = Submission & {
  user: User
  hackathon: Hackathon
  judgments: (Judgment & { judge: User })[]
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Newsletter subscription response
export interface SubscribeResponse {
  success: boolean
  message: string
}

// Form types
export interface CreateHackathonData {
  title: string
  description: string
  shortDescription?: string
  startDate: Date
  endDate: Date
  registrationEnd?: Date
  maxParticipants?: number
  prizePool?: number
  chainName?: string
  chainId?: string
  tags: string[]
  rules?: string
  judgesCriteria?: string
}

export interface CreateSubmissionData {
  title: string
  description: string
  repositoryUrl?: string
  demoUrl?: string
  videoUrl?: string
  imageUrls: string[]
  technologies: string[]
  teamMembers: string[]
}

export interface UpdateUserProfileData {
  name?: string
  bio?: string
  githubUrl?: string
  linkedinUrl?: string
  websiteUrl?: string
  skills?: string[]
}
