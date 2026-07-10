import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

export default function JoinProject() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [requested, setRequested] = useState(false);

  async function handleJoin(e) {
    e.preventDefault();
    if (!code.trim()) return;

    setJoining(true);
    setError("");

    const cleanCode = code.trim().toUpperCase();

    const { data: group, error: groupError } = await supabase
      .from("groups")
      .select("*")
      .eq("join_code", cleanCode)
      .single();

    if (groupError || !group) {
      setError("No project found with that code. Check and try again.");
      setJoining(false);
      return;
    }

    // Already a member?
    const { data: existingMember } = await supabase
      .from("group_members")
      .select("*")
      .eq("group_id", group.id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingMember) {
      navigate(`/project/${group.id}`);
      return;
    }

    // Already requested?
    const { data: existingRequest } = await supabase
      .from("join_requests")
      .select("*")
      .eq("group_id", group.id)
      .eq("user_id", user.id)
      .eq("status", "pending")
      .maybeSingle();

    if (existingRequest) {
      setRequested(true);
      setJoining(false);
      return;
    }

    // Create a new join request
    const { error: reqError } = await supabase
      .from("join_requests")
      .insert({ group_id: group.id, user_id: user.id });

    if (reqError) {
      setError(reqError.message);
      setJoining(false);
      return;
    }

    setRequested(true);
    setJoining(false);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10 bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/60 p-8">
        <h1 className="text-2xl font-extrabold text-navy mb-2">Join a project</h1>
        <p className="text-gray-500 text-sm mb-6">Enter the code your teammate shared with you.</p>

        {!requested ? (
          <form onSubmit={handleJoin} className="flex flex-col gap-4">
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-center tracking-widest font-bold uppercase focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all"
              placeholder="e.g. XK4R9P"
              value={code}
              onChange={e => setCode(e.target.value)}
              maxLength={6}
            />

            <button
              type="submit"
              disabled={joining}
              className="bg-orange text-white font-bold py-2.5 rounded-lg shadow-md shadow-orange/20 hover:brightness-110 transition-all disabled:opacity-60"
            >
              {joining ? "Sending request…" : "Request to join"}
            </button>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
          </form>
        ) : (
          <div className="text-center">
            <p className="text-green-700 text-sm bg-green-50 border border-green-100 rounded-lg px-3 py-3">
              Request sent! The project creator needs to approve you before you can access it.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}