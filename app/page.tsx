import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, ShieldCheck, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <ShieldCheck className="h-6 w-6 text-emerald-600" />
          <span className="ml-2 text-xl font-bold">BlockVote</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            How It Works
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-emerald-50 to-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Secure Blockchain Voting System
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  A transparent, secure, and immutable voting platform powered by blockchain technology.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                    Register to Vote
                  </Button>
                </Link>
                <Link href="/vote">
                  <Button size="lg" variant="outline">
                    Cast Your Vote
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-emerald-600" />
                    <CardTitle>Secure & Transparent</CardTitle>
                  </div>
                  <CardDescription>
                    Built on blockchain technology for maximum security and transparency.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Every vote is securely recorded on the blockchain, making it immutable and verifiable by anyone
                    while maintaining voter privacy.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lock className="h-6 w-6 text-emerald-600" />
                    <CardTitle>Tamper-Proof</CardTitle>
                  </div>
                  <CardDescription>Votes cannot be altered once cast, ensuring election integrity.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Our smart contracts ensure that once a vote is recorded, it cannot be changed or deleted, preventing
                    fraud and manipulation.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-6 w-6 text-emerald-600" />
                    <CardTitle>Real-Time Results</CardTitle>
                  </div>
                  <CardDescription>View election results as they happen with our real-time dashboard.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Watch the voting process unfold in real-time with our transparent counting system, while still
                    maintaining voter anonymity.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Our blockchain voting system is designed to be simple, secure, and transparent.
                </p>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 lg:gap-12 mt-8">
                <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <span className="text-xl font-bold">1</span>
                  </div>
                  <h3 className="text-lg font-bold">Register</h3>
                  <p className="text-sm text-gray-500 text-center">
                    Create an account and verify your identity to receive voting rights.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <span className="text-xl font-bold">2</span>
                  </div>
                  <h3 className="text-lg font-bold">Connect Wallet</h3>
                  <p className="text-sm text-gray-500 text-center">
                    Connect your Ethereum wallet to interact with our voting smart contracts.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <span className="text-xl font-bold">3</span>
                  </div>
                  <h3 className="text-lg font-bold">Cast Vote</h3>
                  <p className="text-sm text-gray-500 text-center">
                    Select your candidate and submit your vote securely on the blockchain.
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 border rounded-lg p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <span className="text-xl font-bold">4</span>
                  </div>
                  <h3 className="text-lg font-bold">Verify</h3>
                  <p className="text-sm text-gray-500 text-center">
                    Confirm your vote was recorded correctly and view real-time results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-gray-500">© 2024 BlockVote. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
