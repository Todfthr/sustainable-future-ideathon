"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getSubmissionDetails, updateSubmissionStatus, getJudges, createEvaluation } from "@/lib/admin-action"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Users, FileText, Award, Plus } from "lucide-react"
import Link from "next/link"

export default function SubmissionDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const submissionId = params.id as string

  const [submission, setSubmission] = useState<any>(null)
  const [judges, setJudges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false)
  const [evaluationDialogOpen, setEvaluationDialogOpen] = useState(false)
  const [newEvaluation, setNewEvaluation] = useState({
    judgeId: "",
    innovationScore: 0,
    sustainabilityScore: 0,
    presentationScore: 0,
    feasibilityScore: 0,
    relevanceScore: 0,
    communityImpactScore: 0,
    bonusScore: 0,
    comments: "",
  })

  const fetchSubmissionDetails = async () => {
    setLoading(true)
    try {
      const data = await getSubmissionDetails(submissionId)
      setSubmission(data)
    } catch (err) {
      setError("Failed to load submission details")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchJudges = async () => {
    try {
      const data = await getJudges()
      setJudges(data)
    } catch (err) {
      console.error("Failed to load judges:", err)
    }
  }

  useEffect(() => {
    fetchSubmissionDetails()
    fetchJudges()
  }, [submissionId])

  const handleStatusUpdate = async (newStatus: string) => {
    setStatusUpdateLoading(true)
    try {
      const result = await updateSubmissionStatus(submissionId, newStatus as any)
      if (result.success) {
        setSubmission({ ...submission, ...result.submission })
      } else {
        setError(result.error || "Failed to update status")
      }
    } catch (err) {
      setError("An error occurred while updating status")
      console.error(err)
    } finally {
      setStatusUpdateLoading(false)
    }
  }

  const handleCreateEvaluation = async () => {
    try {
      const result = await createEvaluation({
        submissionId,
        ...newEvaluation,
      })

      if (result.success) {
        // Refresh submission details to show new evaluation
        fetchSubmissionDetails()
        setEvaluationDialogOpen(false)
        // Reset form
        setNewEvaluation({
          judgeId: "",
          innovationScore: 0,
          sustainabilityScore: 0,
          presentationScore: 0,
          feasibilityScore: 0,
          relevanceScore: 0,
          communityImpactScore: 0,
          bonusScore: 0,
          comments: "",
        })
      } else {
        setError(result.error || "Failed to create evaluation")
      }
    } catch (err) {
      setError("An error occurred while creating evaluation")
      console.error(err)
    }
  }

  const getStatusBadge = (submission: any) => {
    if (submission.winner) {
      return <Badge className="bg-purple-600">Winner</Badge>
    } else if (submission.finalist) {
      return <Badge className="bg-blue-600">Finalist</Badge>
    } else if (submission.shortlisted) {
      return <Badge className="bg-green-600">Shortlisted</Badge>
    } else if (submission.status === "REJECTED") {
      return <Badge className="bg-red-600">Rejected</Badge>
    } else if (submission.status === "UNDER_REVIEW") {
      return <Badge className="bg-yellow-600">Under Review</Badge>
    } else {
      return <Badge className="bg-gray-600">Pending</Badge>
    }
  }

  const calculateTotalScore = (evaluation: any) => {
    return (
      evaluation.innovationScore +
      evaluation.sustainabilityScore +
      evaluation.presentationScore +
      evaluation.feasibilityScore +
      evaluation.relevanceScore +
      evaluation.communityImpactScore +
      evaluation.bonusScore
    )
  }

  const getAverageScore = () => {
    if (!submission?.evaluations || submission.evaluations.length === 0) return 0
    const totalScore = submission.evaluations.reduce(
      (sum: number, evaluation: any) => sum + calculateTotalScore(evaluation),
      0,
    )
    return (totalScore / submission.evaluations.length).toFixed(1)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error || !submission) {
    return (
      <div className="space-y-4">
        <Button variant="outline" asChild>
          <Link href="/admin/submissions">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Submissions
          </Link>
        </Button>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error || "Submission not found"}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/admin/submissions">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Submissions
          </Link>
        </Button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Select value={submission.status} onValueChange={handleStatusUpdate} disabled={statusUpdateLoading}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="FINALIST">Finalist</SelectItem>
                <SelectItem value="WINNER">Winner</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {getStatusBadge(submission)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Submission Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{submission.title}</h3>
                    <p className="text-gray-600">{submission.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Problem Statement</h4>
                    <p className="text-gray-600">{submission.problemStatement}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Proposed Solution</h4>
                    <p className="text-gray-600">{submission.proposedSolution}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Expected Impact</h4>
                    <p className="text-gray-600">{submission.expectedImpact}</p>
                  </div>

                  {submission.previousExperience && (
                    <div>
                      <h4 className="font-semibold mb-2">Previous Experience</h4>
                      <p className="text-gray-600">{submission.previousExperience}</p>
                    </div>
                  )}

                  {submission.whyThisTheme && (
                    <div>
                      <h4 className="font-semibold mb-2">Why This Theme</h4>
                      <p className="text-gray-600">{submission.whyThisTheme}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Team Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{submission.team.name}</h3>
                    <p className="text-gray-600">Team Size: {submission.team.size} members</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Team Leader</h4>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="font-medium">{submission.team.leader.name}</p>
                      <p className="text-sm text-gray-600">{submission.team.leader.email}</p>
                      <p className="text-sm text-gray-600">{submission.team.leader.phone}</p>
                      <p className="text-sm text-gray-600">{submission.team.leader.organizationName}</p>
                      <Badge variant="outline" className="mt-1">
                        {submission.team.leader.organizationType}
                      </Badge>
                    </div>
                  </div>

                  {submission.team.members && submission.team.members.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Team Members</h4>
                      <div className="space-y-2">
                        {submission.team.members.map((member: any, index: number) => (
                          <div key={member.id} className="bg-gray-50 p-3 rounded-md">
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-gray-600">{member.email}</p>
                            <p className="text-sm text-gray-600">{member.phone}</p>
                            {member.role && <p className="text-sm text-gray-600">Role: {member.role}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evaluations" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Evaluations
                    </CardTitle>
                    <Button onClick={() => setEvaluationDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Evaluation
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {submission.evaluations.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No evaluations yet</p>
                  ) : (
                    <div className="space-y-4">
                      {submission.evaluations.map((evaluation: any) => (
                        <div key={evaluation.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-semibold">{evaluation.judge.name}</p>
                              <p className="text-sm text-gray-600">{evaluation.judge.organization}</p>
                            </div>
                            <Badge variant="outline">Total: {calculateTotalScore(evaluation)}/100</Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <span className="text-gray-600">Innovation:</span>
                              <span className="ml-1 font-medium">{evaluation.innovationScore}/20</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Sustainability:</span>
                              <span className="ml-1 font-medium">{evaluation.sustainabilityScore}/20</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Presentation:</span>
                              <span className="ml-1 font-medium">{evaluation.presentationScore}/10</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Feasibility:</span>
                              <span className="ml-1 font-medium">{evaluation.feasibilityScore}/15</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Relevance:</span>
                              <span className="ml-1 font-medium">{evaluation.relevanceScore}/15</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Community Impact:</span>
                              <span className="ml-1 font-medium">{evaluation.communityImpactScore}/15</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Bonus:</span>
                              <span className="ml-1 font-medium">{evaluation.bonusScore}/5</span>
                            </div>
                          </div>

                          {evaluation.comments && (
                            <div className="mt-3 pt-3 border-t">
                              <p className="text-sm text-gray-600">
                                <strong>Comments:</strong> {evaluation.comments}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Theme:</span>
                <p className="font-medium">{submission.theme.title}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Submitted:</span>
                <p className="font-medium">{new Date(submission.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Last Updated:</span>
                <p className="font-medium">{new Date(submission.updatedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Evaluations:</span>
                <p className="font-medium">{submission.evaluations.length}</p>
              </div>
              {submission.evaluations.length > 0 && (
                <div>
                  <span className="text-sm text-gray-600">Average Score:</span>
                  <p className="font-medium">{getAverageScore()}/100</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Evaluation Dialog */}
      <Dialog open={evaluationDialogOpen} onOpenChange={setEvaluationDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Evaluation</DialogTitle>
            <DialogDescription>Create a new evaluation for this submission.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="judge">Judge</Label>
              <Select
                value={newEvaluation.judgeId}
                onValueChange={(value) => setNewEvaluation({ ...newEvaluation, judgeId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a judge" />
                </SelectTrigger>
                <SelectContent>
                  {judges.map((judge) => (
                    <SelectItem key={judge.id} value={judge.id}>
                      {judge.name} - {judge.organization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="innovation">Innovation & Creativity (0-20)</Label>
                <Input
                  id="innovation"
                  type="number"
                  min="0"
                  max="20"
                  value={newEvaluation.innovationScore}
                  onChange={(e) =>
                    setNewEvaluation({ ...newEvaluation, innovationScore: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <Label htmlFor="sustainability">Sustainability Impact (0-20)</Label>
                <Input
                  id="sustainability"
                  type="number"
                  min="0"
                  max="20"
                  value={newEvaluation.sustainabilityScore}
                  onChange={(e) =>
                    setNewEvaluation({ ...newEvaluation, sustainabilityScore: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <Label htmlFor="presentation">Presentation (0-10)</Label>
                <Input
                  id="presentation"
                  type="number"
                  min="0"
                  max="10"
                  value={newEvaluation.presentationScore}
                  onChange={(e) =>
                    setNewEvaluation({ ...newEvaluation, presentationScore: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <Label htmlFor="feasibility">Feasibility (0-15)</Label>
                <Input
                  id="feasibility"
                  type="number"
                  min="0"
                  max="15"
                  value={newEvaluation.feasibilityScore}
                  onChange={(e) =>
                    setNewEvaluation({ ...newEvaluation, feasibilityScore: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <Label htmlFor="relevance">Relevance to Theme (0-15)</Label>
                <Input
                  id="relevance"
                  type="number"
                  min="0"
                  max="15"
                  value={newEvaluation.relevanceScore}
                  onChange={(e) =>
                    setNewEvaluation({ ...newEvaluation, relevanceScore: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <Label htmlFor="community">Community Impact (0-15)</Label>
                <Input
                  id="community"
                  type="number"
                  min="0"
                  max="15"
                  value={newEvaluation.communityImpactScore}
                  onChange={(e) =>
                    setNewEvaluation({ ...newEvaluation, communityImpactScore: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <Label htmlFor="bonus">Bonus (0-5)</Label>
                <Input
                  id="bonus"
                  type="number"
                  min="0"
                  max="5"
                  value={newEvaluation.bonusScore}
                  onChange={(e) =>
                    setNewEvaluation({ ...newEvaluation, bonusScore: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                value={newEvaluation.comments}
                onChange={(e) => setNewEvaluation({ ...newEvaluation, comments: e.target.value })}
                placeholder="Additional comments about the submission..."
                rows={3}
              />
            </div>

            <div className="text-sm text-gray-600">
              Total Score:{" "}
              {Object.values(newEvaluation)
                .filter((val) => typeof val === "number")
                .reduce((sum, val) => sum + (val as number), 0)}/100
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEvaluationDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateEvaluation} disabled={!newEvaluation.judgeId}>
              Create Evaluation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
