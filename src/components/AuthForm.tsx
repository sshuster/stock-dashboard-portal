
import AnimatedTransition from "@/components/ui-custom/AnimatedTransition";
import GlassCard from "@/components/ui-custom/GlassCard";
import { useAuth } from "@/context/AuthContext";
import { LoginCredentials, RegisterCredentials } from "@/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AuthFormProps {
  mode: "login" | "register";
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterCredentials>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let success = false;

      if (mode === "login") {
        const loginData: LoginCredentials = {
          username: formData.username,
          password: formData.password,
        };
        success = await login(loginData);
      } else {
        success = await register(formData);
      }

      if (success) {
        navigate("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedTransition
      animation="scale"
      className="w-full max-w-md mx-auto"
    >
      <GlassCard className="p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder={mode === "login" ? "admin" : "Choose a username"}
              value={formData.username}
              onChange={handleChange}
              required
              className="border-gray-200 focus:border-apple-blue"
            />
          </div>

          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Your email address"
                value={formData.email}
                onChange={handleChange}
                required
                className="border-gray-200 focus:border-apple-blue"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={mode === "login" ? "admin" : "Choose a password"}
              value={formData.password}
              onChange={handleChange}
              required
              className="border-gray-200 focus:border-apple-blue"
            />
          </div>

          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="border-gray-200 focus:border-apple-blue"
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-apple-blue hover:bg-blue-600 text-white"
            disabled={isLoading}
          >
            {isLoading
              ? mode === "login"
                ? "Logging in..."
                : "Creating Account..."
              : mode === "login"
              ? "Log In"
              : "Create Account"}
          </Button>
        </form>
      </GlassCard>
    </AnimatedTransition>
  );
};

export default AuthForm;
