"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getTeams, deleteTeam } from "@/lib/admin-action"
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
import { Badge } from "@/components/ui/badge"
import { Search, ChevronLeft, ChevronRight, Trash2, Eye } from "lucide-react"
import Link from "next/link"

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null)

  const fetchTeams = async (page = 1, search = "") => {
    setLoading(true)
    try {
      const data = await getTeams(page, 10, search)
      setTeams(data.teams)
      setTotalPages(data.totalPages)
      setCurrentPage(data.currentPage)
    } catch (err) {
      setError("Failed to load teams")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeams(currentPage, searchQuery)
  }, [currentPage])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchTeams(1, searchQuery)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const handleDeleteClick = (teamId: string) => {
    setTeamToDelete(teamId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!teamToDelete) return

    try {
      const result = await deleteTeam(teamToDelete)
      if (result.success) {
        // Refresh the teams list
        fetchTeams(currentPage, searchQuery)
      } else {
        setError(result.error || "Failed to delete team")
      }
    } catch (err) {
      setError("An error occurred while deleting the team")
      console.error(err)
    } finally {
      setDeleteDialogOpen(false)
      setTeamToDelete(null)
    }
  }

  const getSubmissionStatusBadge = (submission: any) => {
    if (!submission) return <Badge variant="outline">No Submission</Badge>

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
        <h2 className="text-2xl font-bold tracking-tight">Teams Management</h2>

        <form onSubmit={handleSearch} className="flex w-full sm:w-auto gap-2">
          <Input
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <Button type="submit" variant="secondary">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No teams found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Leader</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Theme</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell className="font-medium">{team.name}</TableCell>
                      <TableCell>
                        <div>{team.leader.name}</div>
                        <div className="text-sm text-gray-500">{team.leader.email}</div>
                      </TableCell>
                      <TableCell>{team.size}</TableCell>
                      <TableCell>{team.theme?.title || "N/A"}</TableCell>
                      <TableCell>{getSubmissionStatusBadge(team.submission)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/teams/${team.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(team.id)}>
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
              Are you sure you want to delete this team? This action cannot be undone.
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
