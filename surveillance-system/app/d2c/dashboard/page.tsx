"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Building, Download, FileText, Grid, Home, LogOut, Menu, Plus, Settings, Upload, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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

export default function D2CDashboardPage() {
  const [activeProject, setActiveProject] = useState("My Home")

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6" />
              <span className="font-bold">SurveillanceAI</span>
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
                      <Link href="/d2c/dashboard">
                        <Grid className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/d2c/models">
                        <Home className="h-4 w-4" />
                        <span>My Models</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/d2c/measurements">
                        <FileText className="h-4 w-4" />
                        <span>Measurements</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>My Spaces</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={activeProject === "My Home"}
                      onClick={() => setActiveProject("My Home")}
                    >
                      <button>
                        <Home className="h-4 w-4" />
                        <span>My Home</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={activeProject === "Vacation House"}
                      onClick={() => setActiveProject("Vacation House")}
                    >
                      <button>
                        <Home className="h-4 w-4" />
                        <span>Vacation House</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={activeProject === "Office"}
                      onClick={() => setActiveProject("Office")}
                    >
                      <button>
                        <Building className="h-4 w-4" />
                        <span>Office</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Plus className="h-4 w-4" />
                      <span>Add Space</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/d2c/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/login">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1">
          <header className="border-b">
            <div className="flex h-16 items-center px-4 md:px-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="md:hidden">
                  <div className="flex items-center gap-2 mb-6">
                    <Home className="h-6 w-6" />
                    <span className="font-bold">SurveillanceAI</span>
                  </div>
                  <div className="grid gap-4">
                    <Link href="/d2c/dashboard" className="flex items-center gap-2 text-sm font-medium">
                      <Grid className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link href="/d2c/models" className="flex items-center gap-2 text-sm font-medium">
                      <Home className="h-4 w-4" />
                      My Models
                    </Link>
                    <Link href="/d2c/measurements" className="flex items-center gap-2 text-sm font-medium">
                      <FileText className="h-4 w-4" />
                      Measurements
                    </Link>
                    <div className="border-t my-4 pt-4">
                      <h3 className="text-sm font-medium mb-2">My Spaces</h3>
                      <div className="grid gap-2">
                        <button className="flex items-center gap-2 text-sm font-medium">
                          <Home className="h-4 w-4" />
                          My Home
                        </button>
                        <button className="flex items-center gap-2 text-sm font-medium">
                          <Home className="h-4 w-4" />
                          Vacation House
                        </button>
                        <button className="flex items-center gap-2 text-sm font-medium">
                          <Building className="h-4 w-4" />
                          Office
                        </button>
                        <button className="flex items-center gap-2 text-sm font-medium">
                          <Plus className="h-4 w-4" />
                          Add Space
                        </button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <div className="ml-auto flex items-center gap-4">
                <Button variant="outline" size="sm">
                  <User className="mr-2 h-4 w-4" />
                  Jane Smith
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">
            <div className="flex flex-col gap-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{activeProject} Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your 3D models and measurements</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Models</CardTitle>
                    <Home className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">+1 from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Area</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-square text-muted-foreground"
                    >
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">142 m²</div>
                    <p className="text-xs text-muted-foreground">Across all models</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Saved Measurements</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-ruler text-muted-foreground"
                    >
                      <path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z" />
                      <path d="m7.5 10.5 2 2" />
                      <path d="m10.5 7.5 2 2" />
                      <path d="m13.5 4.5 2 2" />
                      <path d="m4.5 13.5 2 2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">+3 from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-hard-drive text-muted-foreground"
                    >
                      <line x1="22" x2="2" y1="12" y2="12" />
                      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                      <line x1="6" x2="6.01" y1="16" y2="16" />
                      <line x1="10" x2="10.01" y1="16" y2="16" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">28.4 MB</div>
                    <p className="text-xs text-muted-foreground">of 1 GB (2.8%)</p>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="models" className="w-full">
                <TabsList>
                  <TabsTrigger value="models">My Models</TabsTrigger>
                  <TabsTrigger value="measurements">Measurements</TabsTrigger>
                  <TabsTrigger value="uploads">Upload New</TabsTrigger>
                </TabsList>
                <TabsContent value="models" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader className="p-0">
                        <div className="relative h-48 w-full">
                          <Image
                            src="/placeholder.svg?height=192&width=384"
                            alt="My Home 3D Model"
                            fill
                            className="object-cover rounded-t-lg"
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <h3 className="font-bold">My Home</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Created 2 weeks ago</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">142 m²</span>
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">5 rooms</span>
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">8.4 MB</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between p-4 pt-0">
                        <Button variant="outline" size="sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-eye mr-2 h-4 w-4"
                          >
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </CardFooter>
                    </Card>
                    <Card>
                      <CardHeader className="p-0">
                        <div className="relative h-48 w-full">
                          <Image
                            src="/placeholder.svg?height=192&width=384"
                            alt="Vacation House 3D Model"
                            fill
                            className="object-cover rounded-t-lg"
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <h3 className="font-bold">Vacation House</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Created 1 month ago</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">98 m²</span>
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">3 rooms</span>
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">6.2 MB</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between p-4 pt-0">
                        <Button variant="outline" size="sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-eye mr-2 h-4 w-4"
                          >
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </CardFooter>
                    </Card>
                    <Card>
                      <CardHeader className="p-0">
                        <div className="relative h-48 w-full">
                          <Image
                            src="/placeholder.svg?height=192&width=384"
                            alt="Office 3D Model"
                            fill
                            className="object-cover rounded-t-lg"
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <h3 className="font-bold">Office</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Created 2 months ago</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">64 m²</span>
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">2 rooms</span>
                          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">4.8 MB</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between p-4 pt-0">
                        <Button variant="outline" size="sm">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-eye mr-2 h-4 w-4"
                          >
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="measurements" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Saved Measurements</CardTitle>
                      <CardDescription>View and manage your saved measurements</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border rounded-lg">
                          <div className="grid grid-cols-4 gap-4 p-4 font-medium border-b">
                            <div>Name</div>
                            <div>Space</div>
                            <div>Measurement</div>
                            <div>Date</div>
                          </div>
                          <div className="divide-y">
                            <div className="grid grid-cols-4 gap-4 p-4">
                              <div>Living Room Width</div>
                              <div>My Home</div>
                              <div>4.8 m</div>
                              <div className="text-gray-500 dark:text-gray-400">2 weeks ago</div>
                            </div>
                            <div className="grid grid-cols-4 gap-4 p-4">
                              <div>Kitchen to Bedroom</div>
                              <div>My Home</div>
                              <div>6.2 m</div>
                              <div className="text-gray-500 dark:text-gray-400">2 weeks ago</div>
                            </div>
                            <div className="grid grid-cols-4 gap-4 p-4">
                              <div>Bathroom Width</div>
                              <div>My Home</div>
                              <div>2.1 m</div>
                              <div className="text-gray-500 dark:text-gray-400">2 weeks ago</div>
                            </div>
                            <div className="grid grid-cols-4 gap-4 p-4">
                              <div>Master Bedroom</div>
                              <div>Vacation House</div>
                              <div>3.8 m × 4.2 m</div>
                              <div className="text-gray-500 dark:text-gray-400">1 month ago</div>
                            </div>
                            <div className="grid grid-cols-4 gap-4 p-4">
                              <div>Living Area</div>
                              <div>Vacation House</div>
                              <div>42.5 m²</div>
                              <div className="text-gray-500 dark:text-gray-400">1 month ago</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Export Measurements
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="uploads" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload New Video or Images</CardTitle>
                      <CardDescription>Create a new 3D model from your videos or images</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12">
                        <div className="flex flex-col items-center justify-center space-y-2 text-center">
                          <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                            <Upload className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                          </div>
                          <h3 className="font-medium">Drag and drop your files here</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Support for video files (MP4, MOV) or multiple images (JPG, PNG)
                          </p>
                          <Button size="sm">Browse Files</Button>
                        </div>
                      </div>
                      <div className="mt-6 space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Project Name
                          </label>
                          <input
                            id="name"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Enter a name for your project"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="type" className="text-sm font-medium">
                            Space Type
                          </label>
                          <select
                            id="type"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Select a type</option>
                            <option value="home">Home</option>
                            <option value="apartment">Apartment</option>
                            <option value="office">Office</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Start Processing</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

