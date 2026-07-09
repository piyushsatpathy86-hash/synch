import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setMessage("Password updated! Redirecting to login…");
    setLoading(false);
    setTimeout(() => navigate("/login"), 2000);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-sm bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/60 p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold text-navy">Set a new password</h1>
          <p className="text-gray-500 text-sm mt-1">Choose a new password for your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">New password</label>
            <input
              type="password"
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Confirm password</label>
            <input
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-orange text-white font-bold py-2.5 rounded-lg mt-2 shadow-md shadow-orange/20 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:hover:scale-100 disabled:hover:brightness-100"
          >
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>

        {message && (
          <p className="text-green-700 text-sm mt-4 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-600 text-sm mt-4 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}