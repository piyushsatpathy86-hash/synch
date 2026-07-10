import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    navigate("/");
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-sm bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/60 p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold text-navy">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Log in to continue to Synch</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Email</label>
            <input
              type="email"
              placeholder="you@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-500 block">Password</label>
              <Link to="/forgot-password" className="text-xs font-semibold text-orange hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-orange text-white font-bold py-2.5 rounded-lg mt-2 shadow-md shadow-orange/20 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:hover:scale-100 disabled:hover:brightness-100"
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>

        {error && (
          <p className="text-red-600 text-sm mt-4 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <p className="text-sm text-gray-500 mt-6 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-orange font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}