
import AnimatedTransition from "@/components/ui-custom/AnimatedTransition";
import GlassCard from "@/components/ui-custom/GlassCard";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { BarChart3, Clock, LineChart, TrendingUp } from "lucide-react";
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
                Stock Portfolio Management
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Track, analyze, and optimize your investments with our elegant
                and intuitive stock portfolio dashboard.
              </p>
              <div className="mt-10">
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button className="bg-apple-blue hover:bg-blue-600 text-white px-8 py-6 text-lg rounded-lg">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <div className="space-x-4">
                    <Link to="/login">
                      <Button className="bg-apple-blue hover:bg-blue-600 text-white px-8 py-6 text-lg rounded-lg">
                        Get Started
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
                Powerful Portfolio Management
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                Everything you need to manage your investments in one place
              </p>
            </AnimatedTransition>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <AnimatedTransition animation="slide" className="flex flex-col items-center">
                <GlassCard className="p-6 h-full w-full">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                    <TrendingUp className="h-6 w-6 text-apple-blue" />
                  </div>
                  <h3 className="mt-5 text-lg font-medium text-gray-900 text-center">
                    Performance Tracking
                  </h3>
                  <p className="mt-2 text-base text-gray-600 text-center">
                    Monitor your investments with real-time updates and
                    performance metrics.
                  </p>
                </GlassCard>
              </AnimatedTransition>

              <AnimatedTransition animation="slide" className="flex flex-col items-center" style={{ animationDelay: "100ms" }}>
                <GlassCard className="p-6 h-full w-full">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                    <LineChart className="h-6 w-6 text-apple-blue" />
                  </div>
                  <h3 className="mt-5 text-lg font-medium text-gray-900 text-center">
                    Visual Analytics
                  </h3>
                  <p className="mt-2 text-base text-gray-600 text-center">
                    Beautiful charts and graphs to visualize your portfolio
                    performance over time.
                  </p>
                </GlassCard>
              </AnimatedTransition>

              <AnimatedTransition animation="slide" className="flex flex-col items-center" style={{ animationDelay: "200ms" }}>
                <GlassCard className="p-6 h-full w-full">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                    <BarChart3 className="h-6 w-6 text-apple-blue" />
                  </div>
                  <h3 className="mt-5 text-lg font-medium text-gray-900 text-center">
                    Investment Insights
                  </h3>
                  <p className="mt-2 text-base text-gray-600 text-center">
                    Get detailed statistics and insights about your portfolio
                    allocation and performance.
                  </p>
                </GlassCard>
              </AnimatedTransition>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedTransition animation="fade">
              <h2 className="text-3xl font-bold">Ready to Start Tracking?</h2>
              <p className="mt-4 text-xl text-blue-100 max-w-2xl mx-auto">
                Join now and take control of your investment portfolio with our
                intuitive dashboard.
              </p>
              <div className="mt-8">
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg rounded-lg">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/register">
                    <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg rounded-lg">
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
              &copy; {new Date().getFullYear()} Note14 Stock Portfolio. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
