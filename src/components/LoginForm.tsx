import { useState } from "react";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { auth } from "@/lib/services/storage";
import type { LoginCredentials } from "@/types/mockup";

export default function LoginForm() {
  const [credentials, setCredentials] = useState<LoginCredentials>({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call delay
    setTimeout(() => {
      const result = auth.login(credentials);
      if (result.success) {
        // Redirect to dashboard
        window.location.href = "/dashboard";
      } else {
        setError('Invalid username or password. Use "dmmaster" and "password123"');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1002638/pexels-photo-1002638.jpeg')] bg-cover bg-center opacity-20"></div>

      <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-500 size-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="size-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dungeon Master Panel</h1>
          <p className="text-gray-600">Sign in to manage your campaigns</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                error ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12 ${
                  error ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600 text-center">
            <p>
              <strong>Demo credentials:</strong>
            </p>
            <p>Username: dmmaster</p>
            <p>Password: password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
