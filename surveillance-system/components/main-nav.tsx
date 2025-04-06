import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
              VU.io
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/b2b" className="transition-colors hover:text-foreground/80">
              B2B Solution
            </Link>
            <Link href="/d2c" className="transition-colors hover:text-foreground/80">
              D2C Solution
            </Link>
            <Link href="/how-it-works" className="transition-colors hover:text-foreground/80">
              How It Works
            </Link>
            <Link href="/pricing" className="transition-colors hover:text-foreground/80">
              Pricing
            </Link>
            <Link href="/about" className="transition-colors hover:text-foreground/80">
              About
            </Link>
            <Link href="/contact" className="transition-colors hover:text-foreground/80">
              Contact
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <Link href="/login">
              <Button variant="outline" size="sm" className="hidden md:flex">
                Log in
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="hidden md:flex bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                Sign up
              </Button>
            </Link>
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="grid gap-6 text-lg font-medium">
                <Link href="/" className="hover:text-foreground/80">
                  Home
                </Link>
                <Link href="/b2b" className="hover:text-foreground/80">
                  B2B Solution
                </Link>
                <Link href="/d2c" className="hover:text-foreground/80">
                  D2C Solution
                </Link>
                <Link href="/how-it-works" className="hover:text-foreground/80">
                  How It Works
                </Link>
                <Link href="/pricing" className="hover:text-foreground/80">
                  Pricing
                </Link>
                <Link href="/about" className="hover:text-foreground/80">
                  About
                </Link>
                <Link href="/contact" className="hover:text-foreground/80">
                  Contact
                </Link>
                <Link href="/login" className="hover:text-foreground/80">
                  Log in
                </Link>
                <Link href="/login" className="hover:text-foreground/80">
                  Sign up
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

