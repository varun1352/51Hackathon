"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Maximize2, Minimize2, Ruler, Download, SplitSquareVertical } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThreeDViewer } from "@/components/three-d-viewer"
import { FloorplanViewer } from "@/components/floorplan-viewer"

export default function D2CDemoPage() {
  const [fullscreen, setFullscreen] = useState(false)
  const [isMeasuring, setIsMeasuring] = useState(false)
  const [syncViews, setSyncViews] = useState(false)
  const [measurePoints, setMeasurePoints] = useState([])
  const [distance, setDistance] = useState(null)
  const [cameraPosition, setCameraPosition] = useState([5, 5, 5])
  const [cameraTarget, setCameraTarget] = useState([0, 0, 0])
  const [modelPaths, setModelPaths] = useState({
    ply: "/output.ply",
    floorplan: "/final_boundary.png",
  })
  const [filesExist, setFilesExist] = useState({
    ply: false,
    floorplan: false,
  })
  const [isLoading, setIsLoading] = useState(true)

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen)
  }

  // Check if files exist
  useEffect(() => {
    const checkFiles = async () => {
      setIsLoading(true)

      try {
        // Check if PLY file exists
        const plyResponse = await fetch(modelPaths.ply, { method: "HEAD" })
        const plyExists = plyResponse.ok

        // Check if floorplan image exists
        const floorplanResponse = await fetch(modelPaths.floorplan, { method: "HEAD" })
        const floorplanExists = floorplanResponse.ok

        setFilesExist({
          ply: plyExists,
          floorplan: floorplanExists,
        })
      } catch (error) {
        console.error("Error checking files:", error)
        setFilesExist({
          ply: false,
          floorplan: false,
        })
      } finally {
        setIsLoading(false)
      }
    }

    checkFiles()
  }, [modelPaths])

  // Update camera position based on floorplan interaction
  const updateCamera = (x, y) => {
    if (!syncViews) return

    // Map floorplan coordinates to 3D space
    const newX = (x / 100) * 10 - 5
    const newZ = (y / 100) * 10 - 5

    setCameraTarget([newX, 0, newZ])
    setCameraPosition([newX + 3, 3, newZ + 3])
  }

  // Reset measurement points
  const resetMeasurement = () => {
    setMeasurePoints([])
    setDistance(null)
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <div className="container mx-auto px-4 md:px-6 py-8 w-full">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter">D2C Demo: 3D Reconstruction</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Generate 3D models and floorplans from your home videos
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/d2c">
                <Button variant="outline">Back to D2C</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Floorplan View */}
            <div
              className={`relative border rounded-lg overflow-hidden ${fullscreen ? "fixed inset-0 z-50 p-4 bg-background" : "h-[500px]"}`}
            >
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <Button variant="outline" size="icon" onClick={toggleFullscreen}>
                  {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </div>

              <div className="absolute top-4 left-4 z-10 flex flex-col gap-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="measure"
                    checked={isMeasuring}
                    onCheckedChange={(checked) => {
                      setIsMeasuring(checked)
                      if (!checked) resetMeasurement()
                    }}
                  />
                  <Label htmlFor="measure" className="flex items-center gap-1">
                    <Ruler className="h-4 w-4" />
                    Measurement Tool
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="sync" checked={syncViews} onCheckedChange={setSyncViews} />
                  <Label htmlFor="sync" className="flex items-center gap-1">
                    <SplitSquareVertical className="h-4 w-4" />
                    Sync Views
                  </Label>
                </div>
                {distance && (
                  <div className="bg-primary/10 p-2 rounded-md text-center">
                    <p className="text-sm font-medium">Distance: {distance} meters</p>
                  </div>
                )}
              </div>

              <FloorplanViewer
                imagePath={modelPaths.floorplan}
                isMeasuring={isMeasuring}
                onMeasure={(points, dist) => {
                  setMeasurePoints(points)
                  setDistance(dist)
                }}
                onHover={updateCamera}
                syncViews={syncViews}
              />

              <div className="absolute bottom-4 left-4 z-10">
                <p className="text-xs text-gray-500 dark:text-gray-400">Floorplan View</p>
              </div>
            </div>

            {/* 3D View */}
            <div
              className={`relative border rounded-lg overflow-hidden ${fullscreen ? "fixed inset-0 z-50 p-4 bg-background" : "h-[500px]"}`}
            >
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <Button variant="outline" size="icon" onClick={toggleFullscreen}>
                  {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </div>

              <ThreeDViewer
                plyUrl={modelPaths.ply}
                cameraPosition={cameraPosition}
                cameraTarget={cameraTarget}
                measurePoints={measurePoints}
                useSimpleVisualization={true}
              />

              <div className="absolute bottom-4 left-4 z-10">
                <p className="text-xs text-gray-500 dark:text-gray-400">3D View</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>3D Reconstruction Details</CardTitle>
                <CardDescription>Information about the generated 3D model</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Model Statistics</h4>
                    <ul className="space-y-1">
                      <li className="flex justify-between">
                        <span className="text-sm">Vertices</span>
                        <span className="text-sm font-medium">24,568</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">Faces</span>
                        <span className="text-sm font-medium">48,932</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">Textures</span>
                        <span className="text-sm font-medium">12</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">File Size</span>
                        <span className="text-sm font-medium">8.4 MB</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Source Information</h4>
                    <ul className="space-y-1">
                      <li className="flex justify-between">
                        <span className="text-sm">Video Duration</span>
                        <span className="text-sm font-medium">2:34</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">Resolution</span>
                        <span className="text-sm font-medium">1920x1080</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">Frames Used</span>
                        <span className="text-sm font-medium">342</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">Processing Time</span>
                        <span className="text-sm font-medium">4:12</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-4 border-t">
                    <Button className="w-full" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download 3D Model
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Floorplan Details</CardTitle>
                <CardDescription>Information about the extracted floorplan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Room Information</h4>
                    <ul className="space-y-1">
                      <li className="flex justify-between">
                        <span className="text-sm">Living Room</span>
                        <span className="text-sm font-medium">24.5 m²</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">Kitchen</span>
                        <span className="text-sm font-medium">12.3 m²</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">Bedroom</span>
                        <span className="text-sm font-medium">15.8 m²</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">Bathroom</span>
                        <span className="text-sm font-medium">6.2 m²</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">Office</span>
                        <span className="text-sm font-medium">9.7 m²</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm font-medium">Total Area</span>
                        <span className="text-sm font-medium">68.5 m²</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Dimensions</h4>
                    <ul className="space-y-1">
                      <li className="flex justify-between">
                        <span className="text-sm">Width</span>
                        <span className="text-sm font-medium">10.2 m</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">Length</span>
                        <span className="text-sm font-medium">8.4 m</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">Ceiling Height</span>
                        <span className="text-sm font-medium">2.8 m</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-4 border-t">
                    <Button className="w-full" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download Floorplan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Measurement Tools</CardTitle>
                <CardDescription>Measure and analyze your space</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">How to Measure</h4>
                    <ol className="space-y-2 list-decimal list-inside text-sm text-gray-500 dark:text-gray-400">
                      <li>Enable the Measurement Tool using the toggle</li>
                      <li>Click on the floorplan to set your first point</li>
                      <li>Click again to set your second point</li>
                      <li>The distance will be displayed in meters</li>
                      <li>Click again to start a new measurement</li>
                    </ol>
                  </div>
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Saved Measurements</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center">
                        <span className="text-sm">Living Room Width</span>
                        <span className="text-sm font-medium">4.8 m</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-sm">Kitchen to Bedroom</span>
                        <span className="text-sm font-medium">6.2 m</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-sm">Bathroom Width</span>
                        <span className="text-sm font-medium">2.1 m</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-4 border-t">
                    <Button className="w-full" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export Measurements
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

