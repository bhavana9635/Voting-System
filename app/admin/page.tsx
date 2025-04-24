"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShieldCheck, Loader2, Users, Calendar, Settings, Lock } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { connectWallet, isAdmin, getVoterList, createElection, endElection, getElectionStatus } from "@/lib/blockchain"

interface Voter {
  id: string
  address: string
  name: string
  registrationDate: string
  hasVoted: boolean
}

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [voters, setVoters] = useState<Voter[]>([])
  const [electionActive, setElectionActive] = useState(false)
  const [electionTitle, setElectionTitle] = useState("")
  const [electionStartDate, setElectionStartDate] = useState("")
  const [electionEndDate, setElectionEndDate] = useState("")

  useEffect(() => {
    checkAdminStatus()
  }, [])

  const checkAdminStatus = async () => {
    setIsLoading(true)
    try {
      const address = await connectWallet(true) // true = just check, don't prompt
      if (address) {
        setWalletAddress(address)
        setIsConnected(true)

        const adminStatus = await isAdmin(address)
        setIsAuthorized(adminStatus)

        if (adminStatus) {
          const voterData = await getVoterList()
          setVoters(voterData)

          const status = await getElectionStatus()
          setElectionActive(status.active)
          if (status.active) {
            setElectionTitle(status.title)
            setElectionStartDate(status.startDate)
            setElectionEndDate(status.endDate)
          }
        }
      }
    } catch (error) {
      console.error("Admin check failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      const address = await connectWallet()
      setWalletAddress(address)
      setIsConnected(true)

      const adminStatus = await isAdmin(address)
      setIsAuthorized(adminStatus)

      if (adminStatus) {
        const voterData = await getVoterList()
        setVoters(voterData)

        const status = await getElectionStatus()
        setElectionActive(status.active)
        if (status.active) {
          setElectionTitle(status.title)
          setElectionStartDate(status.startDate)
          setElectionEndDate(status.endDate)
        }
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateElection = async () => {
    if (!electionTitle || !electionStartDate || !electionEndDate) return

    setIsLoading(true)
    try {
      await createElection(electionTitle, electionStartDate, electionEndDate)
      setElectionActive(true)
    } catch (error) {
      console.error("Failed to create election:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEndElection = async () => {
    setIsLoading(true)
    try {
      await endElection()
      setElectionActive(false)
      setElectionTitle("")
      setElectionStartDate("")
      setElectionEndDate("")
    } catch (error) {
      console.error("Failed to end election:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !isConnected) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="px-4 lg:px-6 h-16 flex items-center border-b">
          <Link className="flex items-center justify-center" href="/">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
            <span className="ml-2 text-xl font-bold">BlockVote</span>
          </Link>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <p>Loading admin panel...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <ShieldCheck className="h-6 w-6 text-emerald-600" />
          <span className="ml-2 text-xl font-bold">BlockVote</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          {isConnected && isAuthorized && (
            <p className="text-sm text-gray-500">
              Admin: {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
            </p>
          )}
          <Link href="/">
            <Button variant="ghost" size="sm">
              Exit Admin
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8 bg-gray-50">
        {!isConnected ? (
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Admin Authentication</CardTitle>
                <CardDescription>Connect your wallet to access the admin panel.</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <Button onClick={handleConnect} className="bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect Admin Wallet"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : !isAuthorized ? (
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Access Denied</CardTitle>
                <CardDescription>Your wallet does not have admin privileges.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4 py-6">
                <Lock className="h-16 w-16 text-red-600" />
                <p className="text-center text-sm text-gray-500">
                  The connected wallet is not authorized to access the admin panel. Please connect with an admin wallet.
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={handleConnect} className="w-full" variant="outline">
                  Connect Different Wallet
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <Tabs defaultValue="election">
              <TabsList className="mb-4">
                <TabsTrigger value="election" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Election Management
                </TabsTrigger>
                <TabsTrigger value="voters" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Voter Registry
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  System Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="election">
                <Card>
                  <CardHeader>
                    <CardTitle>Election Management</CardTitle>
                    <CardDescription>Create, manage, and end elections.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {electionActive ? (
                      <div className="space-y-4">
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                          <h3 className="font-medium text-emerald-700 mb-2">Active Election</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Title</p>
                              <p>{electionTitle}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Status</p>
                              <p className="text-emerald-600 font-medium">In Progress</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Start Date</p>
                              <p>{new Date(electionStartDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">End Date</p>
                              <p>{new Date(electionEndDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>

                        <Button variant="destructive" onClick={handleEndElection} disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "End Election"
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Election Title</Label>
                          <Input
                            id="title"
                            placeholder="e.g., Presidential Election 2024"
                            value={electionTitle}
                            onChange={(e) => setElectionTitle(e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                              id="startDate"
                              type="date"
                              value={electionStartDate}
                              onChange={(e) => setElectionStartDate(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                              id="endDate"
                              type="date"
                              value={electionEndDate}
                              onChange={(e) => setElectionEndDate(e.target.value)}
                            />
                          </div>
                        </div>

                        <Button
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={handleCreateElection}
                          disabled={isLoading || !electionTitle || !electionStartDate || !electionEndDate}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            "Create Election"
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="voters">
                <Card>
                  <CardHeader>
                    <CardTitle>Voter Registry</CardTitle>
                    <CardDescription>View and manage registered voters.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {voters.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Wallet Address</TableHead>
                            <TableHead>Registration Date</TableHead>
                            <TableHead>Voted</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {voters.map((voter) => (
                            <TableRow key={voter.id}>
                              <TableCell className="font-medium">{voter.name}</TableCell>
                              <TableCell className="font-mono text-xs">
                                {voter.address.substring(0, 6)}...{voter.address.substring(voter.address.length - 4)}
                              </TableCell>
                              <TableCell>{voter.registrationDate}</TableCell>
                              <TableCell>{voter.hasVoted ? "Yes" : "No"}</TableCell>
                              <TableCell>
                                <Switch checked={true} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No registered voters found.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>System Settings</CardTitle>
                    <CardDescription>Configure blockchain voting system settings.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Voter Verification</p>
                          <p className="text-sm text-gray-500">Require ID verification for voter registration</p>
                        </div>
                        <Switch checked={true} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Public Results</p>
                          <p className="text-sm text-gray-500">Show real-time results during active election</p>
                        </div>
                        <Switch checked={true} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Gas Optimization</p>
                          <p className="text-sm text-gray-500">Optimize smart contracts for lower gas fees</p>
                        </div>
                        <Switch checked={true} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-gray-500">© 2024 BlockVote. All rights reserved.</p>
      </footer>
    </div>
  )
}
