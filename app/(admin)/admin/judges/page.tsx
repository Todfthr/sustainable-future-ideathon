"use client"

import { useState, useEffect } from "react"
import { getJudges, createJudge, updateJudge, deleteJudge } from "@/lib/admin-action"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Edit, Trash2, Award } from "lucide-react"

export default function JudgesPage() {
  const [judges, setJudges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedJudge, setSelectedJudge] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    expertise: "",
    organization: "",
  })

  const fetchJudges = async () => {
    setLoading(true)
    try {
      const data = await getJudges()
      setJudges(data)
    } catch (err) {
      setError("Failed to load judges")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJudges()
  }, [])

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      expertise: "",
      organization: "",
    })
  }

  const handleCreateClick = () => {
    resetForm()
    setCreateDialogOpen(true)
  }

  const handleEditClick = (judge: any) => {
    setSelectedJudge(judge)
    setFormData({
      name: judge.name,
      email: judge.email,
      expertise: judge.expertise || "",
      organization: judge.organization || "",
    })
    setEditDialogOpen(true)
  }

  const handleDeleteClick = (judge: any) => {
    setSelectedJudge(judge)
    setDeleteDialogOpen(true)
  }

  const handleCreate = async () => {
    try {
      const result = await createJudge(formData)
      if (result.success) {
        fetchJudges()
        setCreateDialogOpen(false)
        resetForm()
      } else {
        setError(result.error || "Failed to create judge")
      }
    } catch (err) {
      setError("An error occurred while creating the judge")
      console.error(err)
    }
  }

  const handleUpdate = async () => {
    if (!selectedJudge) return

    try {
      const result = await updateJudge(selectedJudge.id, formData)
      if (result.success) {
        fetchJudges()
        setEditDialogOpen(false)
        setSelectedJudge(null)
        resetForm()
      } else {
        setError(result.error || "Failed to update judge")
      }
    } catch (err) {
      setError("An error occurred while updating the judge")
      console.error(err)
    }
  }

  const handleDelete = async () => {
    if (!selectedJudge) return

    try {
      const result = await deleteJudge(selectedJudge.id)
      if (result.success) {
        fetchJudges()
        setDeleteDialogOpen(false)
        setSelectedJudge(null)
      } else {
        setError(result.error || "Failed to delete judge")
      }
    } catch (err) {
      setError("An error occurred while deleting the judge")
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Judges Management</h2>
        <Button onClick={handleCreateClick}>
          <Plus className="h-4 w-4 mr-2" />
          Add Judge
        </Button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : judges.length === 0 ? (
            <div className="text-center py-12">
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No judges found</p>
              <Button onClick={handleCreateClick} className="mt-4">
                Add your first judge
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Expertise</TableHead>
                    <TableHead>Evaluations</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {judges.map((judge) => (
                    <TableRow key={judge.id}>
                      <TableCell className="font-medium">{judge.name}</TableCell>
                      <TableCell>{judge.email}</TableCell>
                      <TableCell>{judge.organization || "N/A"}</TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">{judge.expertise || "N/A"}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{judge._count.evaluations} evaluations</Badge>
                      </TableCell>
                      <TableCell>{new Date(judge.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditClick(judge)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(judge)}>
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

      {/* Create Judge Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Judge</DialogTitle>
            <DialogDescription>Add a new judge to evaluate submissions.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Judge's full name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="judge@example.com"
              />
            </div>

            <div>
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="Organization or company"
              />
            </div>

            <div>
              <Label htmlFor="expertise">Expertise</Label>
              <Input
                id="expertise"
                value={formData.expertise}
                onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                placeholder="Areas of expertise"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!formData.name || !formData.email}>
              Add Judge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Judge Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Judge</DialogTitle>
            <DialogDescription>Update the judge information.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Judge's full name"
              />
            </div>

            <div>
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="judge@example.com"
              />
            </div>

            <div>
              <Label htmlFor="edit-organization">Organization</Label>
              <Input
                id="edit-organization"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="Organization or company"
              />
            </div>

            <div>
              <Label htmlFor="edit-expertise">Expertise</Label>
              <Input
                id="edit-expertise"
                value={formData.expertise}
                onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                placeholder="Areas of expertise"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={!formData.name || !formData.email}>
              Update Judge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete judge "{selectedJudge?.name}"? This action cannot be undone.
              {selectedJudge && selectedJudge._count.evaluations > 0 && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-yellow-800 text-sm">
                    Warning: This judge has {selectedJudge._count.evaluations} evaluations.
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
