import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/common/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="flex-1 w-full max-w-md mx-auto py-12 px-6 sm:px-12">
        <div className="w-full">
          <h1 className="mb-2 text-2xl font-bold text-slate-900">Welcome Back</h1>
          <p className="mb-6 text-slate-600">Login to your company account</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email / Company Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                placeholder="Enter your email address"
              />
            </div>
            
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={password ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pl-10 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setPassword(prev => !prev ? "text" : "password");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password visibility"
                >
                  {password ? (
                    <span className="lucide lucide-eye-off"></span>
                  ) : (
                    <span className="lucide lucide-eye"></span>
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <span className="ml-2 text-slate-700">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot Password?
              </Link>
            </div>
            
            <Button 
              type="submit" 
              loading={loading} 
              className="w-full"
            >
              Login &rarr;
            </Button>
          </form>
          
          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-800">
              Create Company Account
            </Link>
          </p>
          
          <div className="mt-10 pt-6 border-t border-slate-200">
            <div className="text-center text-sm text-slate-500">
              Demo Account
            </div>
            <div className="mt-2 flex flex-col items-center gap-2">
              <div className="flex items-center space-x-3 text-sm">
                <span className="font-mono">demo@company.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <span className="font-mono">Demo@123</span>
              </div>
              <p className="text-xs text-slate-400 text-center max-w-xs">
                For Project Demo
              </p>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
