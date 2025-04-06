import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Building, Camera, Shield, BarChart3, Users } from "lucide-react"

export default function B2BPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Enterprise-Grade Surveillance Coverage Analysis
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Optimize your security camera placement, eliminate blindspots, and enhance overall safety with our
                  advanced B2B solution.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/b2b/demo">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    View Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                  >
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full h-[400px] bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-3/4 h-3/4 border-4 border-white/30 border-dashed rounded-lg flex items-center justify-center">
                    <div className="bg-white/90 dark:bg-gray-900/90 p-4 rounded-lg shadow-lg">
                      <p className="text-sm font-medium text-center">Enterprise Coverage Analysis</p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute top-4 left-4 w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Key Features for Businesses</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Our comprehensive B2B solution offers everything you need to optimize your surveillance system
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "3D Reconstruction",
                description: "Transform your existing CCTV footage into accurate 3D models of your space",
                icon: Building,
              },
              {
                title: "Coverage Analysis",
                description: "Visualize camera coverage areas and identify blindspots with precision",
                icon: Camera,
              },
              {
                title: "Optimization Recommendations",
                description: "Receive AI-powered suggestions for optimal camera placement",
                icon: Shield,
              },
              {
                title: "Real-time Measurement",
                description: "Measure distances and areas directly on your floorplan",
                icon: ArrowRight,
              },
              {
                title: "Multi-floor Support",
                description: "Analyze coverage across multiple floors and buildings",
                icon: BarChart3,
              },
              {
                title: "Compliance Reporting",
                description: "Generate reports to demonstrate security compliance",
                icon: Users,
              },
            ].map((feature, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/20">
                      <feature.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Trusted by Security Professionals
              </h2>
              <p className="text-gray-500 dark:text-gray-400 md:text-xl/relaxed">
                Our platform is used by leading security firms, property managers, and enterprises worldwide to optimize
                their surveillance systems and enhance security.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/case-studies">
                  <Button variant="outline" className="border-blue-600 text-blue-600">
                    View Case Studies
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-center h-24">
                <p className="font-bold text-xl text-gray-400">Client Logo</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-center h-24">
                <p className="font-bold text-xl text-gray-400">Client Logo</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-center h-24">
                <p className="font-bold text-xl text-gray-400">Client Logo</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-center h-24">
                <p className="font-bold text-xl text-gray-400">Client Logo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-600 text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to Optimize Your Security System?
              </h2>
              <p className="max-w-[900px] text-white/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Contact our sales team today for a personalized demo and consultation
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/b2b/demo">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90">
                  View Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Contact Sales
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

