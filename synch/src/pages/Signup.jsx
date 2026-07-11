import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: "",
        college: "",
        skills: [],
      });
      if (profileError) console.error("Profile creation failed:", profileError.message);
    }

    setMessage("Account created! Redirecting…");
    setLoading(false);
    setTimeout(() => navigate("/profile"), 1000);
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-orange/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-purple/10 blur-3xl" />

      <div className="relative w-full max-w-sm bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/60 p-8">
        <div className="mb-6 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-orange mb-2">Join Synch</p>
          <h1 className="text-2xl font-extrabold tracking-tight text-navy">Create your profile</h1>
          <p className="text-gray-mid text-sm mt-1">Find your team, free forever</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-mid mb-1 block">Email</label>
            <input
              type="email"
              placeholder="you@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-mid mb-1 block">Password</label>
            <input
              type="password"
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-orange text-white font-bold py-2.5 rounded-xl mt-2 shadow-md shadow-orange/20 hover:bg-orange-dark hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {loading ? "Creating…" : "Sign up"}
          </button>
        </form>

        {message && (
          <p className="text-green-700 text-sm mt-4 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-600 text-sm mt-4 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        <p className="text-sm text-gray-mid mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-orange font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}