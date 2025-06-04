import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { registrationSchema } from "@/lib/validations/registration"
import { z } from "zod"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the request body
    const validatedData = registrationSchema.parse(body)

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.leaderEmail },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Check if team name already exists
    const existingTeam = await prisma.team.findFirst({
      where: { name: validatedData.teamName },
    })

    if (existingTeam) {
      return NextResponse.json({ error: "Team name already taken" }, { status: 400 })
    }

    // Validate team members emails are unique
    if (validatedData.teamMembers && validatedData.teamMembers.length > 0) {
      const memberEmails = validatedData.teamMembers.map((member) => member.email)
      const allEmails = [validatedData.leaderEmail, ...memberEmails]

      // Check for duplicate emails within the team
      const uniqueEmails = new Set(allEmails)
      if (uniqueEmails.size !== allEmails.length) {
        return NextResponse.json({ error: "Duplicate email addresses found in team" }, { status: 400 })
      }

      // Check if any team member email already exists
      const existingMembers = await prisma.user.findMany({
        where: {
          email: { in: memberEmails },
        },
      })

      if (existingMembers.length > 0) {
        return NextResponse.json({ error: "One or more team member emails are already registered" }, { status: 400 })
      }
    }

    // Verify theme exists
    const theme = await prisma.theme.findUnique({
      where: { slug: validatedData.selectedTheme },
    })

    if (!theme) {
      return NextResponse.json({ error: "Invalid theme selected" }, { status: 400 })
    }

    // Create the registration in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the team leader (user)
      const user = await tx.user.create({
        data: {
          name: validatedData.leaderName,
          email: validatedData.leaderEmail,
          phone: validatedData.leaderPhone,
          organizationName: validatedData.collegeName,
          organizationType: validatedData.organizationType,
        },
      })

      // Create the team
      const team = await tx.team.create({
        data: {
          name: validatedData.teamName,
          size: validatedData.teamSize,
          leaderId: user.id,
          themeId: theme.id,
        },
      })

      // Create team members if any
      if (validatedData.teamMembers && validatedData.teamMembers.length > 0) {
        await tx.teamMember.createMany({
          data: validatedData.teamMembers.map((member) => ({
            name: member.name,
            email: member.email,
            phone: member.phone,
            role: member.role || "",
            teamId: team.id,
          })),
        })
      }

      // Create the submission
      const submission = await tx.submission.create({
        data: {
          title: validatedData.ideaTitle,
          description: validatedData.ideaDescription,
          problemStatement: validatedData.problemStatement,
          proposedSolution: validatedData.proposedSolution,
          expectedImpact: validatedData.expectedImpact,
          previousExperience: validatedData.previousExperience || "",
          whyThisTheme: validatedData.whyThisTheme || "",
          teamId: team.id,
          themeId: theme.id,
          status: "PENDING",
        },
      })

      return {
        user,
        team,
        submission,
      }
    })

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Registration completed successfully",
        data: {
          teamId: result.team.id,
          submissionId: result.submission.id,
          teamName: result.team.name,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 },
      )
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
