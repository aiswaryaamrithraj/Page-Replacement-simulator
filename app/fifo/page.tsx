import AlgorithmSimulator from "@/components/algorithm-simulator"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function FIFOPage() {
  return (
    <div className="min-h-screen bg-spotify-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-spotify-text hover:text-spotify-green">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold ml-4 text-spotify-green">FIFO Page Replacement Algorithm</h1>
        </div>

        <AlgorithmSimulator
          algorithmType="FIFO"
          description="First-In-First-Out replaces the oldest page in memory, regardless of how frequently it's used."
        />

        <div className="mt-12 max-w-4xl mx-auto bg-spotify-darker border-spotify-lighter rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold mb-6 text-spotify-green">How FIFO Works</h2>
          <p className="mb-6 text-spotify-textSecondary text-lg leading-relaxed">
            The First-In-First-Out (FIFO) algorithm is one of the simplest page replacement algorithms. It works exactly
            as its name suggests - the first page that was brought into memory will be the first one to be replaced when
            a page fault occurs.
          </p>
          <div className="p-5 bg-spotify-light rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-3 text-spotify-green">Algorithm Steps</h3>
            <ol className="list-decimal pl-5 space-y-3 text-spotify-textSecondary">
              <li>
                When a page needs to be replaced, FIFO selects the page that has been in memory the longest (the first
                page that was brought into memory).
              </li>
              <li>It maintains a queue of pages, with the oldest page at the front of the queue.</li>
              <li>
                When a page fault occurs and all frames are full, the page at the front of the queue is removed (the
                oldest page), and the new page is added to the back of the queue.
              </li>
            </ol>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="space-y-4">
              <h3 className="text-xl font-medium mb-3 text-spotify-text">Advantages</h3>
              <ul className="list-disc pl-5 space-y-2 text-spotify-textSecondary">
                <li>Simple to understand and implement</li>
                <li>Low overhead - only requires a queue data structure</li>
                <li>No additional bookkeeping needed beyond tracking order of arrival</li>
                <li>Predictable behavior - easy to analyze and reason about</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-medium mb-3 text-spotify-text">Disadvantages</h3>
              <ul className="list-disc pl-5 space-y-2 text-spotify-textSecondary">
                <li>Does not consider the frequency of page usage</li>
                <li>May remove frequently used pages just because they are old</li>
                <li>Often performs worse than more sophisticated algorithms like LRU or Optimal</li>
                <li>
                  Can suffer from "Belady's anomaly" - increasing the number of frames can sometimes increase the number
                  of page faults
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

