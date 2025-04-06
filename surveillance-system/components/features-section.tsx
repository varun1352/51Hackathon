import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Eye, Ruler, Building, Shield, Zap } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-violet-100 px-3 py-1 text-sm text-violet-700 dark:bg-violet-900 dark:text-violet-300">
              Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Advanced Spatial Intelligence</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Our cutting-edge technology transforms ordinary video inputs into powerful spatial insights
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <Card className="relative overflow-hidden border-violet-100 dark:border-violet-900/50">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-white opacity-50 dark:from-violet-900/20 dark:to-gray-900"></div>
            <CardHeader className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/20">
                <Camera className="h-5 w-5 text-violet-700 dark:text-violet-300" />
              </div>
              <CardTitle className="text-xl">3D Reconstruction</CardTitle>
              <CardDescription>
                Transform video inputs into detailed 3D models with precise spatial mapping
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Our advanced algorithms process video footage to create accurate 3D reconstructions of any space,
                providing a comprehensive digital twin.
              </p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden border-violet-100 dark:border-violet-900/50">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-white opacity-50 dark:from-violet-900/20 dark:to-gray-900"></div>
            <CardHeader className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/20">
                <Eye className="h-5 w-5 text-violet-700 dark:text-violet-300" />
              </div>
              <CardTitle className="text-xl">Coverage Analysis</CardTitle>
              <CardDescription>Identify blindspots and optimize camera placement for maximum security</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Visualize camera coverage with color-coded overlays that instantly reveal blindspots and areas of
                redundant coverage, allowing for optimal security setup.
              </p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden border-violet-100 dark:border-violet-900/50">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-white opacity-50 dark:from-violet-900/20 dark:to-gray-900"></div>
            <CardHeader className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/20">
                <Building className="h-5 w-5 text-violet-700 dark:text-violet-300" />
              </div>
              <CardTitle className="text-xl">Floorplan Extraction</CardTitle>
              <CardDescription>Automatically generate accurate floorplans from 3D reconstructions</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Our system extracts precise 2D floorplans from 3D models, providing clear visualization of your space's
                layout with walls, doors, and key features.
              </p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden border-violet-100 dark:border-violet-900/50">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-white opacity-50 dark:from-violet-900/20 dark:to-gray-900"></div>
            <CardHeader className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/20">
                <Ruler className="h-5 w-5 text-violet-700 dark:text-violet-300" />
              </div>
              <CardTitle className="text-xl">Measurement Tools</CardTitle>
              <CardDescription>Measure distances and areas with precision in real-time</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Interactive measurement tools allow you to calculate distances between any two points on your floorplan
                with real-world accuracy.
              </p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden border-violet-100 dark:border-violet-900/50">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-white opacity-50 dark:from-violet-900/20 dark:to-gray-900"></div>
            <CardHeader className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/20">
                <Shield className="h-5 w-5 text-violet-700 dark:text-violet-300" />
              </div>
              <CardTitle className="text-xl">Security Optimization</CardTitle>
              <CardDescription>AI-powered recommendations for enhanced security coverage</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Receive intelligent suggestions for camera placement, angle adjustments, and additional security
                measures to eliminate blindspots and vulnerabilities.
              </p>
            </CardContent>
          </Card>
          <Card className="relative overflow-hidden border-violet-100 dark:border-violet-900/50">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-white opacity-50 dark:from-violet-900/20 dark:to-gray-900"></div>
            <CardHeader className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/20">
                <Zap className="h-5 w-5 text-violet-700 dark:text-violet-300" />
              </div>
              <CardTitle className="text-xl">Real-time Updates</CardTitle>
              <CardDescription>Dynamic analysis that adapts to changes in your environment</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Our system continuously updates coverage analysis as cameras are adjusted or added, providing real-time
                feedback on security improvements.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

