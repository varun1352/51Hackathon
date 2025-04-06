import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge className="bg-blue-500">About Us</Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Mission & Vision</h1>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                We're revolutionizing spatial analysis through advanced computer vision and 3D reconstruction
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Our Story</h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Founded in 2022, SurveillanceAI began with a simple observation: traditional surveillance systems
                  often have significant blindspots that compromise security. Our team of computer vision experts and
                  security professionals came together to solve this problem using cutting-edge 3D reconstruction
                  technology.
                </p>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  What started as a research project quickly evolved into a comprehensive solution for both businesses
                  and individuals. Today, we're proud to offer state-of-the-art coverage analysis and floorplan
                  measurement tools that help our clients optimize their spaces and enhance security.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[400px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-xl font-bold">Our Journey</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Meet Our Team</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                The brilliant minds behind our innovative technology
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Dr. Sarah Chen",
                role: "Founder & CEO",
                bio: "Computer Vision PhD with 15+ years of experience in 3D reconstruction",
              },
              {
                name: "Michael Rodriguez",
                role: "CTO",
                bio: "Former Google engineer specializing in spatial computing and AI",
              },
              {
                name: "Aisha Patel",
                role: "Head of Product",
                bio: "Security industry veteran with expertise in surveillance systems",
              },
              {
                name: "David Kim",
                role: "Lead Engineer",
                bio: "Specialized in real-time 3D rendering and spatial analysis",
              },
              {
                name: "Emma Wilson",
                role: "UX Director",
                bio: "Creating intuitive interfaces for complex technical products",
              },
              {
                name: "James Thompson",
                role: "Business Development",
                bio: "Building partnerships with security firms and property developers",
              },
            ].map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800"></div>
                <CardContent className="p-4">
                  <h3 className="font-bold">{member.name}</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">{member.role}</p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Our Values</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                The principles that guide our work and innovation
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Innovation",
                description:
                  "We constantly push the boundaries of what's possible in spatial analysis and 3D reconstruction",
              },
              {
                title: "Precision",
                description: "We're committed to delivering the most accurate measurements and coverage analysis",
              },
              {
                title: "Security",
                description: "We believe everyone deserves to feel safe in their spaces, whether home or business",
              },
              {
                title: "Accessibility",
                description: "We make advanced technology accessible to both enterprises and individuals",
              },
              {
                title: "Privacy",
                description: "We respect user data and maintain the highest standards of privacy protection",
              },
              {
                title: "Customer Success",
                description: "We measure our success by the positive impact we have on our customers' security",
              },
            ].map((value, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">{value.title}</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

