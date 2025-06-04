"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FileText, CheckCircle, XCircle, Award, Trophy, UserCheck } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getDashboardStats } from "@/lib/admin-action"

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats()
        setStats(data)
      } catch (err) {
        setError("Failed to load dashboard statistics")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Teams</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTeams}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Submissions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSubmissions}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Shortlisted</p>
              <p className="text-2xl font-bold text-gray-900">{stats.shortlistedSubmissions}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <Trophy className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Winners</p>
              <p className="text-2xl font-bold text-gray-900">{stats.winnerSubmissions}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different charts */}
      <Tabs defaultValue="submissions" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
        </TabsList>

        <TabsContent value="submissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Submissions Status</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer
                config={{
                  pending: {
                    label: "Pending",
                    color: "hsl(var(--chart-1))",
                  },
                  shortlisted: {
                    label: "Shortlisted",
                    color: "hsl(var(--chart-2))",
                  },
                  rejected: {
                    label: "Rejected",
                    color: "hsl(var(--chart-3))",
                  },
                  finalist: {
                    label: "Finalist",
                    color: "hsl(var(--chart-4))",
                  },
                  winner: {
                    label: "Winner",
                    color: "hsl(var(--chart-5))",
                  },
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: "Submissions",
                        pending: stats.pendingSubmissions,
                        shortlisted: stats.shortlistedSubmissions,
                        rejected: stats.rejectedSubmissions,
                        finalist: stats.finalistSubmissions,
                        winner: stats.winnerSubmissions,
                      },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="pending" fill="var(--color-pending)" name="Pending" />
                    <Bar dataKey="shortlisted" fill="var(--color-shortlisted)" name="Shortlisted" />
                    <Bar dataKey="rejected" fill="var(--color-rejected)" name="Rejected" />
                    <Bar dataKey="finalist" fill="var(--color-finalist)" name="Finalist" />
                    <Bar dataKey="winner" fill="var(--color-winner)" name="Winner" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="themes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Submissions by Theme</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer
                config={stats.submissionsByTheme.reduce((acc: any, item: any) => {
                  acc[item.theme] = {
                    label: item.theme,
                    color: `hsl(${Math.random() * 360}, 70%, 50%)`,
                  }
                  return acc
                }, {})}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.submissionsByTheme.map((item: any) => ({
                      theme: item.theme,
                      count: item.count,
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="theme" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Submissions" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-indigo-100 p-3 rounded-full">
              <UserCheck className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Judges</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalJudges}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-pink-100 p-3 rounded-full">
              <Award className="h-6 w-6 text-pink-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Evaluations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEvaluations}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center">
            <div className="bg-orange-100 p-3 rounded-full">
              <XCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rejectedSubmissions}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
