
import AnimatedTransition from "@/components/ui-custom/AnimatedTransition";
import GlassCard from "@/components/ui-custom/GlassCard";
import { useAuth } from "@/context/AuthContext";
import { LoginCredentials, RegisterCredentials } from "@/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

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
    companyName: "",
    industry: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, industry: value }));
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
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match");
          setIsLoading(false);
          return;
        }
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
              className="border-gray-200 focus:border-blue-600"
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
                className="border-gray-200 focus:border-blue-600"
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
              className="border-gray-200 focus:border-blue-600"
            />
          </div>

          {mode === "register" && (
            <>
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
                  className="border-gray-200 focus:border-blue-600"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  placeholder="Your company name"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="border-gray-200 focus:border-blue-600"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={formData.industry}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
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
