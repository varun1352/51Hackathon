import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-violet-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                Visualize Your Space. Optimize Your Security.
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                VU.io transforms video inputs into precise 3D reconstructions, revealing floor coverage and blindspots
                with unmatched accuracy.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/b2b">
                <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                  B2B Solution
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/d2c">
                <Button variant="outline" className="border-violet-200 dark:border-gray-800">
                  D2C Solution
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-[300px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 to-indigo-700 p-2 shadow-2xl sm:h-[400px] lg:h-[500px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* 3D Visualization Art */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 800 600"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Grid Background */}
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                      </pattern>
                      <rect width="800" height="600" fill="url(#grid)" />

                      {/* Floorplan Outline */}
                      <path
                        d="M 200 150 L 600 150 L 600 450 L 200 450 Z"
                        stroke="rgba(255,255,255,0.6)"
                        strokeWidth="3"
                        fill="none"
                      />
                      <path d="M 400 150 L 400 450" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />
                      <path d="M 200 300 L 600 300" stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none" />

                      {/* Camera Positions */}
                      <circle cx="250" cy="200" r="15" fill="rgba(132, 204, 255, 0.8)" />
                      <circle cx="550" cy="200" r="15" fill="rgba(132, 204, 255, 0.8)" />
                      <circle cx="250" cy="400" r="15" fill="rgba(132, 204, 255, 0.8)" />
                      <circle cx="550" cy="400" r="15" fill="rgba(132, 204, 255, 0.8)" />

                      {/* Camera Coverage Areas */}
                      <path d="M 250 200 L 150 100 A 150 150 0 0 1 350 100 Z" fill="rgba(132, 204, 255, 0.2)" />
                      <path d="M 550 200 L 450 100 A 150 150 0 0 0 650 100 Z" fill="rgba(132, 204, 255, 0.2)" />
                      <path d="M 250 400 L 150 500 A 150 150 0 0 0 350 500 Z" fill="rgba(132, 204, 255, 0.2)" />
                      <path d="M 550 400 L 450 500 A 150 150 0 0 1 650 500 Z" fill="rgba(132, 204, 255, 0.2)" />

                      {/* 3D Elements */}
                      <path
                        d="M 200 150 L 150 100 L 550 100 L 600 150"
                        stroke="rgba(255,255,255,0.5)"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="5,5"
                      />
                      <path
                        d="M 600 450 L 650 400 L 650 100 L 600 150"
                        stroke="rgba(255,255,255,0.5)"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="5,5"
                      />

                      {/* Blindspot Highlight */}
                      <circle
                        cx="400"
                        cy="300"
                        r="40"
                        fill="rgba(255, 99, 71, 0.3)"
                        stroke="rgba(255, 99, 71, 0.8)"
                        strokeWidth="2"
                      />

                      {/* Measurement Line */}
                      <line
                        x1="250"
                        y1="350"
                        x2="450"
                        y2="350"
                        stroke="rgba(255, 255, 255, 0.8)"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                      <circle cx="250" cy="350" r="5" fill="white" />
                      <circle cx="450" cy="350" r="5" fill="white" />
                      <text x="350" y="340" fill="white" fontSize="14" textAnchor="middle">
                        4.8m
                      </text>

                      {/* Room Labels */}
                      <text x="300" y="225" fill="white" fontSize="16" textAnchor="middle">
                        Living Room
                      </text>
                      <text x="500" y="225" fill="white" fontSize="16" textAnchor="middle">
                        Kitchen
                      </text>
                      <text x="300" y="375" fill="white" fontSize="16" textAnchor="middle">
                        Bedroom
                      </text>
                      <text x="500" y="375" fill="white" fontSize="16" textAnchor="middle">
                        Office
                      </text>
                    </svg>
                  </div>

                  {/* Animated Elements */}
                  <div
                    className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-blue-400/50 animate-ping"
                    style={{ animationDuration: "3s" }}
                  ></div>
                  <div
                    className="absolute top-1/4 right-1/4 w-8 h-8 rounded-full bg-blue-400/50 animate-ping"
                    style={{ animationDuration: "4s", animationDelay: "1s" }}
                  ></div>
                  <div
                    className="absolute bottom-1/4 left-1/4 w-8 h-8 rounded-full bg-blue-400/50 animate-ping"
                    style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}
                  ></div>
                  <div
                    className="absolute bottom-1/4 right-1/4 w-8 h-8 rounded-full bg-blue-400/50 animate-ping"
                    style={{ animationDuration: "4.5s", animationDelay: "1.5s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

