import AlgorithmSimulator from "@/components/algorithm-simulator"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function LRUPage() {
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
          <h1 className="text-3xl font-bold ml-4 text-spotify-green">LRU Page Replacement Algorithm</h1>
        </div>

        <AlgorithmSimulator
          algorithmType="LRU"
          description="Least Recently Used replaces the page that hasn't been accessed for the longest period of time."
        />

        <div className="mt-12 max-w-4xl mx-auto bg-spotify-darker border-spotify-lighter rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold mb-6 text-spotify-green">How LRU Works</h2>
          <p className="mb-6 text-spotify-textSecondary text-lg leading-relaxed">
            The Least Recently Used (LRU) algorithm is based on the principle of temporal locality - if a page has been
            used recently, it's likely to be used again soon. This algorithm replaces the page that hasn't been accessed
            for the longest period of time.
          </p>
          <div className="p-5 bg-spotify-light rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-3 text-spotify-green">Algorithm Steps</h3>
            <ol className="list-decimal pl-5 space-y-3 text-spotify-textSecondary">
              <li>LRU keeps track of when each page in memory was last accessed.</li>
              <li>
                When a page fault occurs and all frames are full, it replaces the page that hasn't been used for the
                longest time.
              </li>
              <li>Each time a page is accessed, its "last used" timestamp is updated.</li>
              <li>This requires maintaining additional data structures to track page usage history.</li>
            </ol>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="space-y-4">
              <h3 className="text-xl font-medium mb-3 text-spotify-text">Advantages</h3>
              <ul className="list-disc pl-5 space-y-2 text-spotify-textSecondary">
                <li>Exploits temporal locality of reference</li>
                <li>Generally performs better than FIFO in real-world scenarios</li>
                <li>Adapts to changing access patterns</li>
                <li>Does not suffer from Belady's anomaly</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-medium mb-3 text-spotify-text">Disadvantages</h3>
              <ul className="list-disc pl-5 space-y-2 text-spotify-textSecondary">
                <li>More complex to implement than FIFO</li>
                <li>Requires additional overhead to track when each page was last accessed</li>
                <li>Hardware implementation can be expensive (though software implementations are common)</li>
                <li>Still not as effective as the theoretical Optimal algorithm</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-5 bg-spotify-light rounded-lg">
            <h3 className="text-lg font-medium mb-3 text-spotify-green">Implementation Approaches</h3>
            <ul className="list-disc pl-5 space-y-3 text-spotify-textSecondary">
              <li>
                <strong>Counter-based:</strong> Each page has a counter that is updated on access. When a page fault
                occurs, the page with the smallest counter value is replaced.
              </li>
              <li>
                <strong>Stack-based:</strong> Pages are arranged in a stack, with most recently used at the top. When a
                page is accessed, it's moved to the top of the stack.
              </li>
              <li>
                <strong>Matrix-based:</strong> Uses a matrix to track relative recency of page usage, where each element
                represents whether one page was accessed more recently than another.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

