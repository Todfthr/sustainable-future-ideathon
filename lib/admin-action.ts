"use server"

import { prisma } from "@/lib/prisma"
import { requireAdmin, requireSuperAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"

// Dashboard statistics
export async function getDashboardStats() {
  await requireAdmin()

  try {
    const [
      totalTeams,
      totalSubmissions,
      pendingSubmissions,
      shortlistedSubmissions,
      rejectedSubmissions,
      finalistSubmissions,
      winnerSubmissions,
      totalJudges,
      totalEvaluations,
    ] = await Promise.all([
      prisma.team.count(),
      prisma.submission.count(),
      prisma.submission.count({ where: { status: "PENDING" } }),
      prisma.submission.count({ where: { shortlisted: true } }),
      prisma.submission.count({ where: { status: "REJECTED" } }),
      prisma.submission.count({ where: { finalist: true } }),
      prisma.submission.count({ where: { winner: true } }),
      prisma.judge.count(),
      prisma.evaluation.count(),
    ])

    // Get submissions by theme
    const submissionsByTheme = await prisma.theme.findMany({
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    })

    return {
      totalTeams,
      totalSubmissions,
      pendingSubmissions,
      shortlistedSubmissions,
      rejectedSubmissions,
      finalistSubmissions,
      winnerSubmissions,
      totalJudges,
      totalEvaluations,
      submissionsByTheme: submissionsByTheme.map((theme) => ({
        theme: theme.title,
        count: theme._count.submissions,
      })),
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    throw new Error("Failed to fetch dashboard statistics")
  }
}

// Team management
export async function getTeams(page = 1, limit = 10, search = "") {
  await requireAdmin()

  try {
    const skip = (page - 1) * limit
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { leader: { name: { contains: search, mode: "insensitive" } } },
            { leader: { email: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {}

    const [teams, totalCount] = await Promise.all([
      prisma.team.findMany({
        where:{},
        include: {
          leader: true,
          members: true,
          theme: true,
          submission: {
            select: {
              id: true,
              title: true,
              status: true,
              shortlisted: true,
              finalist: true,
              winner: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.team.count({ where: {}}),
    ])

    return {
      teams,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    }
  } catch (error) {
    console.error("Error fetching teams:", error)
    throw new Error("Failed to fetch teams")
  }
}

export async function getTeamDetails(id: string) {
  await requireAdmin()

  try {
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        leader: true,
        members: true,
        theme: true,
        submission: {
          include: {
            evaluations: {
              include: {
                judge: true,
              },
            },
          },
        },
      },
    })

    if (!team) {
      throw new Error("Team not found")
    }

    return team
  } catch (error) {
    console.error(`Error fetching team ${id}:`, error)
    throw new Error("Failed to fetch team details")
  }
}

export async function deleteTeam(id: string) {
  await requireAdmin()

  try {
    await prisma.team.delete({
      where: { id },
    })

    revalidatePath("/admin/teams")
    return { success: true }
  } catch (error) {
    console.error(`Error deleting team ${id}:`, error)
    return { success: false, error: "Failed to delete team" }
  }
}

// Submission management
export async function getSubmissions(page = 1, limit = 10, status?: string, themeId?: string, search?: string) {
  await requireAdmin()

  try {
    const skip = (page - 1) * limit
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (themeId) {
      where.themeId = themeId
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { team: { name: { contains: search, mode: "insensitive" } } },
        { team: { leader: { name: { contains: search, mode: "insensitive" } } } },
      ]
    }

    const [submissions, totalCount] = await Promise.all([
      prisma.submission.findMany({
        where:{},
        include: {
          team: {
            include: {
              leader: true,
            },
          },
          theme: true,
          evaluations: {
            include: {
              judge: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.submission.count({ where:{} }),
    ])
    // if (!submissions) {
    //   throw new Error("No submissions found")
    // }
    return {
      submissions,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    }
  } catch (error) {
    console.error("Error fetching submissions:", error)
    throw new Error("Failed to fetch submissions")
  }
}

export async function getSubmissionDetails(id: string) {
  await requireAdmin()

  try {
    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        team: {
          include: {
            leader: true,
            members: true,
          },
        },
        theme: true,
        evaluations: {
          include: {
            judge: true,
          },
        },
      },
    })

    if (!submission) {
      throw new Error("Submission not found")
    }

    return submission
  } catch (error) {
    console.error(`Error fetching submission ${id}:`, error)
    throw new Error("Failed to fetch submission details")
  }
}

export async function updateSubmissionStatus(
  id: string,
  status: "PENDING" | "UNDER_REVIEW" | "SHORTLISTED" | "REJECTED" | "FINALIST" | "WINNER",
) {
  await requireAdmin()

  try {
    // Update flags based on status
    const shortlisted = ["SHORTLISTED", "FINALIST", "WINNER"].includes(status)
    const finalist = ["FINALIST", "WINNER"].includes(status)
    const winner = status === "WINNER"

    const submission = await prisma.submission.update({
      where: { id },
      data: {
        status,
        shortlisted,
        finalist,
        winner,
      },
    })

    revalidatePath(`/admin/submissions/${id}`)
    revalidatePath("/admin/submissions")
    return { success: true, submission }
  } catch (error) {
    console.error(`Error updating submission ${id} status:`, error)
    return { success: false, error: "Failed to update submission status" }
  }
}

export async function deleteSubmission(id: string) {
  await requireAdmin()

  try {
    await prisma.submission.delete({
      where: { id },
    })

    revalidatePath("/admin/submissions")
    return { success: true }
  } catch (error) {
    console.error(`Error deleting submission ${id}:`, error)
    return { success: false, error: "Failed to delete submission" }
  }
}

// Theme management
export async function getThemes() {
  await requireAdmin()

  try {
    const themes = await prisma.theme.findMany({
      include: {
        _count: {
          select: {
            teams: true,
            submissions: true,
          },
        },
      },
      orderBy: { title: "asc" },
    })

    return themes
  } catch (error) {
    console.error("Error fetching themes:", error)
    throw new Error("Failed to fetch themes")
  }
}

export async function createTheme(data: {
  slug: string
  title: string
  icon: string
  subtitle: string
  description: string
}) {
  await requireAdmin()

  try {
    const theme = await prisma.theme.create({
      data,
    })

    revalidatePath("/admin/themes")
    return { success: true, theme }
  } catch (error) {
    console.error("Error creating theme:", error)
    return { success: false, error: "Failed to create theme" }
  }
}

export async function updateTheme(
  id: string,
  data: { slug?: string; title?: string; icon?: string; subtitle?: string; description?: string },
) {
  await requireAdmin()

  try {
    const theme = await prisma.theme.update({
      where: { id },
      data,
    })

    revalidatePath("/admin/themes")
    return { success: true, theme }
  } catch (error) {
    console.error(`Error updating theme ${id}:`, error)
    return { success: false, error: "Failed to update theme" }
  }
}

export async function deleteTheme(id: string) {
  await requireAdmin()

  try {
    // Check if theme is in use
    const [teamsCount, submissionsCount] = await Promise.all([
      prisma.team.count({ where: { themeId: id } }),
      prisma.submission.count({ where: { themeId: id } }),
    ])

    if (teamsCount > 0 || submissionsCount > 0) {
      return {
        success: false,
        error: `Cannot delete theme. It is used by ${teamsCount} teams and ${submissionsCount} submissions.`,
      }
    }

    await prisma.theme.delete({
      where: { id },
    })

    revalidatePath("/admin/themes")
    return { success: true }
  } catch (error) {
    console.error(`Error deleting theme ${id}:`, error)
    return { success: false, error: "Failed to delete theme" }
  }
}

// Judge management
export async function getJudges() {
  await requireAdmin()

  try {
    const judges = await prisma.judge.findMany({
      include: {
        _count: {
          select: {
            evaluations: true,
          },
        },
      },
      orderBy: { name: "asc" },
    })

    return judges
  } catch (error) {
    console.error("Error fetching judges:", error)
    throw new Error("Failed to fetch judges")
  }
}

export async function createJudge(data: { name: string; email: string; expertise?: string; organization?: string }) {
  await requireAdmin()

  try {
    const judge = await prisma.judge.create({
      data,
    })

    revalidatePath("/admin/judges")
    return { success: true, judge }
  } catch (error) {
    console.error("Error creating judge:", error)
    return { success: false, error: "Failed to create judge" }
  }
}

export async function updateJudge(
  id: string,
  data: { name?: string; email?: string; expertise?: string; organization?: string },
) {
  await requireAdmin()

  try {
    const judge = await prisma.judge.update({
      where: { id },
      data,
    })

    revalidatePath("/admin/judges")
    return { success: true, judge }
  } catch (error) {
    console.error(`Error updating judge ${id}:`, error)
    return { success: false, error: "Failed to update judge" }
  }
}

export async function deleteJudge(id: string) {
  await requireAdmin()

  try {
    // Check if judge has evaluations
    const evaluationsCount = await prisma.evaluation.count({
      where: { judgeId: id },
    })

    if (evaluationsCount > 0) {
      return {
        success: false,
        error: `Cannot delete judge. They have ${evaluationsCount} evaluations.`,
      }
    }

    await prisma.judge.delete({
      where: { id },
    })

    revalidatePath("/admin/judges")
    return { success: true }
  } catch (error) {
    console.error(`Error deleting judge ${id}:`, error)
    return { success: false, error: "Failed to delete judge" }
  }
}

// Evaluation management
export async function createEvaluation(data: {
  submissionId: string
  judgeId: string
  innovationScore: number
  sustainabilityScore: number
  presentationScore: number
  feasibilityScore: number
  relevanceScore: number
  communityImpactScore: number
  bonusScore: number
  comments?: string
}) {
  await requireAdmin()

  try {
    // Check if evaluation already exists
    const existingEvaluation = await prisma.evaluation.findUnique({
      where: {
        submissionId_judgeId: {
          submissionId: data.submissionId,
          judgeId: data.judgeId,
        },
      },
    })

    if (existingEvaluation) {
      return {
        success: false,
        error: "An evaluation by this judge for this submission already exists",
      }
    }

    const evaluation = await prisma.evaluation.create({
      data,
    })

    revalidatePath(`/admin/submissions/${data.submissionId}`)
    return { success: true, evaluation }
  } catch (error) {
    console.error("Error creating evaluation:", error)
    return { success: false, error: "Failed to create evaluation" }
  }
}

export async function updateEvaluation(
  id: string,
  data: {
    innovationScore?: number
    sustainabilityScore?: number
    presentationScore?: number
    feasibilityScore?: number
    relevanceScore?: number
    communityImpactScore?: number
    bonusScore?: number
    comments?: string
  },
) {
  await requireAdmin()

  try {
    const evaluation = await prisma.evaluation.update({
      where: { id },
      data,
    })

    const submissionId = evaluation.submissionId
    revalidatePath(`/admin/submissions/${submissionId}`)
    return { success: true, evaluation }
  } catch (error) {
    console.error(`Error updating evaluation ${id}:`, error)
    return { success: false, error: "Failed to update evaluation" }
  }
}

export async function deleteEvaluation(id: string) {
  await requireAdmin()

  try {
    const evaluation = await prisma.evaluation.findUnique({
      where: { id },
      select: { submissionId: true },
    })

    if (!evaluation) {
      return { success: false, error: "Evaluation not found" }
    }

    await prisma.evaluation.delete({
      where: { id },
    })

    revalidatePath(`/admin/submissions/${evaluation.submissionId}`)
    return { success: true }
  } catch (error) {
    console.error(`Error deleting evaluation ${id}:`, error)
    return { success: false, error: "Failed to delete evaluation" }
  }
}

// Admin user management
export async function getAdmins() {
  const currentAdmin = await requireSuperAdmin()

  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { name: "asc" },
    })

    return admins
  } catch (error) {
    console.error("Error fetching admins:", error)
    throw new Error("Failed to fetch admins")
  }
}

export async function updateAdmin(id: string, data: { name?: string; email?: string; role?: "ADMIN" | "SUPER_ADMIN" }) {
  const currentAdmin = await requireSuperAdmin()

  try {
    // Prevent self-demotion
    if (id === currentAdmin.id && data.role === "ADMIN" && currentAdmin.role === "SUPER_ADMIN") {
      return {
        success: false,
        error: "You cannot demote yourself from SUPER_ADMIN",
      }
    }

    const admin = await prisma.admin.update({
      where: { id },
      data,
    })

    revalidatePath("/admin/users")
    return { success: true, admin }
  } catch (error) {
    console.error(`Error updating admin ${id}:`, error)
    return { success: false, error: "Failed to update admin" }
  }
}

export async function deleteAdmin(id: string) {
  const currentAdmin = await requireSuperAdmin()

  try {
    // Prevent self-deletion
    if (id === currentAdmin.id) {
      return {
        success: false,
        error: "You cannot delete your own account",
      }
    }

    await prisma.admin.delete({
      where: { id },
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error(`Error deleting admin ${id}:`, error)
    return { success: false, error: "Failed to delete admin" }
  }
}
