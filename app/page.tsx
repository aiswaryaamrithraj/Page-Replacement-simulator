import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { HardDrive, Clock, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-spotify-dark">
      <div className="container mx-auto px-4 py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-spotify-green">
            Page Replacement Algorithm Simulator
          </h1>
          <p className="text-xl text-spotify-textSecondary max-w-2xl mx-auto">
            Visualize and compare different page replacement algorithms used in operating systems
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <AlgorithmCard
            title="FIFO"
            description="First-In-First-Out replaces the oldest page in memory."
            href="/fifo"
            icon={<HardDrive className="h-12 w-12 text-spotify-green" />}
          />
          <AlgorithmCard
            title="LRU"
            description="Least Recently Used replaces the page that hasn't been used for the longest time."
            href="/lru"
            icon={<Clock className="h-12 w-12 text-spotify-green" />}
          />
          <AlgorithmCard
            title="Optimal"
            description="Replaces the page that will not be used for the longest time in the future."
            href="/optimal"
            icon={<Zap className="h-12 w-12 text-spotify-green" />}
          />
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <Card className="bg-spotify-darker border-spotify-lighter">
            <CardHeader>
              <CardTitle className="text-spotify-text">About Page Replacement Algorithms</CardTitle>
              <CardDescription className="text-spotify-textSecondary">
                How operating systems manage memory efficiently
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-spotify-textSecondary">
              <p>
                Page replacement algorithms are used in operating systems to manage memory by deciding which pages to
                swap in and out when a page fault occurs. These algorithms help improve performance by minimizing page
                faults.
              </p>
              <div className="space-y-2">
                <h3 className="font-semibold text-spotify-text">Key Concepts:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <span className="font-medium text-spotify-text">Page:</span> Fixed-size block of memory
                  </li>
                  <li>
                    <span className="font-medium text-spotify-text">Frame:</span> Physical memory slot that can hold a
                    page
                  </li>
                  <li>
                    <span className="font-medium text-spotify-text">Page Fault:</span> Occurs when a requested page is
                    not in memory
                  </li>
                  <li>
                    <span className="font-medium text-spotify-text">Hit Ratio:</span> Percentage of memory accesses that
                    don't result in page faults
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-spotify-textSecondary">Select an algorithm above to start the simulation</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

function AlgorithmCard({
  title,
  description,
  href,
  icon,
}: { title: string; description: string; href: string; icon: React.ReactNode }) {
  return (
    <Card className="flex flex-col h-full bg-spotify-darker border-spotify-lighter hover:border-spotify-green transition-all duration-300">
      <CardHeader className="flex items-center">
        {icon}
        <CardTitle className="mt-4 text-2xl text-spotify-text">{title}</CardTitle>
        <CardDescription className="text-spotify-textSecondary text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="h-32 bg-spotify-light rounded-md flex items-center justify-center">
          <span className="text-4xl font-bold text-spotify-textSecondary">{title}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href={href} className="w-full">
          <Button className="w-full bg-spotify-green hover:bg-spotify-green/80 text-black">Try {title}</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

