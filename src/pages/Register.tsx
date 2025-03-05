
import AuthForm from "@/components/AuthForm";
import AnimatedTransition from "@/components/ui-custom/AnimatedTransition";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <AnimatedTransition animation="fade" className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-600">LeadWise</h1>
            <p className="mt-3 text-gray-600">
              Create an account to manage your lead generation campaigns
            </p>
          </div>
          
          <AuthForm mode="register" />

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default Register;
