
import AuthForm from "@/components/AuthForm";
import AnimatedTransition from "@/components/ui-custom/AnimatedTransition";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
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
            <h1 className="text-4xl font-bold text-apple-blue">Note14</h1>
            <p className="mt-3 text-gray-600">
              Sign in to access your stock portfolio
            </p>
          </div>
          
          <AuthForm mode="login" />

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-apple-blue hover:underline">
                Create one
              </Link>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Use username: admin and password: admin to try the demo account
            </p>
          </div>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default Login;
