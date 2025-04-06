import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FAQPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-violet-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                Frequently Asked Questions
              </h1>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Find answers to common questions about our services and solutions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">General Questions</h2>
              <div className="space-y-4">
                {[
                  {
                    question: "What is VU.io?",
                    answer:
                      "VU.io is a cutting-edge platform that transforms video inputs into precise 3D reconstructions, providing detailed spatial analysis for both businesses and individuals. Our technology helps optimize security camera placement for businesses and offers accurate 3D models and measurements for homeowners.",
                  },
                  {
                    question: "How accurate are your 3D reconstructions?",
                    answer:
                      "Our 3D reconstructions achieve millimeter-level accuracy, with typical error margins of ±2-5mm depending on the quality of input video and lighting conditions.",
                  },
                  {
                    question: "What video formats do you support?",
                    answer:
                      "We support most common video formats including MP4, MOV, AVI, and MKV. For optimal results, we recommend 1080p or higher resolution videos with steady camera movement.",
                  },
                  {
                    question: "How long does it take to process a video?",
                    answer:
                      "Processing time depends on video length and complexity. Typically, a 2-minute home video takes 3-5 minutes to process into a complete 3D model and floorplan.",
                  },
                  {
                    question: "Can I export the 3D models to other software?",
                    answer:
                      "Yes, you can export your 3D models in various formats including OBJ, PLY, and GLTF, making them compatible with most 3D modeling and CAD software.",
                  },
                ].map((faq, index) => (
                  <Card key={index} className="border-violet-100 dark:border-violet-900/20">
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500 dark:text-gray-400">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Technical Questions</h2>
              <div className="space-y-4">
                {[
                  {
                    question: "What hardware requirements are needed?",
                    answer:
                      "For capturing video, any modern smartphone or digital camera is sufficient. For viewing 3D models, we recommend a device with a modern web browser and decent graphics capabilities. Our platform is cloud-based, so processing is handled on our servers.",
                  },
                  {
                    question: "How does the 3D reconstruction process work?",
                    answer:
                      "Our system uses advanced computer vision algorithms to analyze video frames, identify key features, track camera movement, and calculate spatial relationships. This creates a dense point cloud that is then transformed into a detailed 3D mesh with accurate textures.",
                  },
                  {
                    question: "Can I use VU.io on mobile devices?",
                    answer:
                      "Yes, our platform is fully responsive and works on mobile devices. You can capture video with your smartphone, upload it to our platform, and view the results directly on your device.",
                  },
                  {
                    question: "Is an internet connection required?",
                    answer:
                      "Yes, an internet connection is required for uploading videos and accessing our cloud-based processing. Once models are generated, they can be downloaded for offline viewing.",
                  },
                  {
                    question: "What lighting conditions are optimal for best results?",
                    answer:
                      "Well-lit environments with consistent lighting produce the best results. Avoid extreme lighting conditions such as direct sunlight causing strong shadows or very dim lighting. Natural, diffused lighting is ideal.",
                  },
                ].map((faq, index) => (
                  <Card key={index} className="border-violet-100 dark:border-violet-900/20">
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500 dark:text-gray-400">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Business & Pricing Questions</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
              {[
                {
                  question: "What pricing plans do you offer?",
                  answer:
                    "We offer a range of pricing plans for both individuals (D2C) and businesses (B2B). Our D2C plans start at $9.99/month, while our B2B plans start at $199/month. Visit our Pricing page for detailed information.",
                },
                {
                  question: "Is there a free trial available?",
                  answer:
                    "Yes, we offer a 14-day free trial for all our D2C plans. For B2B solutions, we provide a free demo and consultation to help you determine the best fit for your organization.",
                },
                {
                  question: "Do you offer custom enterprise solutions?",
                  answer:
                    "We offer tailored enterprise solutions with custom integrations, dedicated support, and specialized features to meet your organization's specific needs. Contact our sales team for more information.",
                },
                {
                  question: "Can I switch between plans?",
                  answer:
                    "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
                },
                {
                  question: "What payment methods do you accept?",
                  answer:
                    "We accept all major credit cards, PayPal, and for enterprise customers, we can arrange invoicing.",
                },
                {
                  question: "Is my data secure?",
                  answer:
                    "We take data security seriously. All uploads are encrypted, and we never share your data with third parties. You retain full ownership of all your content.",
                },
              ].map((faq, index) => (
                <Card key={index} className="border-violet-100 dark:border-violet-900/20">
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 dark:text-gray-400">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

