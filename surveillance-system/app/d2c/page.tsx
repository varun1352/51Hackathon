import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Home, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function D2CPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                  D2C Solution
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Transform Your Home Videos into 3D Models
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Create accurate 3D reconstructions and floorplans from your home videos with our easy-to-use platform.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/d2c/demo">
                  <Button size="lg" className="gap-1">
                    View Demo
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="lg" variant="outline" className="gap-1">
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative lg:h-[500px] h-[300px]">
              <Image
                src="/placeholder.svg?height=500&width=500"
                alt="3D Home Reconstruction"
                fill
                className="object-cover rounded-lg shadow-xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Powerful Home Visualization Tools
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Our D2C platform offers intuitive tools for homeowners and renters
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="flex flex-col p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Home className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                <h3 className="text-2xl font-bold">3D Reconstruction</h3>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Transform your home videos into detailed 3D models with our advanced AI.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Simple video upload process</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Automatic 3D model generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>High-fidelity texture mapping</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Home className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                <h3 className="text-2xl font-bold">Floorplan Extraction</h3>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Automatically generate accurate floorplans from your 3D models.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Precise wall and room detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Automatic room labeling</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Export in multiple formats</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Home className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                <h3 className="text-2xl font-bold">Measurement Tools</h3>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Measure any space in your home with precision using our interactive tools.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Point-to-point measurements</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Area calculations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Save and share measurements</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                How People Use Our Platform
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Discover the many ways our customers use our 3D reconstruction technology
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h3 className="text-2xl font-bold mb-4">Home Renovation Planning</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Plan your renovation projects with precision by creating accurate 3D models and measurements of your
                existing space.
              </p>
              <div className="relative h-[200px] mb-4 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=200&width=400"
                  alt="Home renovation planning"
                  fill
                  className="object-cover"
                />
              </div>
              <Link
                href="/testimonials/renovation"
                className="text-blue-600 dark:text-blue-400 hover:underline mt-auto"
              >
                Read Customer Story →
              </Link>
            </div>
            <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h3 className="text-2xl font-bold mb-4">Furniture Shopping</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Take accurate measurements of your rooms to ensure new furniture fits perfectly before you buy.
              </p>
              <div className="relative h-[200px] mb-4 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=200&width=400"
                  alt="Furniture shopping"
                  fill
                  className="object-cover"
                />
              </div>
              <Link href="/testimonials/furniture" className="text-blue-600 dark:text-blue-400 hover:underline mt-auto">
                Read Customer Story →
              </Link>
            </div>
            <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h3 className="text-2xl font-bold mb-4">Real Estate Listings</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Create immersive 3D tours and accurate floorplans of your property to enhance your real estate listings.
              </p>
              <div className="relative h-[200px] mb-4 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=200&width=400"
                  alt="Real estate listings"
                  fill
                  className="object-cover"
                />
              </div>
              <Link
                href="/testimonials/realestate"
                className="text-blue-600 dark:text-blue-400 hover:underline mt-auto"
              >
                Read Customer Story →
              </Link>
            </div>
            <div className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h3 className="text-2xl font-bold mb-4">Home Security Planning</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Optimize your home security camera placement by visualizing coverage and identifying potential
                blindspots.
              </p>
              <div className="relative h-[200px] mb-4 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=200&width=400"
                  alt="Home security planning"
                  fill
                  className="object-cover"
                />
              </div>
              <Link href="/testimonials/security" className="text-blue-600 dark:text-blue-400 hover:underline mt-auto">
                Read Customer Story →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Creating your 3D home model is simple with our easy-to-use platform
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow">
              <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-4 mb-4 flex items-center justify-center w-12 h-12">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Record</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Record a video of your space using your smartphone or camera.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow">
              <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-4 mb-4 flex items-center justify-center w-12 h-12">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Upload</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Upload your video to our platform with a few simple clicks.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow">
              <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-4 mb-4 flex items-center justify-center w-12 h-12">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Process</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Our AI processes your video and generates a 3D model and floorplan.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow">
              <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-4 mb-4 flex items-center justify-center w-12 h-12">
                <span className="text-xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Explore</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Explore your 3D model, take measurements, and share with others.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Transform Your Home Videos?
              </h2>
              <p className="max-w-[600px] text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Get started today and create your first 3D model in minutes.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/d2c/demo">
                <Button size="lg" className="gap-1">
                  View Demo
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline" className="gap-1">
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

