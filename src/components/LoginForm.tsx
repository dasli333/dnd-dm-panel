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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="relative z-10 backdrop-blur-xl bg-gradient-to-b from-gray-900/40 to-gray-950/60 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-800/50">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 size-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <LogIn className="size-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-transparent bg-clip-text drop-shadow-lg mb-2">
            Dungeon Master Panel
          </h1>
          <p className="text-gray-300">Sign in to manage your campaigns</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors text-white placeholder-gray-400 ${
                error ? "border-red-500/50" : "border-gray-700/50"
              }`}
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors text-white placeholder-gray-400 pr-12 ${
                  error ? "border-red-500/50" : "border-gray-700/50"
                }`}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
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
                className="h-4 w-4 text-cyan-500 focus:ring-cyan-500 border-gray-600 bg-gray-800/50 rounded"
              />
              <span className="ml-2 text-sm text-gray-300">Remember me</span>
            </label>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 backdrop-blur-sm">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:from-cyan-600 hover:to-blue-600 hover:shadow-xl"
            }`}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-700/50">
          <div className="text-sm text-gray-300 text-center">
            <p>
              <strong className="text-cyan-400">Demo credentials:</strong>
            </p>
            <p className="font-mono text-gray-400">Username: dmmaster</p>
            <p className="font-mono text-gray-400">Password: password123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
