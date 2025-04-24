"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, Loader2, RefreshCw } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { getElectionResults } from "@/lib/blockchain"

interface Candidate {
  id: number
  name: string
  party: string
  image: string
  votes: number
  percentage: number
}

export default function ResultsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [results, setResults] = useState<Candidate[]>([])
  const [totalVotes, setTotalVotes] = useState(0)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would call the blockchain
      const data = await getElectionResults()
      setResults(data.candidates)
      setTotalVotes(data.totalVotes)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to fetch results:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <ShieldCheck className="h-6 w-6 text-emerald-600" />
          <span className="ml-2 text-xl font-bold">BlockVote</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
            Home
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/register">
            Register
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/vote">
            Vote
          </Link>
        </nav>
      </header>
      <main className="flex-1 p-4 md:p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Election Results</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchResults}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Refresh
            </Button>
          </div>

          {isLoading && results.length === 0 ? (
            <Card>
              <CardContent className="flex justify-center items-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                  <p className="text-sm text-gray-500">Loading election results...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Current Standings</CardTitle>
                  <CardDescription>
                    Total votes: {totalVotes} • Last updated: {lastUpdated?.toLocaleTimeString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {results.length > 0 ? (
                      results
                        .sort((a, b) => b.votes - a.votes)
                        .map((candidate) => (
                          <div key={candidate.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Image
                                  src={candidate.image || "/placeholder.svg"}
                                  alt={candidate.name}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                                <div>
                                  <p className="font-medium">{candidate.name}</p>
                                  <p className="text-xs text-gray-500">{candidate.party}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">{candidate.votes} votes</p>
                                <p className="text-sm">{candidate.percentage.toFixed(1)}%</p>
                              </div>
                            </div>
                            <Progress value={candidate.percentage} className="h-2" />
                          </div>
                        ))
                    ) : (
                      <p className="text-center py-4 text-gray-500">No results available yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Blockchain Verification</CardTitle>
                  <CardDescription>
                    All votes are recorded on the Ethereum blockchain for transparency and verification.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    You can verify the election results by checking the smart contract directly on the blockchain.
                  </p>
                  <Button variant="outline" className="w-full sm:w-auto">
                    View on Etherscan
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-gray-500">© 2024 BlockVote. All rights reserved.</p>
      </footer>
    </div>
  )
}
