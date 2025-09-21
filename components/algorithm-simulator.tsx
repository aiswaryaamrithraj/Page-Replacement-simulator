"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlayIcon, PauseIcon, StepForwardIcon, RotateCcwIcon, Settings2Icon, CheckCircle, XCircle } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Slider } from "@/components/ui/slider"

type AlgorithmType = "FIFO" | "LRU" | "Optimal"

interface SimulationStep {
  reference: number
  frames: (number | null)[]
  isHit: boolean
  replaced?: number | null
  details?: string
}

interface AlgorithmSimulatorProps {
  algorithmType: AlgorithmType
  description: string
}

export default function AlgorithmSimulator({ algorithmType, description }: AlgorithmSimulatorProps) {
  const [referenceString, setReferenceString] = useState<string>("7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1")
  const [frameCount, setFrameCount] = useState<number>(3)
  const [parsedReferenceString, setParsedReferenceString] = useState<number[]>([])
  const [currentStep, setCurrentStep] = useState<number>(-1)
  const [simulationSteps, setSimulationSteps] = useState<SimulationStep[]>([])
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)
  const [showDetails, setShowDetails] = useState<boolean>(true)
  const [animateNewFrame, setAnimateNewFrame] = useState<boolean>(false)
  const { toast } = useToast()
  const [currentStats, setCurrentStats] = useState<{ hits: number; misses: number }>({ hits: 0, misses: 0 })

  // Parse reference string when it changes
  useEffect(() => {
    try {
      const parsed = referenceString
        .split(/[,\s]+/)
        .filter((s) => s.trim() !== "")
        .map((s) => Number.parseInt(s.trim(), 10))

      if (parsed.some(isNaN)) {
        throw new Error("Invalid reference string")
      }

      setParsedReferenceString(parsed)
    } catch (error) {
      setParsedReferenceString([])
    }
  }, [referenceString])

  // Run simulation when reference string or frame count changes
  useEffect(() => {
    if (parsedReferenceString.length > 0) {
      runSimulation()
    }
  }, [parsedReferenceString, frameCount, algorithmType])

  // Handle auto-play
  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isPlaying && currentStep < simulationSteps.length - 1) {
      intervalId = setInterval(() => {
        setCurrentStep((prev) => {
          const next = prev + 1
          if (next >= simulationSteps.length - 1) {
            setIsPlaying(false)
            return simulationSteps.length - 1
          }
          return next
        })
      }, 1000 / playbackSpeed)
    }

    return () => clearInterval(intervalId)
  }, [isPlaying, currentStep, simulationSteps.length, playbackSpeed])

  // Show toast notification when step changes
  useEffect(() => {
    if (currentStep >= 0 && currentStep < simulationSteps.length) {
      const step = simulationSteps[currentStep]
      setAnimateNewFrame(true)

      // Show toast notification only for hits
      if (step.isHit) {
        toast({
          title: "Hit!",
          description: `Page ${step.reference} was found in memory.`,
          variant: "default",
        })
      }

      // Reset animation flag after a short delay
      const timer = setTimeout(() => {
        setAnimateNewFrame(false)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [currentStep, simulationSteps, toast])

  // Add this effect to update stats incrementally
  useEffect(() => {
    if (currentStep >= 0 && currentStep < simulationSteps.length) {
      const step = simulationSteps[currentStep]
      if (step.isHit) {
        setCurrentStats((prev) => ({ ...prev, hits: prev.hits + 1 }))
      } else {
        setCurrentStats((prev) => ({ ...prev, misses: prev.misses + 1 }))
      }
    }
  }, [currentStep, simulationSteps])

  const runSimulation = () => {
    if (parsedReferenceString.length === 0 || frameCount <= 0) return

    let steps: SimulationStep[] = []

    if (algorithmType === "FIFO") {
      steps = simulateFIFO(parsedReferenceString, frameCount)
    } else if (algorithmType === "LRU") {
      steps = simulateLRU(parsedReferenceString, frameCount)
    } else if (algorithmType === "Optimal") {
      steps = simulateOptimal(parsedReferenceString, frameCount)
    }

    setSimulationSteps(steps)
    setCurrentStep(-1)
    setIsPlaying(false)
    setCurrentStats({ hits: 0, misses: 0 })
  }

  const simulateFIFO = (references: number[], frames: number): SimulationStep[] => {
    const steps: SimulationStep[] = []
    const memory: (number | null)[] = Array(frames).fill(null)
    let insertPosition = 0

    for (let i = 0; i < references.length; i++) {
      const page = references[i]
      const currentMemory = [...memory]
      const isHit = currentMemory.includes(page)
      let replaced: number | null = null
      let details = ""

      if (!isHit) {
        replaced = memory[insertPosition]
        details = `Page fault! Replacing frame ${insertPosition} (${replaced !== null ? replaced : "empty"}) with page ${page}`
        memory[insertPosition] = page
        insertPosition = (insertPosition + 1) % frames
      } else {
        details = `Page hit! Page ${page} is already in memory`
      }

      steps.push({
        reference: page,
        frames: [...memory],
        isHit,
        replaced,
        details,
      })
    }

    return steps
  }

  const simulateLRU = (references: number[], frames: number): SimulationStep[] => {
    const steps: SimulationStep[] = []
    const memory: (number | null)[] = Array(frames).fill(null)
    const lastUsed: Map<number, number> = new Map()

    for (let i = 0; i < references.length; i++) {
      const page = references[i]
      const currentMemory = [...memory]
      const isHit = currentMemory.includes(page)
      let replaced: number | null = null
      let details = ""

      // Update last used time for this page
      lastUsed.set(page, i)

      if (!isHit) {
        // Find the least recently used page
        if (!memory.includes(null)) {
          let lruPage = memory[0]!
          let lruIndex = 0
          let lruTime = lastUsed.get(lruPage) || 0

          for (let j = 1; j < memory.length; j++) {
            const pageInMemory = memory[j]!
            const pageTime = lastUsed.get(pageInMemory) || 0

            if (pageTime < lruTime) {
              lruTime = pageTime
              lruPage = pageInMemory
              lruIndex = j
            }
          }

          replaced = memory[lruIndex]
          details = `Page fault! Replacing least recently used page ${replaced} in frame ${lruIndex} with page ${page}`
          memory[lruIndex] = page
        } else {
          // Find the first empty slot
          const emptyIndex = memory.indexOf(null)
          details = `Page fault! Placing page ${page} in empty frame ${emptyIndex}`
          memory[emptyIndex] = page
        }
      } else {
        details = `Page hit! Page ${page} is already in memory`
      }

      steps.push({
        reference: page,
        frames: [...memory],
        isHit,
        replaced,
        details,
      })
    }

    return steps
  }

  const simulateOptimal = (references: number[], frames: number): SimulationStep[] => {
    const steps: SimulationStep[] = []
    const memory: (number | null)[] = Array(frames).fill(null)

    for (let i = 0; i < references.length; i++) {
      const page = references[i]
      const currentMemory = [...memory]
      const isHit = currentMemory.includes(page)
      let replaced: number | null = null
      let details = ""

      if (!isHit) {
        if (!memory.includes(null)) {
          // Find the page that won't be used for the longest time
          const nextUse: Map<number, number> = new Map()

          // For each page in memory, find when it will be used next
          for (const pageInMemory of memory) {
            if (pageInMemory === null) continue

            let nextUseIndex = references.indexOf(pageInMemory, i + 1)
            if (nextUseIndex === -1) {
              // Page won't be used again, set to infinity (represented by a very large number)
              nextUseIndex = Number.MAX_SAFE_INTEGER
            }
            nextUse.set(pageInMemory, nextUseIndex)
          }

          // Find the page with the furthest next use
          let furthestPage = memory[0]!
          let furthestIndex = 0
          let furthestUse = nextUse.get(furthestPage) || 0

          for (let j = 1; j < memory.length; j++) {
            const pageInMemory = memory[j]!
            const pageNextUse = nextUse.get(pageInMemory) || 0

            if (pageNextUse > furthestUse) {
              furthestUse = pageNextUse
              furthestPage = pageInMemory
              furthestIndex = j
            }
          }

          replaced = memory[furthestIndex]
          details = `Page fault! Replacing page ${replaced} in frame ${furthestIndex} with page ${page} (optimal choice)`
          memory[furthestIndex] = page
        } else {
          // Find the first empty slot
          const emptyIndex = memory.indexOf(null)
          details = `Page fault! Placing page ${page} in empty frame ${emptyIndex}`
          memory[emptyIndex] = page
        }
      } else {
        details = `Page hit! Page ${page} is already in memory`
      }

      steps.push({
        reference: page,
        frames: [...memory],
        isHit,
        replaced,
        details,
      })
    }

    return steps
  }

  const resetSimulation = () => {
    setCurrentStep(-1)
    setIsPlaying(false)
    setCurrentStats({ hits: 0, misses: 0 })
  }

  const togglePlayPause = () => {
    if (currentStep >= simulationSteps.length - 1) {
      // If at the end, restart
      setCurrentStep(0)
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const stepForward = () => {
    if (currentStep < simulationSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Calculate statistics
  const hits = simulationSteps.filter((step) => step.isHit).length
  const misses = simulationSteps.length - hits
  const hitRatio = simulationSteps.length > 0 ? (hits / simulationSteps.length) * 100 : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8 bg-spotify-darker border-spotify-lighter">
        <CardHeader>
          <CardTitle className="text-spotify-green">{algorithmType} Page Replacement Algorithm</CardTitle>
          <CardDescription className="text-spotify-textSecondary text-base">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-spotify-light rounded-md mb-6">
            <h3 className="text-lg font-medium text-spotify-green mb-2">Algorithm Description</h3>
            <p className="text-spotify-textSecondary">
              {algorithmType === "FIFO" &&
                "First-In-First-Out (FIFO) is the simplest page replacement algorithm. It replaces the oldest page in memory when a page fault occurs. FIFO maintains a queue of pages, with the oldest page at the front of the queue. When a page fault occurs and all frames are full, the page at the front of the queue is removed, and the new page is added to the back of the queue."}
              {algorithmType === "LRU" &&
                "Least Recently Used (LRU) replaces the page that hasn't been used for the longest time. It's based on the principle of temporal locality - if a page has been used recently, it's likely to be used again soon. LRU keeps track of when each page was last accessed and replaces the one that hasn't been used for the longest period when a page fault occurs."}
              {algorithmType === "Optimal" &&
                "The Optimal algorithm (also called OPT or MIN) replaces the page that will not be used for the longest time in the future. This requires knowledge of future page references, which is typically not available in real systems. It serves as a theoretical upper bound on the performance of any page replacement algorithm and guarantees the minimum number of page faults."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="referenceString" className="text-spotify-text">
                Reference String
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="referenceString"
                  value={referenceString}
                  onChange={(e) => setReferenceString(e.target.value)}
                  placeholder="e.g., 7,0,1,2,0,3,0,4,2,3"
                  className="bg-spotify-light border-spotify-lighter text-spotify-text focus:border-spotify-green"
                />
                <Button
                  variant="outline"
                  onClick={runSimulation}
                  className="border-spotify-green text-spotify-green hover:bg-spotify-green hover:text-black"
                >
                  Apply
                </Button>
              </div>
              <p className="text-sm text-spotify-textSecondary mt-1">Enter page numbers separated by commas</p>
            </div>
            <div>
              <Label htmlFor="frameCount" className="text-spotify-text">
                Number of Frames
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="frameCount"
                  type="number"
                  min={1}
                  max={10}
                  value={frameCount}
                  onChange={(e) => setFrameCount(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                  className="bg-spotify-light border-spotify-lighter text-spotify-text focus:border-spotify-green"
                />
                <Button
                  variant="outline"
                  onClick={runSimulation}
                  className="border-spotify-green text-spotify-green hover:bg-spotify-green hover:text-black"
                >
                  Apply
                </Button>
              </div>
              <p className="text-sm text-spotify-textSecondary mt-1">Enter a value between 1 and 10</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-spotify-darker border-spotify-lighter">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-spotify-text">Simulation</CardTitle>
              <CardDescription className="text-spotify-textSecondary">
                Step {currentStep + 1} of {simulationSteps.length}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-spotify-lighter text-spotify-text hover:bg-spotify-light"
                  >
                    <Settings2Icon className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-spotify-darker border-spotify-lighter">
                  <SheetHeader>
                    <SheetTitle className="text-spotify-text">Simulation Settings</SheetTitle>
                    <SheetDescription className="text-spotify-textSecondary">
                      Customize how the simulation runs and displays
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="playbackSpeed" className="text-spotify-text">
                        Playback Speed: {playbackSpeed}x
                      </Label>
                      <Slider
                        id="playbackSpeed"
                        min={0.5}
                        max={3}
                        step={0.5}
                        value={[playbackSpeed]}
                        onValueChange={(value) => setPlaybackSpeed(value[0])}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showDetails" className="text-spotify-text">
                        Show Details
                      </Label>
                      <Switch id="showDetails" checked={showDetails} onCheckedChange={setShowDetails} />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <Button
                variant="outline"
                size="icon"
                onClick={resetSimulation}
                className="border-spotify-lighter text-spotify-text hover:bg-spotify-light"
              >
                <RotateCcwIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={togglePlayPause}
                className="border-spotify-lighter text-spotify-text hover:bg-spotify-light"
              >
                {isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={stepForward}
                className="border-spotify-lighter text-spotify-text hover:bg-spotify-light"
              >
                <StepForwardIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {simulationSteps.length > 0 && currentStep >= 0 ? (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {parsedReferenceString.map((page, index) => (
                    <div
                      key={index}
                      className={`
                        w-10 h-10 flex items-center justify-center rounded-md border
                        ${index === currentStep ? "bg-spotify-green text-black border-spotify-green" : "bg-spotify-light border-spotify-lighter text-spotify-text"}
                        ${index < currentStep ? "opacity-50" : ""}
                      `}
                    >
                      {page}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-spotify-text">
                    Current Reference: {simulationSteps[currentStep].reference}
                  </h3>

                  {/* Stack visualization */}
                  <div className="stack-container flex flex-col-reverse items-center gap-2 mt-4">
                    {simulationSteps[currentStep].frames.map((frame, index) => (
                      <div
                        key={index}
                        className={`
                          stack-item w-full p-4 rounded-lg border-2 flex items-center justify-between
                          ${animateNewFrame && frame === simulationSteps[currentStep].reference && !simulationSteps[currentStep].isHit ? "stack-item-new" : ""}
                          ${frame === simulationSteps[currentStep].reference && simulationSteps[currentStep].isHit ? "hit-notification" : ""}
                          ${
                            frame === simulationSteps[currentStep].reference
                              ? "border-spotify-green bg-spotify-green/20"
                              : "border-spotify-lighter bg-spotify-light"
                          }
                          ${frame === simulationSteps[currentStep].replaced ? "border-red-500 bg-red-500/20" : ""}
                        `}
                      >
                        <div className="flex items-center">
                          <span className="text-xs text-spotify-textSecondary mr-3">Frame {index}</span>
                          <span className="text-2xl font-bold text-spotify-text">{frame !== null ? frame : "-"}</span>
                        </div>

                        {frame === simulationSteps[currentStep].reference && (
                          <div className="flex items-center">
                            {simulationSteps[currentStep].isHit ? (
                              <div className="flex items-center text-spotify-green">
                                <CheckCircle className="h-5 w-5 mr-1" />
                                <span className="text-sm font-medium">HIT</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-red-500">
                                <XCircle className="h-5 w-5 mr-1" />
                                <span className="text-sm font-medium">MISS</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {showDetails && (
                  <div className="mt-4 p-3 bg-spotify-light rounded-md animate-fade-in">
                    <h4 className="text-sm font-medium text-spotify-text mb-1">Step Details</h4>
                    <p className="text-sm text-spotify-textSecondary">
                      {simulationSteps[currentStep].isHit ? (
                        <span className="text-spotify-green font-medium">HIT:</span>
                      ) : (
                        <span className="text-red-500 font-medium">PAGE FAULT:</span>
                      )}{" "}
                      {simulationSteps[currentStep].details}
                    </p>
                    <div className="mt-2 pt-2 border-t border-spotify-lighter">
                      <p className="text-xs text-spotify-textSecondary">
                        Current statistics: {currentStats.hits} hits, {currentStats.misses} page faults
                        {currentStep > 0 &&
                          ` (Page fault ratio: ${((currentStats.misses / (currentStep + 1)) * 100).toFixed(2)}%)`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-spotify-textSecondary mb-4">
                  {simulationSteps.length === 0
                    ? "Enter a reference string and click Apply to start the simulation"
                    : "Click the play button or step forward to start the simulation"}
                </p>
                {simulationSteps.length > 0 && (
                  <Button
                    onClick={() => setCurrentStep(0)}
                    className="bg-spotify-green hover:bg-spotify-green/80 text-black"
                  >
                    Start Simulation
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-spotify-darker border-spotify-lighter">
          <CardHeader>
            <CardTitle className="text-spotify-text">Statistics</CardTitle>
            <CardDescription className="text-spotify-textSecondary">Performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary">
              <TabsList className="w-full bg-spotify-light">
                <TabsTrigger
                  value="summary"
                  className="flex-1 data-[state=active]:bg-spotify-green data-[state=active]:text-black"
                >
                  Summary
                </TabsTrigger>
                <TabsTrigger
                  value="chart"
                  className="flex-1 data-[state=active]:bg-spotify-green data-[state=active]:text-black"
                >
                  Chart
                </TabsTrigger>
              </TabsList>
              <TabsContent value="summary" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <StatCard title="Hits" value={currentStats.hits} color="green" />
                  <StatCard title="Page Faults" value={currentStats.misses} color="red" />
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-spotify-text mb-2">Page Fault Ratio</h3>
                  <div className="h-6 w-full bg-spotify-light rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full transition-all duration-500"
                      style={{ width: `${currentStep > 0 ? (currentStats.misses / (currentStep + 1)) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-sm text-spotify-textSecondary">
                    <span>{currentStep > 0 ? ((currentStats.misses / (currentStep + 1)) * 100).toFixed(2) : 0}%</span>
                    <span>Total Page Faults: {currentStats.misses}</span>
                  </div>
                </div>

                {currentStep >= 0 && currentStep < simulationSteps.length && (
                  <div className="mt-4 p-4 bg-spotify-light rounded-md">
                    <h3 className="text-sm font-medium text-spotify-text mb-2">Current Page Fault Details</h3>
                    <p className="text-spotify-textSecondary">
                      {simulationSteps[currentStep].isHit
                        ? "No page fault occurred in this step."
                        : `Page fault occurred for page ${simulationSteps[currentStep].reference}. ${
                            simulationSteps[currentStep].replaced !== null
                              ? `Replaced page ${simulationSteps[currentStep].replaced}.`
                              : "Placed in an empty frame."
                          }`}
                    </p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="chart" className="pt-4">
                <div className="h-64 flex items-end justify-around gap-2">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-20 bg-spotify-green rounded-t-md transition-all duration-500"
                      style={{
                        height: `${(currentStats.hits / Math.max(currentStats.hits, currentStats.misses, 1)) * 200}px`,
                      }}
                    ></div>
                    <p className="mt-2 text-sm font-medium text-spotify-text">Hits</p>
                    <p className="text-xs text-spotify-textSecondary">{currentStats.hits}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      className="w-20 bg-red-500 rounded-t-md transition-all duration-500"
                      style={{
                        height: `${(currentStats.misses / Math.max(currentStats.hits, currentStats.misses, 1)) * 200}px`,
                      }}
                    ></div>
                    <p className="mt-2 text-sm font-medium text-spotify-text">Page Faults</p>
                    <p className="text-xs text-spotify-textSecondary">{currentStats.misses}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <p className="text-sm text-spotify-textSecondary mb-2">
                {algorithmType} algorithm with {frameCount} frames
              </p>
              {simulationSteps.length > 0 && currentStep === simulationSteps.length - 1 && (
                <div className="p-3 bg-spotify-light rounded-md mt-2">
                  <h4 className="text-sm font-medium text-spotify-text">Final Page Fault Summary</h4>
                  <p className="text-xs text-spotify-textSecondary mt-1">
                    Total page references: {simulationSteps.length}
                    <br />
                    Total page faults: {currentStats.misses}
                    <br />
                    Page fault ratio: {((currentStats.misses / simulationSteps.length) * 100).toFixed(2)}%<br />
                    Final memory state:{" "}
                    {simulationSteps[currentStep].frames.map((f) => (f !== null ? f : "-")).join(", ")}
                  </p>
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value, color }: { title: string; value: number; color: "green" | "red" }) {
  const bgColor = color === "green" ? "bg-spotify-green/20" : "bg-red-500/20"
  const textColor = color === "green" ? "text-spotify-green" : "text-red-500"
  const animatedValue = value // This will be animated in a real implementation

  return (
    <div className={`p-4 rounded-lg ${bgColor}`}>
      <h3 className="text-sm font-medium text-spotify-text">{title}</h3>
      <p className={`text-2xl font-bold ${textColor}`}>{animatedValue}</p>
    </div>
  )
}

