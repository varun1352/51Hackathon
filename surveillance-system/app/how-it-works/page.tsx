import Link from "next/link"
import { ArrowRight, Video, Cpu, Database, Eye, Ruler, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-violet-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                How VU.io Works
              </h1>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Discover the technology behind our advanced 3D reconstruction and security analysis platform
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Overview */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Our Advanced Process</h2>
              <p className="text-gray-500 dark:text-gray-400 md:text-xl/relaxed">
                VU.io uses cutting-edge computer vision and AI algorithms to transform ordinary video footage into
                detailed 3D models with precise spatial analysis.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/b2b/demo">
                  <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                    See it in Action
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-[300px] lg:h-[400px] rounded-xl overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-indigo-700 flex items-center justify-center">
                <div className="grid grid-cols-4 gap-4 p-6 w-full">
                  <div className="col-span-4 text-center text-white font-bold text-xl mb-4">The VU.io Process</div>
                  <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                    <Video className="h-8 w-8 mb-2" />
                    <span className="text-sm font-medium">Video Input</span>
                  </div>
                  <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                    <Cpu className="h-8 w-8 mb-2" />
                    <span className="text-sm font-medium">AI Processing</span>
                  </div>
                  <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                    <Database className="h-8 w-8 mb-2" />
                    <span className="text-sm font-medium">3D Model</span>
                  </div>
                  <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                    <Eye className="h-8 w-8 mb-2" />
                    <span className="text-sm font-medium">Analysis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step by Step Process */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Step-by-Step Process</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                From video capture to detailed analysis, here's how our technology works
              </p>
            </div>
          </div>

          <div className="space-y-20">
            {/* Step 1 */}
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="order-2 lg:order-1 space-y-4">
                <div className="inline-block rounded-lg bg-violet-100 px-3 py-1 text-sm text-violet-700 dark:bg-violet-900/20 dark:text-violet-400">
                  Step 1
                </div>
                <h3 className="text-2xl font-bold tracking-tighter md:text-3xl/tight">Video Capture & Upload</h3>
                <p className="text-gray-500 dark:text-gray-400 md:text-lg/relaxed">
                  Capture video of your space using any standard smartphone or camera. Our system works with a variety
                  of video formats and qualities, though higher resolution footage yields better results. Simply upload
                  your video to our platform to begin the process.
                </p>
                <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Works with standard smartphones
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Supports MP4, MOV, AVI formats
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Simple drag-and-drop upload
                  </li>
                </ul>
              </div>
              <div className="order-1 lg:order-2 relative h-[300px] rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/20 dark:to-indigo-900/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="h-24 w-24 text-violet-500 dark:text-violet-400" />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="relative h-[300px] rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/20 dark:to-indigo-900/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cpu className="h-24 w-24 text-violet-500 dark:text-violet-400" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-violet-100 px-3 py-1 text-sm text-violet-700 dark:bg-violet-900/20 dark:text-violet-400">
                  Step 2
                </div>
                <h3 className="text-2xl font-bold tracking-tighter md:text-3xl/tight">AI-Powered Processing</h3>
                <p className="text-gray-500 dark:text-gray-400 md:text-lg/relaxed">
                  Our advanced AI algorithms analyze your video frame by frame, identifying key features, tracking
                  camera movement, and calculating spatial relationships. This process creates a dense point cloud that
                  forms the foundation of your 3D model.
                </p>
                <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Computer vision algorithms
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Feature detection and matching
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Point cloud generation
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="order-2 lg:order-1 space-y-4">
                <div className="inline-block rounded-lg bg-violet-100 px-3 py-1 text-sm text-violet-700 dark:bg-violet-900/20 dark:text-violet-400">
                  Step 3
                </div>
                <h3 className="text-2xl font-bold tracking-tighter md:text-3xl/tight">3D Model & Floorplan Creation</h3>
                <p className="text-gray-500 dark:text-gray-400 md:text-lg/relaxed">
                  The point cloud is transformed into a detailed 3D mesh with accurate textures. Our system
                  automatically extracts a precise floorplan, identifying walls, doors, and room boundaries. The result
                  is a comprehensive digital twin of your space.
                </p>
                <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Textured 3D mesh generation
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Automatic floorplan extraction
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Room boundary detection
                  </li>
                </ul>
              </div>
              <div className="order-1 lg:order-2 relative h-[300px] rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/20 dark:to-indigo-900/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Database className="h-24 w-24 text-violet-500 dark:text-violet-400" />
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="relative h-[300px] rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/20 dark:to-indigo-900/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Eye className="h-24 w-24 text-violet-500 dark:text-violet-400" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-violet-100 px-3 py-1 text-sm text-violet-700 dark:bg-violet-900/20 dark:text-violet-400">
                  Step 4
                </div>
                <h3 className="text-2xl font-bold tracking-tighter md:text-3xl/tight">Analysis & Optimization</h3>
                <p className="text-gray-500 dark:text-gray-400 md:text-lg/relaxed">
                  For security applications, our system analyzes camera coverage, identifies blindspots, and provides
                  recommendations for optimal camera placement. For home users, we offer precise measurements and
                  spatial analysis tools.
                </p>
                <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Camera coverage visualization
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Blindspot identification
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="mr-2 h-4 w-4 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Optimization recommendations
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Technology Stack</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Powered by cutting-edge technologies and algorithms
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Computer Vision",
                description:
                  "Advanced algorithms for feature detection, tracking, and 3D reconstruction from 2D images.",
                icon: Eye,
              },
              {
                title: "Deep Learning",
                description: "Neural networks trained to recognize objects, spaces, and architectural elements.",
                icon: Cpu,
              },
              {
                title: "Spatial Analysis",
                description: "Algorithms that analyze 3D space to determine coverage areas and identify blindspots.",
                icon: Ruler,
              },
              {
                title: "Real-time Processing",
                description: "Optimized processing pipeline that delivers results in minutes, not hours.",
                icon: Database,
              },
              {
                title: "Cloud Computing",
                description: "Scalable infrastructure that handles complex computations in the cloud.",
                icon: Shield,
              },
              {
                title: "Interactive Visualization",
                description: "Real-time 3D rendering and interactive tools for exploring your space.",
                icon: Video,
              },
            ].map((tech, index) => (
              <Card key={index} className="border-violet-100 dark:border-violet-900/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-violet-100 p-2 dark:bg-violet-900/20">
                      <tech.icon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <CardTitle>{tech.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">{tech.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-violet-600 to-indigo-700">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter text-white md:text-4xl/tight">
                Ready to Experience the Future of Spatial Analysis?
              </h2>
              <p className="max-w-[900px] text-white/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Try our demo or contact us to learn how VU.io can transform your space
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/b2b/demo">
                <Button size="lg" className="bg-white text-violet-700 hover:bg-white/90">
                  Try B2B Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/d2c/demo">
                <Button size="lg" className="bg-white text-violet-700 hover:bg-white/90">
                  Try D2C Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

