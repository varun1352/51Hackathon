"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Building,
  Camera,
  Download,
  FileText,
  Grid,
  LogOut,
  Plus,
  Settings,
  BarChart3,
  Eye,
  EyeOff,
  Maximize,
  Minimize,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ThreeDViewer } from "@/components/three-d-viewer"
import { FloorplanViewer } from "@/components/floorplan-viewer"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

export default function B2BDashboardPage() {
  const [activeProject, setActiveProject] = useState("Office Building")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [coverageStats, setCoverageStats] = useState({
    totalArea: 2500,
    coveredArea: 1875,
    blindspots: 625,
    coveragePercentage: 75,
  })
  const [cameras, setCameras] = useState([
    { id: 1, name: "Entrance Cam", status: "Online", coverage: 92 },
    { id: 2, name: "Hallway Cam 1", status: "Online", coverage: 78 },
    { id: 3, name: "Office Area Cam", status: "Online", coverage: 85 },
    { id: 4, name: "Hallway Cam 2", status: "Offline", coverage: 0 },
    { id: 5, name: "Conference Room", status: "Online", coverage: 95 },
  ])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Building className="h-6 w-6" />
              <span className="font-bold">VU.io</span>
            </div>
          </SidebarHeader>
          <SidebarSeparator />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive>
                      <Link href="/b2b/dashboard">
                        <Grid className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/b2b/projects">
                        <Building className="h-4 w-4" />
                        <span>Projects</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/b2b/cameras">
                        <Camera className="h-4 w-4" />
                        <span>Cameras</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/b2b/reports">
                        <FileText className="h-4 w-4" />
                        <span>Reports</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Projects</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={activeProject === "Office Building"}
                      onClick={() => setActiveProject("Office Building")}
                    >
                      <button>
                        <Building className="h-4 w-4" />
                        <span>Office Building</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={activeProject === "Retail Store"}
                      onClick={() => setActiveProject("Retail Store")}
                    >
                      <button>
                        <Building className="h-4 w-4" />
                        <span>Retail Store</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={activeProject === "Warehouse"}
                      onClick={() => setActiveProject("Warehouse")}
                    >
                      <button>
                        <Building className="h-4 w-4" />
                        <span>Warehouse</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-700 flex items-center justify-center text-white font-semibold">
                A
              </div>
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@vu.io</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Link>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 overflow-auto">
          <div className="container p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{activeProject} Dashboard</h1>
                <p className="text-muted-foreground">
                  Monitor your surveillance coverage and optimize camera placement
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Camera
                </Button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Area</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{coverageStats.totalArea} m²</div>
                  <p className="text-xs text-muted-foreground">Floor space being monitored</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Covered Area</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{coverageStats.coveredArea} m²</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 font-medium">{coverageStats.coveragePercentage}%</span> of total
                    area
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Blindspots</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{coverageStats.blindspots} m²</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-red-500 font-medium">{100 - coverageStats.coveragePercentage}%</span> of total
                    area
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Cameras</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {cameras.filter((c) => c.status === "Online").length}/{cameras.length}
                  </div>
                  <p className="text-xs text-muted-foreground">Cameras currently online</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-12 mb-8">
              <Card className={`${isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""} md:col-span-8`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Floor Coverage Analysis</CardTitle>
                    <CardDescription>3D visualization with coverage overlay</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative">
                    <Tabs defaultValue="3d" className="w-full">
                      <div className="px-4 pt-2">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="3d">3D View</TabsTrigger>
                          <TabsTrigger value="floorplan">Floorplan</TabsTrigger>
                        </TabsList>
                      </div>
                      <TabsContent value="3d" className="m-0">
                        <div className={`${isFullscreen ? "h-screen" : "h-[400px]"} w-full`}>
                          <ThreeDViewer />
                        </div>
                      </TabsContent>
                      <TabsContent value="floorplan" className="m-0">
                        <div
                          className={`${isFullscreen ? "h-screen" : "h-[400px]"} w-full bg-gray-50 dark:bg-gray-900`}
                        >
                          <FloorplanViewer />
                        </div>
                      </TabsContent>
                    </Tabs>
                    <div className="absolute bottom-4 left-4 flex flex-col gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-xs">Covered Area</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-xs">Blindspots</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-xs">Camera Location</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Toggle Coverage
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export View
                  </Button>
                </CardFooter>
              </Card>
              <Card className="md:col-span-4">
                <CardHeader>
                  <CardTitle>Camera Status</CardTitle>
                  <CardDescription>Current camera performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cameras.map((camera) => (
                      <div key={camera.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Camera className="h-4 w-4" />
                            <span className="font-medium">{camera.name}</span>
                          </div>
                          <Badge variant={camera.status === "Online" ? "default" : "destructive"}>
                            {camera.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={camera.coverage} className="h-2" />
                          <span className="text-xs font-medium">{camera.coverage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure Cameras
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Coverage Optimization</CardTitle>
                  <CardDescription>Suggested improvements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-3 rounded-lg border bg-gray-50 dark:bg-gray-900">
                      <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full">
                        <EyeOff className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Northeast Corner Blindspot</h4>
                        <p className="text-sm text-muted-foreground">
                          Add a camera at coordinates (12.5, 8.2) to cover 85m² of blindspot area.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-3 rounded-lg border bg-gray-50 dark:bg-gray-900">
                      <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full">
                        <Camera className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Hallway Cam 2 Offline</h4>
                        <p className="text-sm text-muted-foreground">
                          Camera is offline. Check power supply and network connection.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-3 rounded-lg border bg-gray-50 dark:bg-gray-900">
                      <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                        <BarChart3 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Coverage Improvement</h4>
                        <p className="text-sm text-muted-foreground">
                          Adjusting Entrance Cam angle by 15° east would improve coverage by 7%.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">View All Recommendations</Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>System events and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { time: "Today, 10:32 AM", event: "Hallway Cam 2 went offline", type: "alert" },
                      { time: "Today, 09:15 AM", event: "Coverage analysis completed", type: "info" },
                      { time: "Yesterday, 4:23 PM", event: "New camera added: Conference Room", type: "success" },
                      { time: "Yesterday, 2:45 PM", event: "Floorplan updated", type: "info" },
                      { time: "Apr 12, 11:30 AM", event: "System maintenance completed", type: "info" },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div
                          className={`mt-0.5 h-2 w-2 rounded-full ${
                            activity.type === "alert"
                              ? "bg-red-500"
                              : activity.type === "success"
                                ? "bg-green-500"
                                : "bg-blue-500"
                          }`}
                        />
                        <div>
                          <p className="text-sm font-medium">{activity.event}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

