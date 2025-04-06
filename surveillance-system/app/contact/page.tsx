"use client"

import { useState } from "react"
import { Mail, MapPin, Phone, Send, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate form submission
    setTimeout(() => {
      setFormSubmitted(true)
    }, 1000)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-violet-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                Get in Touch
              </h1>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                We'd love to hear from you. Reach out to our team for any questions, support, or partnership
                opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-start">
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                  Let's Discuss Your Project
                </h2>
                <p className="text-gray-500 dark:text-gray-400 md:text-xl/relaxed">
                  Fill out the form and our team will get back to you within 24 hours.
                </p>
              </div>

              <Tabs defaultValue="sales" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="sales">Sales</TabsTrigger>
                  <TabsTrigger value="support">Support</TabsTrigger>
                  <TabsTrigger value="careers">Careers</TabsTrigger>
                </TabsList>
                <TabsContent value="sales" className="space-y-4 mt-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-violet-100 p-2 dark:bg-violet-900/20">
                      <Mail className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">sales@vu.io</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-violet-100 p-2 dark:bg-violet-900/20">
                      <Phone className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">+1 (212) 998-1212</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="support" className="space-y-4 mt-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-violet-100 p-2 dark:bg-violet-900/20">
                      <Mail className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">support@vu.io</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-violet-100 p-2 dark:bg-violet-900/20">
                      <Phone className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">+1 (212) 998-1313</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="careers" className="space-y-4 mt-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-violet-100 p-2 dark:bg-violet-900/20">
                      <Mail className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">careers@vu.io</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-violet-100 p-2 dark:bg-violet-900/20">
                      <Phone className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">+1 (212) 998-1414</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-violet-100 p-2 dark:bg-violet-900/20">
                  <MapPin className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <h3 className="font-medium">Office</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    60 Washington Square South
                    <br />
                    New York, NY 10012
                    <br />
                    New York University
                  </p>
                </div>
              </div>

              <div className="relative h-[300px] rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.3834973114986!2d-73.99967812346177!3d40.72951623818846!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2599af55395c1%3A0xda30743171b5f305!2sNew%20York%20University!5e0!3m2!1sen!2sus!4v1712293462051!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
            <div>
              <Card className="border-violet-100 dark:border-violet-900/20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-white opacity-50 dark:from-violet-900/20 dark:to-gray-900 -z-10"></div>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Contact Form</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {formSubmitted ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
                      <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-xl font-bold">Message Sent!</h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-md">
                        Thank you for reaching out. Our team will get back to you within 24 hours.
                      </p>
                      <Button variant="outline" onClick={() => setFormSubmitted(false)} className="mt-4">
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="first-name" className="text-sm font-medium">
                            First name
                          </label>
                          <Input id="first-name" placeholder="John" required />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="last-name" className="text-sm font-medium">
                            Last name
                          </label>
                          <Input id="last-name" placeholder="Doe" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <Input id="email" type="email" placeholder="john.doe@example.com" required />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">
                          Phone
                        </label>
                        <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="company" className="text-sm font-medium">
                          Company
                        </label>
                        <Input id="company" placeholder="Acme Inc." />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="interest" className="text-sm font-medium">
                          I'm interested in
                        </label>
                        <select
                          id="interest"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          required
                        >
                          <option value="">Select an option</option>
                          <option value="b2b">B2B Solution</option>
                          <option value="d2c">D2C Solution</option>
                          <option value="custom">Custom Solution</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">
                          Message
                        </label>
                        <Textarea
                          id="message"
                          placeholder="Tell us about your project..."
                          className="min-h-[120px]"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                      >
                        Send Message
                        <Send className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
                Frequently Asked Questions
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Find answers to common questions about our services and solutions
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2">
            {[
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
              {
                question: "Do you offer custom enterprise solutions?",
                answer:
                  "We offer tailored enterprise solutions with custom integrations, dedicated support, and specialized features to meet your organization's specific needs.",
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
      </section>
    </div>
  )
}

