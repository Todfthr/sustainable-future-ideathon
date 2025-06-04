"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getSubmissions, deleteSubmission, getThemes } from "@/lib/admin-action"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronLeft, ChevronRight, Trash2, Eye, Filter } from "lucide-react"
import Link from "next/link"

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [themes, setThemes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [themeFilter, setThemeFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [submissionToDelete, setSubmissionToDelete] = useState<string | null>(null)

  const fetchSubmissions = async (page = 1, status = "", themeId = "", search = "") => {
    setLoading(true)
    try {
      const data = await getSubmissions(page, 10, status, themeId, search)
      setSubmissions(data.submissions)
      setTotalPages(data.totalPages)
      setCurrentPage(data.currentPage)
    } catch (err) {
      setError("Failed to load submissions")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchThemes = async () => {
    try {
      const data = await getThemes()
      setThemes(data)
    } catch (err) {
      console.error("Failed to load themes:", err)
    }
  }

  useEffect(() => {
    fetchThemes()
    fetchSubmissions(currentPage, statusFilter, themeFilter, searchQuery)
  }, [currentPage])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchSubmissions(1, statusFilter, themeFilter, searchQuery)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
    fetchSubmissions(1, value, themeFilter, searchQuery)
  }

  const handleThemeChange = (value: string) => {
    setThemeFilter(value)
    setCurrentPage(1)
    fetchSubmissions(1, statusFilter, value, searchQuery)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const handleDeleteClick = (submissionId: string) => {
    setSubmissionToDelete(submissionId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!submissionToDelete) return

    try {
      const result = await deleteSubmission(submissionToDelete)
      if (result.success) {
        fetchSubmissions(currentPage, statusFilter, themeFilter, searchQuery)
      } else {
        setError(result.error || "Failed to delete submission")
      }
    } catch (err) {
      setError("An error occurred while deleting the submission")
      console.error(err)
    } finally {
      setDeleteDialogOpen(false)
      setSubmissionToDelete(null)
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Submissions Management</h2>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Search submissions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" variant="secondary" size="sm">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
            <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="FINALIST">Finalist</SelectItem>
            <SelectItem value="WINNER">Winner</SelectItem>
          </SelectContent>
        </Select>

        <Select value={themeFilter} onValueChange={handleThemeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Themes</SelectItem>
            {themes.map((theme) => (
              <SelectItem key={theme.id} value={theme.id}>
                {theme.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => {
            setSearchQuery("")
            setStatusFilter("all")
            setThemeFilter("all")
            setCurrentPage(1)
            fetchSubmissions(1, "all", "all", "")
          }}
        >
          <Filter className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No submissions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Theme</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Evaluations</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">
                        <div className="max-w-xs truncate">{submission.title}</div>
                      </TableCell>
                      <TableCell>
                        <div>{submission.team.name}</div>
                        <div className="text-sm text-gray-500">{submission.team.leader.name}</div>
                      </TableCell>
                      <TableCell>{submission.theme.title}</TableCell>
                      <TableCell>{getStatusBadge(submission)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{submission.evaluations.length} evaluations</Badge>
                      </TableCell>
                      <TableCell>{new Date(submission.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/submissions/${submission.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(submission.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this submission? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
