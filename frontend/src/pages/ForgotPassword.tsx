import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/common/Button";


export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    
    // Mock sending reset link
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage("We have sent a password reset link to your registered email address.");
      setEmail(""); // Clear the email for security
    } catch (err: any) {
      setError(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="flex-1 w-full max-w-md mx-auto py-12 px-6 sm:px-12">
        <div className="w-full">
          <h1 className="mb-2 text-2xl font-bold text-slate-900">Forgot Password?</h1>
          <p className="mb-6 text-slate-600">
            Enter your registered email and we'll send you instructions to reset your password.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                placeholder="Enter your registered email address"
              />
            </div>
            
            <Button 
              type="submit" 
              loading={loading} 
              className="w-full"
            >
              Send Reset Link &rarr;
            </Button>
          </form>
          
          {message && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              {message}
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
          
          <p className="mt-8 text-center text-sm text-slate-500">
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
