import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Eye, ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-accent" />
            <span className="text-2xl font-bold text-foreground">
              BuildCraft
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              How it Works
            </Link>
            <Link
              href="#pricing"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-6xl">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 text-balance">
            The complete platform to build the future.
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Your team's toolkit to stop configuring and start innovating.
            Securely build, deploy, and scale the best construction experiences
            with BuildCraft.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="text-lg px-8">
              Get a demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 bg-transparent"
            >
              Explore the Platform
            </Button>
          </div>

          {/* 3D Model Preview Placeholder */}
          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg border border-border flex items-center justify-center">
              <div className="text-center">
                <Play className="h-16 w-16 text-accent mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Interactive 3D Model Preview
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="text-center border-0 bg-transparent">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-foreground mb-2">
                  20 days
                </div>
                <div className="text-muted-foreground">
                  saved on daily builds.
                </div>
                <div className="mt-4 text-sm font-semibold">NETFLIX</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 bg-transparent">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-foreground mb-2">
                  98%
                </div>
                <div className="text-muted-foreground">
                  faster time to market.
                </div>
                <div className="mt-4 text-sm font-semibold">TRIPADVISOR</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 bg-transparent">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-foreground mb-2">
                  300%
                </div>
                <div className="text-muted-foreground">
                  increase in efficiency.
                </div>
                <div className="mt-4 text-sm font-semibold">BOX</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 bg-transparent">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-foreground mb-2">
                  6x
                </div>
                <div className="text-muted-foreground">
                  faster to build + deploy.
                </div>
                <div className="mt-4 text-sm font-semibold">EBAY</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-accent" />
                <span className="text-accent font-medium">Collaboration</span>
              </div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Faster iteration. More innovation.
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                The platform for rapid progress. Let your team focus on shipping
                features instead of managing infrastructure with automated
                CI/CD, built-in testing, and integrated collaboration.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-foreground">
                    Real-time 3D model collaboration
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-foreground">
                    Progress tracking and milestone management
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="text-foreground">
                    Change request workflow automation
                  </span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-lg border border-border flex items-center justify-center">
                <div className="text-center">
                  <Eye className="h-16 w-16 text-accent mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Collaboration Interface
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to transform your construction process?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of builders and customers who trust BuildCraft for
            their construction projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?type=builder">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                I'm a Builder
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register?type=customer">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              >
                I'm a Customer
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Building2 className="h-6 w-6 text-accent" />
              <span className="text-xl font-bold text-foreground">
                BuildCraft
              </span>
            </div>
            <div className="flex items-center gap-6 text-muted-foreground">
              <Link
                href="/privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/support"
                className="hover:text-foreground transition-colors"
              >
                Support
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; 2024 BuildCraft. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
