
import { useNavigate } from "react-router-dom";
import AnimatedTransition from "@/components/ui-custom/AnimatedTransition";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <AnimatedTransition animation="fade" className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
              Turn Visitors into Valuable Leads
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
              Create, manage, and optimize your lead generation campaigns with LeadWise.
              Capture, track, and convert leads more effectively.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {isAuthenticated ? (
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 px-8"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => navigate("/register")}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 px-8"
                  >
                    Get Started Free
                  </Button>
                  <Button
                    onClick={() => navigate("/login")}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 text-lg py-6 px-8"
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for Lead Generation
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our platform provides all the tools you need to create effective lead generation campaigns
              and turn prospects into customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-8 text-center transition-all duration-300 hover:shadow-lg">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-full">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Campaign Management</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create and manage multiple lead generation campaigns across different channels.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-8 text-center transition-all duration-300 hover:shadow-lg">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-full">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Lead Tracking</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track and manage leads throughout the sales pipeline from capture to conversion.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-8 text-center transition-all duration-300 hover:shadow-lg">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-full">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Analytics & Insights</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Gain valuable insights into your lead generation performance with detailed analytics.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Boost Your Lead Generation?
          </h2>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto mb-8">
            Join thousands of businesses that use LeadWise to capture and convert more leads.
          </p>
          <Button
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/register")}
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-blue-600 text-lg py-6 px-8"
          >
            {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold text-blue-600">LeadWise</span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} LeadWise. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </AnimatedTransition>
  );
};

export default Index;
