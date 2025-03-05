
import AnimatedTransition from "@/components/ui-custom/AnimatedTransition";
import GlassCard from "@/components/ui-custom/GlassCard";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { BarChart3, DollarSign, Percent, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedTransition animation="fade" className="text-center">
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
                BetWiser Sports Betting
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Your premier destination for sports betting. Get the best odds on all major sporting events.
              </p>
              <div className="mt-10">
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-lg">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <div className="space-x-4">
                    <Link to="/login">
                      <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg rounded-lg">
                        Start Betting
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="outline" className="px-8 py-6 text-lg rounded-lg">
                        Create Account
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </AnimatedTransition>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedTransition animation="fade" className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">
                The Ultimate Betting Experience
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                Everything you need for an exceptional sports betting experience
              </p>
            </AnimatedTransition>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <AnimatedTransition animation="slide" className="flex flex-col items-center">
                <GlassCard className="p-6 h-full w-full">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mt-5 text-lg font-medium text-gray-900 text-center">
                    Competitive Odds
                  </h3>
                  <p className="mt-2 text-base text-gray-600 text-center">
                    We offer the best odds across all major sports leagues worldwide.
                  </p>
                </GlassCard>
              </AnimatedTransition>

              <AnimatedTransition animation="slide" className="flex flex-col items-center" style={{ animationDelay: "100ms" }}>
                <GlassCard className="p-6 h-full w-full">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                    <Percent className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mt-5 text-lg font-medium text-gray-900 text-center">
                    In-depth Analytics
                  </h3>
                  <p className="mt-2 text-base text-gray-600 text-center">
                    Track your betting performance with detailed statistics and insights.
                  </p>
                </GlassCard>
              </AnimatedTransition>

              <AnimatedTransition animation="slide" className="flex flex-col items-center" style={{ animationDelay: "200ms" }}>
                <GlassCard className="p-6 h-full w-full">
                  <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto">
                    <Timer className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="mt-5 text-lg font-medium text-gray-900 text-center">
                    Live Betting
                  </h3>
                  <p className="mt-2 text-base text-gray-600 text-center">
                    Place bets during games with our real-time odds updates and live statistics.
                  </p>
                </GlassCard>
              </AnimatedTransition>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedTransition animation="fade">
              <h2 className="text-3xl font-bold">Ready to Start Betting?</h2>
              <p className="mt-4 text-xl text-green-100 max-w-2xl mx-auto">
                Join now and receive a $1000 welcome bonus to kick-start your betting experience.
              </p>
              <div className="mt-8">
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 text-lg rounded-lg">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/register">
                    <Button className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 text-lg rounded-lg">
                      Create Free Account
                    </Button>
                  </Link>
                )}
              </div>
            </AnimatedTransition>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} BetWiser Sports Betting. All rights reserved. 18+. Please gamble responsibly.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
