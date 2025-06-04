"use client"

import { useState, useEffect } from "react"
import { getThemes, createTheme, updateTheme, deleteTheme } from "@/lib/admin-action"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Plus, Edit, Trash2, Tag } from "lucide-react"

export default function ThemesPage() {
  const [themes, setThemes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<any>(null)
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    icon: "",
    subtitle: "",
    description: "",
  })

  const fetchThemes = async () => {
    setLoading(true)
    try {
      const data = await getThemes()
      setThemes(data)
    } catch (err) {
      setError("Failed to load themes")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchThemes()
  }, [])

  const resetForm = () => {
    setFormData({
      slug: "",
      title: "",
      icon: "",
      subtitle: "",
      description: "",
    })
  }

  const handleCreateClick = () => {
    resetForm()
    setCreateDialogOpen(true)
  }

  const handleEditClick = (theme: any) => {
    setSelectedTheme(theme)
    setFormData({
      slug: theme.slug,
      title: theme.title,
      icon: theme.icon,
      subtitle: theme.subtitle,
      description: theme.description,
    })
    setEditDialogOpen(true)
  }

  const handleDeleteClick = (theme: any) => {
    setSelectedTheme(theme)
    setDeleteDialogOpen(true)
  }

  const handleCreate = async () => {
    try {
      const result = await createTheme(formData)
      if (result.success) {
        fetchThemes()
        setCreateDialogOpen(false)
        resetForm()
      } else {
        setError(result.error || "Failed to create theme")
      }
    } catch (err) {
      setError("An error occurred while creating the theme")
      console.error(err)
    }
  }

  const handleUpdate = async () => {
    if (!selectedTheme) return

    try {
      const result = await updateTheme(selectedTheme.id, formData)
      if (result.success) {
        fetchThemes()
        setEditDialogOpen(false)
        setSelectedTheme(null)
        resetForm()
      } else {
        setError(result.error || "Failed to update theme")
      }
    } catch (err) {
      setError("An error occurred while updating the theme")
      console.error(err)
    }
  }

  const handleDelete = async () => {
    if (!selectedTheme) return

    try {
      const result = await deleteTheme(selectedTheme.id)
      if (result.success) {
        fetchThemes()
        setDeleteDialogOpen(false)
        setSelectedTheme(null)
      } else {
        setError(result.error || "Failed to delete theme")
      }
    } catch (err) {
      setError("An error occurred while deleting the theme")
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Themes Management</h2>
        <Button onClick={handleCreateClick}>
          <Plus className="h-4 w-4 mr-2" />
          Add Theme
        </Button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : themes.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No themes found</p>
              <Button onClick={handleCreateClick} className="mt-4">
                Create your first theme
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Theme</TableHead>
                    <TableHead>Subtitle</TableHead>
                    <TableHead>Teams</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {themes.map((theme) => (
                    <TableRow key={theme.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{theme.icon}</span>
                          <div>
                            <div className="font-medium">{theme.title}</div>
                            <div className="text-sm text-gray-500">{theme.slug}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">{theme.subtitle}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{theme._count.teams} teams</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{theme._count.submissions} submissions</Badge>
                      </TableCell>
                      <TableCell>{new Date(theme.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditClick(theme)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(theme)}>
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

      {/* Create Theme Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Theme</DialogTitle>
            <DialogDescription>Add a new theme for the ideathon.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Theme title"
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="theme-slug"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="icon">Icon (Emoji)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🌱"
                />
              </div>
              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Short description"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the theme"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!formData.title || !formData.slug}>
              Create Theme
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Theme Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Theme</DialogTitle>
            <DialogDescription>Update the theme information.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Theme title"
                />
              </div>
              <div>
                <Label htmlFor="edit-slug">Slug</Label>
                <Input
                  id="edit-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="theme-slug"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-icon">Icon (Emoji)</Label>
                <Input
                  id="edit-icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🌱"
                />
              </div>
              <div>
                <Label htmlFor="edit-subtitle">Subtitle</Label>
                <Input
                  id="edit-subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Short description"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the theme"
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={!formData.title || !formData.slug}>
              Update Theme
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
              Are you sure you want to delete the theme "{selectedTheme?.title}"? This action cannot be undone.
              {selectedTheme && (selectedTheme._count.teams > 0 || selectedTheme._count.submissions > 0) && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-yellow-800 text-sm">
                    Warning: This theme has {selectedTheme._count.teams} teams and {selectedTheme._count.submissions}{" "}
                    submissions associated with it.
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
