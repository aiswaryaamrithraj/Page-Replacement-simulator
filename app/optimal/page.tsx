import AlgorithmSimulator from "@/components/algorithm-simulator"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function OptimalPage() {
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
          <h1 className="text-3xl font-bold ml-4 text-spotify-green">Optimal Page Replacement Algorithm</h1>
        </div>

        <AlgorithmSimulator
          algorithmType="Optimal"
          description="The Optimal algorithm replaces the page that will not be used for the longest time in the future."
        />

        <div className="mt-12 max-w-4xl mx-auto bg-spotify-darker border-spotify-lighter rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold mb-6 text-spotify-green">How Optimal Algorithm Works</h2>
          <p className="mb-6 text-spotify-textSecondary text-lg leading-relaxed">
            The Optimal (or OPT) page replacement algorithm is a theoretical algorithm that produces the lowest possible
            page fault rate for a fixed number of frames. It's also known as the clairvoyant algorithm because it
            requires knowledge of future page references.
          </p>
          <div className="p-5 bg-spotify-light rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-3 text-spotify-green">Algorithm Steps</h3>
            <ol className="list-decimal pl-5 space-y-3 text-spotify-textSecondary">
              <li>When a page fault occurs, it looks at all pages currently in memory.</li>
              <li>For each page, it determines when that page will be referenced next in the future.</li>
              <li>
                It replaces the page that will not be used for the longest time in the future (or will never be used
                again).
              </li>
              <li>
                This requires knowledge of the entire future page reference string, which is typically not available in
                real systems.
              </li>
            </ol>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="space-y-4">
              <h3 className="text-xl font-medium mb-3 text-spotify-text">Advantages</h3>
              <ul className="list-disc pl-5 space-y-2 text-spotify-textSecondary">
                <li>Guarantees the minimum number of page faults</li>
                <li>Provides a benchmark to evaluate other algorithms</li>
                <li>Does not suffer from Belady's anomaly</li>
                <li>Optimal performance under perfect knowledge conditions</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-medium mb-3 text-spotify-text">Disadvantages</h3>
              <ul className="list-disc pl-5 space-y-2 text-spotify-textSecondary">
                <li>Requires knowledge of future page references, which is not available in practice</li>
                <li>Cannot be implemented in real operating systems (except in special cases)</li>
                <li>Primarily used for theoretical analysis and comparison</li>
                <li>Computationally expensive even in simulation environments</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 p-5 bg-spotify-light rounded-lg">
            <h3 className="text-lg font-medium mb-3 text-spotify-green">Practical Applications</h3>
            <p className="mb-4 text-spotify-textSecondary">
              While the Optimal algorithm cannot be directly implemented in general-purpose operating systems, it has
              several practical applications:
            </p>
            <ul className="list-disc pl-5 space-y-3 text-spotify-textSecondary">
              <li>Benchmark for evaluating other page replacement algorithms</li>
              <li>Useful in systems where future access patterns are known (e.g., certain batch processing systems)</li>
              <li>Can be approximated in some cases by analyzing program behavior</li>
              <li>Educational tool for understanding memory management concepts</li>
              <li>Research tool for developing new page replacement algorithms</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

