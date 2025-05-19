import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { Wallet, Sparkles, BarChart3, Shield } from "lucide-react";
import { ConnectWalletButton } from "@/components/connect-wallet-button";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between mx-auto">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">LabelChain Admin</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Pricing
            </Link>
          </nav>
          <div>
            <ConnectWalletButton />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 container mx-auto">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Create Labeling Tasks with Solana Rewards
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    A decentralized platform where you can create image-based
                    labeling tasks and reward users with SOL.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button size="lg" className="gap-1">
                      <Wallet className="h-4 w-4" />
                      Get Started
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-[350px] rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 p-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-24 w-24 text-primary" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 rounded-md bg-background/80 backdrop-blur p-4">
                    <div className="text-sm font-medium">
                      Create tasks with SOL rewards
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Users complete tasks and earn SOL directly to their
                      wallets
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/50"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Everything You Need to Create and Manage Tasks
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides all the tools you need to create,
                  manage, and track labeling tasks.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <BarChart3 className="h-10 w-10 text-primary" />
                  <div>
                    <h3 className="font-semibold">Task Analytics</h3>
                    <p className="text-sm text-muted-foreground">
                      Track task completion and user engagement.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <Wallet className="h-10 w-10 text-primary" />
                  <div>
                    <h3 className="font-semibold">Solana Integration</h3>
                    <p className="text-sm text-muted-foreground">
                      Pay and reward users with SOL.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <Sparkles className="h-10 w-10 text-primary" />
                  <div>
                    <h3 className="font-semibold">Image Labeling</h3>
                    <p className="text-sm text-muted-foreground">
                      Create image-based labeling tasks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Simple Process, Powerful Results
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform makes it easy to create and manage labeling
                  tasks.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    1
                  </div>
                  <h3 className="font-semibold">Connect Wallet</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect your Solana wallet to get started.
                  </p>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    2
                  </div>
                  <h3 className="font-semibold">Create Task</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload images and set rewards for your task.
                  </p>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    3
                  </div>
                  <h3 className="font-semibold">Pay & Publish</h3>
                  <p className="text-sm text-muted-foreground">
                    Pay with SOL and publish your task for users.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="pricing"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/50"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Pricing
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Transparent Pricing
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  You only pay for the tasks you create and the rewards you set.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-sm py-12">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex flex-col items-center gap-4 text-center">
                  <h3 className="text-2xl font-bold">Pay-as-you-go</h3>
                  <div className="text-4xl font-bold">0% Platform Fee</div>
                  <p className="text-sm text-muted-foreground">
                    You only pay for the SOL rewards you set for your tasks.
                  </p>
                  <ul className="grid gap-2 text-sm text-left w-full">
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Create unlimited tasks</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Set your own rewards</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>Access to all analytics</span>
                    </li>
                  </ul>
                  <Link href="/dashboard">
                    <Button size="lg" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">LabelChain Admin</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 LabelChain. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:underline underline-offset-4"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:underline underline-offset-4"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
