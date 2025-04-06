"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Maximize2, Minimize2, Eye, EyeOff, Download, Ruler, SplitSquareVertical } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThreeDViewer } from "@/components/three-d-viewer"
import { FloorplanViewer } from "@/components/floorplan-viewer"

export default function B2BDemoPage() {
  const [fullscreen, setFullscreen] = useState(false)
  const [showCoverage, setShowCoverage] = useState(true)
  const [coverageOpacity, setCoverageOpacity] = useState(0.5)
  const [isMeasuring, setIsMeasuring] = useState(false)
  const [syncViews, setSyncViews] = useState(false)
  const [measurePoints, setMeasurePoints] = useState([])
  const [distance, setDistance] = useState(null)
  const [cameraPosition, setCameraPosition] = useState([5, 5, 5])
  const [cameraTarget, setCameraTarget] = useState([0, 0, 0])
  const [modelPaths, setModelPaths] = useState({
    ply: "/output.ply",
    groundTruthFloorplan: "/ground_truth_floorplan.png",
    predictedFloorplan: "/final_boundary.png",
  })
  const [filesExist, setFilesExist] = useState({
    ply: false,
    groundTruthFloorplan: false,
    predictedFloorplan: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const canvasRef = useRef(null)

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

        // Check if ground truth floorplan image exists
        const groundTruthResponse = await fetch(modelPaths.groundTruthFloorplan, { method: "HEAD" })
        const groundTruthExists = groundTruthResponse.ok

        // Check if predicted floorplan image exists
        const predictedResponse = await fetch(modelPaths.predictedFloorplan, { method: "HEAD" })
        const predictedExists = predictedResponse.ok

        setFilesExist({
          ply: plyExists,
          groundTruthFloorplan: groundTruthExists,
          predictedFloorplan: predictedExists,
        })
      } catch (error) {
        console.error("Error checking files:", error)
        setFilesExist({
          ply: false,
          groundTruthFloorplan: false,
          predictedFloorplan: false,
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
              <h1 className="text-3xl font-bold tracking-tighter">B2B Demo: Coverage Analysis</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Visualize camera coverage and identify blindspots in your facility
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/b2b">
                <Button variant="outline">Back to B2B</Button>
              </Link>
              <Link href="/contact">
                <Button>
                  Contact Sales
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <Tabs defaultValue="floorplan" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="floorplan">Overlay View</TabsTrigger>
              <TabsTrigger value="prediction">Prediction</TabsTrigger>
              <TabsTrigger value="3d">3D View</TabsTrigger>
            </TabsList>

            {/* Ground Truth Floorplan View with Prediction Overlay */}
            <TabsContent value="floorplan" className="mt-4">
              <div
                className={`relative border rounded-lg overflow-hidden ${fullscreen ? "fixed inset-0 z-50 p-4 bg-background" : "h-[600px]"}`}
              >
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <Button variant="outline" size="icon" onClick={toggleFullscreen}>
                    {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="absolute top-4 left-4 z-10 flex flex-col gap-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="opacity-overlay" className="flex items-center gap-1">
                      Prediction Opacity: {Math.round(coverageOpacity * 100)}%
                    </Label>
                  </div>
                  <div className="space-y-2">
                    <Slider
                      id="opacity-overlay"
                      min={0}
                      max={1}
                      step={0.05}
                      value={[coverageOpacity]}
                      onValueChange={(value) => setCoverageOpacity(value[0])}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="measure-overlay"
                      checked={isMeasuring}
                      onCheckedChange={(checked) => {
                        setIsMeasuring(checked)
                        if (!checked) resetMeasurement()
                      }}
                    />
                    <Label htmlFor="measure-overlay" className="flex items-center gap-1">
                      <Ruler className="h-4 w-4" />
                      Measurement Tool
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="sync-overlay" checked={syncViews} onCheckedChange={setSyncViews} />
                    <Label htmlFor="sync-overlay" className="flex items-center gap-1">
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

                <div className="relative h-full w-full">
                  <FloorplanViewer
                    imagePath={modelPaths.groundTruthFloorplan}
                    isMeasuring={isMeasuring}
                    onMeasure={(points, dist) => {
                      setMeasurePoints(points)
                      setDistance(dist)
                    }}
                    onHover={updateCamera}
                    syncViews={syncViews}
                    showCoverage={false} // Hide the separate coverage layer
                    coverageOpacity={1} // Ensure ground truth is fully visible
                  />
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: coverageOpacity, pointerEvents: 'none' }}>
                    <FloorplanViewer
                      imagePath={modelPaths.predictedFloorplan}
                      isMeasuring={isMeasuring}
                      onMeasure={(points, dist) => {
                        setMeasurePoints(points)
                        setDistance(dist)
                      }}
                      onHover={updateCamera}
                      syncViews={syncViews}
                      showCoverage={false} // Hide the separate coverage layer
                      coverageOpacity={1}
                    />
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 z-10">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ground Truth with Prediction Overlay</p>
                </div>
              </div>
            </TabsContent>

            {/* Predicted Floorplan View */}
            <TabsContent value="prediction" className="mt-4">
              <div
                className={`relative border rounded-lg overflow-hidden ${fullscreen ? "fixed inset-0 z-50 p-4 bg-background" : "h-[600px]"}`}
              >
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <Button variant="outline" size="icon" onClick={toggleFullscreen}>
                    {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="absolute top-4 left-4 z-10 flex flex-col gap-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="measure-pred"
                      checked={isMeasuring}
                      onCheckedChange={(checked) => {
                        setIsMeasuring(checked)
                        if (!checked) resetMeasurement()
                      }}
                    />
                    <Label htmlFor="measure-pred" className="flex items-center gap-1">
                      <Ruler className="h-4 w-4" />
                      Measurement Tool
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="sync-pred" checked={syncViews} onCheckedChange={setSyncViews} />
                    <Label htmlFor="sync-pred" className="flex items-center gap-1">
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
                  imagePath={modelPaths.predictedFloorplan}
                  isMeasuring={isMeasuring}
                  onMeasure={(points, dist) => {
                    setMeasurePoints(points)
                    setDistance(dist)
                  }}
                  onHover={updateCamera}
                  syncViews={syncViews}
                  showCoverage={false} // Ensure no coverage overlay here
                  coverageOpacity={1}
                />

                <div className="absolute bottom-4 left-4 z-10">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Predicted Floorplan</p>
                </div>
              </div>
            </TabsContent>

            {/* 3D View */}
            <TabsContent value="3d" className="mt-4">
              <div
                className={`relative border rounded-lg overflow-hidden ${fullscreen ? "fixed inset-0 z-50 p-4 bg-background" : "h-[600px]"}`}
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
            </TabsContent>
          </Tabs>

          <div className="grid gap-6 md:grid-cols-3 mt-8">
            {/* ... rest of the code for cards remains the same ... */}
            <Card>
              <CardHeader>
                <CardTitle>Coverage Analysis</CardTitle>
                <CardDescription>Current surveillance coverage statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Total Coverage</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-green-600 h-2.5 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Blindspot Area</span>
                      <span className="text-sm font-medium">22%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-red-600 h-2.5 rounded-full" style={{ width: "22%" }}></div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Room Coverage</h4>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-sm">Office A</span>
                        <span className="text-sm font-medium">85%</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">Office B</span>
                        <span className="text-sm font-medium">82%</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">Conference Room</span>
                        <span className="text-sm font-medium">75%</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-sm">Reception</span>
                        <span className="text-sm font-medium">70%</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Camera Information</CardTitle>
                <CardDescription>Details of installed cameras</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Camera 1 (Office A)</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Model: HD-1080P-PTZ</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Field of View: 120°</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Range: 5m</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Camera 2 (Office B)</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Model: HD-1080P-PTZ</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Field of View: 120°</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Range: 5m</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Camera 3 (Conference)</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Model: HD-1080P-PTZ</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Field of View: 120°</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Range: 5m</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Camera 4 (Reception)</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Model: HD-1080P-PTZ</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Field of View: 120°</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Range: 5m</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Optimization Recommendations</CardTitle>
                <CardDescription>AI-powered suggestions to improve coverage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <h4 className="text-sm font-medium flex items-center gap-1 text-yellow-800 dark:text-yellow-400">
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
                        className="lucide lucide-alert-triangle"
                      >
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                        <path d="M12 9v4" />
                        <path d="M12 17h.01" />
                      </svg>
                      Blindspot Detected
                    </h4>
                    <p className="text-sm text-yellow-800 dark:text-yellow-400 mt-1">
                      Center area has limited coverage. Consider adding an additional camera.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Suggested Improvements</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
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
                          className="lucide lucide-plus-circle mt-0.5 text-green-500"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M8 12h8" />
                          <path d="M12 8v8" />
                        </svg>
                        <span className="text-sm">Add a ceiling-mounted camera in the center hallway intersection</span>
                      </li>
                      <li className="flex items-start gap-2">
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
                          className="lucide lucide-move mt-0.5 text-blue-500"
                        >
                          <path d="M5 9l-3 3 3 3" />
                          <path d="M9 5l3-3 3 3" />
                          <path d="M15 19l3 3 3-3" />
                          <path d="M19 15l3-3-3-3" />
                          <path d="M2 12h20" />
                          <path d="M12 2v20" />
                        </svg>
                        <span className="text-sm">Reposition Camera 2 to face the northeast corner of Office B</span>
                      </li>
                      <li className="flex items-start gap-2">
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
                          className="lucide lucide-replace mt-0.5 text-purple-500"
                        >
                          <path d="M14 4c0-1.1.9-2 2-2" />
                          <path d="M20 2c1.1 0 2 .9 2 2" />
                          <path d="M22 8c0 1.1-.9 2-2 2" />
                          <path d="M16 10c-1.1 0-2-.9-2-2" />
                          <path d="m3 7 3 3 3-3" />
                          <path d="M6 10V5c0-1.7 1.3-3 3-3h1" />
                          <rect width="8" height="8" x="2" y="14" rx="2" />
                        </svg>
                        <span className="text-sm">Upgrade Camera 3 to a wide-angle model with 160° field of view</span>
                      </li>
                    </ul>
                  </div>
                  <div className="pt-4 border-t">
                    <Button className="w-full" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download Full Report
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