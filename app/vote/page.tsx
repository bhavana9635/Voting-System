"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ShieldCheck, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { connectWallet, checkVoterStatus, castVote } from "@/lib/blockchain"

interface Candidate {
  id: number
  name: string
  party: string
  image: string
}

const candidates: Candidate[] = [
  {
    id: 1,
    name: "Jane Smith",
    party: "Progressive Party",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "John Doe",
    party: "Conservative Party",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Alex Johnson",
    party: "Liberty Party",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    name: "Sam Wilson",
    party: "Green Party",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function VotePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null)
  const [voterStatus, setVoterStatus] = useState<"unregistered" | "registered" | "voted" | null>(null)
  const [voteSubmitted, setVoteSubmitted] = useState(false)
  const [transactionHash, setTransactionHash] = useState("")

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      try {
        const address = await connectWallet(true) // true = just check, don't prompt
        if (address) {
          setWalletAddress(address)
          setIsConnected(true)
          const status = await checkVoterStatus(address)
          setVoterStatus(status)
        }
      } catch (error) {
        console.error("No wallet connected:", error)
      }
    }

    checkConnection()
  }, [])

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      const address = await connectWallet()
      setWalletAddress(address)
      setIsConnected(true)
      const status = await checkVoterStatus(address)
      setVoterStatus(status)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVote = async () => {
    if (!selectedCandidate) return

    setIsLoading(true)
    try {
      const txHash = await castVote(selectedCandidate)
      setTransactionHash(txHash)
      setVoteSubmitted(true)
      setVoterStatus("voted")
    } catch (error) {
      console.error("Failed to cast vote:", error)
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
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/results">
            Results
          </Link>
        </nav>
      </header>
      <main className="flex-1 p-4 md:p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Cast Your Vote</h1>

          {!isConnected ? (
            <Card>
              <CardHeader>
                <CardTitle>Connect Your Wallet</CardTitle>
                <CardDescription>
                  Connect your Ethereum wallet to verify your identity and cast your vote.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <Button onClick={handleConnect} className="bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect Wallet"
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : voterStatus === "unregistered" ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Not Registered</AlertTitle>
              <AlertDescription>
                You are not registered to vote. Please register first.
                <div className="mt-4">
                  <Link href="/register">
                    <Button variant="outline">Register to Vote</Button>
                  </Link>
                </div>
              </AlertDescription>
            </Alert>
          ) : voterStatus === "voted" || voteSubmitted ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-emerald-600">Vote Successfully Cast!</CardTitle>
                <CardDescription className="text-center">
                  Your vote has been recorded on the blockchain.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4 py-6">
                <CheckCircle2 className="h-16 w-16 text-emerald-600" />
                <p className="text-sm text-gray-500 text-center max-w-md">
                  Thank you for participating in this election. Your vote has been securely recorded and cannot be
                  altered.
                </p>
                {transactionHash && (
                  <div className="w-full mt-4">
                    <p className="text-xs font-medium mb-1">Transaction Hash:</p>
                    <p className="text-xs bg-gray-100 p-2 rounded break-all">{transactionHash}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-center">
                <Link href="/results">
                  <Button variant="outline">View Election Results</Button>
                </Link>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Select Your Candidate</CardTitle>
                <CardDescription>Choose one candidate from the list below.</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedCandidate?.toString()}
                  onValueChange={(value) => setSelectedCandidate(Number.parseInt(value))}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    {candidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className={`flex items-center space-x-4 rounded-lg border p-4 transition-colors ${
                          selectedCandidate === candidate.id ? "border-emerald-600 bg-emerald-50" : ""
                        }`}
                      >
                        <RadioGroupItem
                          value={candidate.id.toString()}
                          id={`candidate-${candidate.id}`}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={`candidate-${candidate.id}`}
                          className="flex flex-1 cursor-pointer items-center space-x-4"
                        >
                          <Image
                            src={candidate.image || "/placeholder.svg"}
                            alt={candidate.name}
                            width={60}
                            height={60}
                            className="rounded-full"
                          />
                          <div>
                            <p className="text-base font-medium">{candidate.name}</p>
                            <p className="text-sm text-gray-500">{candidate.party}</p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleVote}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={isLoading || selectedCandidate === null}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Vote...
                    </>
                  ) : (
                    "Submit Vote"
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-gray-500">© 2024 BlockVote. All rights reserved.</p>
      </footer>
    </div>
  )
}
