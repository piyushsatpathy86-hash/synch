import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

export default function CreateProject() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [groupId, setGroupId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function generateCode() {
    return Math.random().toString(36).slice(2, 8).toUpperCase();
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;

    setCreating(true);
    setError("");

    const code = generateCode();

    const { data: group, error: groupError } = await supabase
      .from("groups")
      .insert({ name: name.trim(), join_code: code, created_by: user.id })
      .select()
      .single();

    if (groupError) {
      setError(groupError.message);
      setCreating(false);
      return;
    }

    const { error: memberError } = await supabase
      .from("group_members")
      .insert({ group_id: group.id, user_id: user.id });

    if (memberError) {
      setError(memberError.message);
      setCreating(false);
      return;
    }

    setJoinCode(group.join_code);
    setGroupId(group.id);
    setCreating(false);
  }

  function handleCopy() {
    navigator.clipboard.writeText(joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleGoToProject() {
    navigate(`/project/${groupId}`);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10 bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/60 p-8">
        <h1 className="text-2xl font-extrabold text-navy mb-6">Create a project</h1>

        {!joinCode ? (
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Project name</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all"
                placeholder="e.g. Smart Attendance App"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="bg-orange text-white font-bold py-2.5 rounded-lg mt-2 shadow-md shadow-orange/20 hover:brightness-110 transition-all disabled:opacity-60"
            >
              {creating ? "Creating…" : "Create project"}
            </button>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
          </form>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-gray-500 text-sm">Share this code with your teammates:</p>
            <div className="bg-orange/10 text-orange text-2xl font-extrabold tracking-widest px-6 py-3 rounded-xl">
              {joinCode}
            </div>
            <button
              onClick={handleCopy}
              className="text-sm font-semibold text-navy border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-all"
            >
              {copied ? "Copied!" : "Copy code"}
            </button>
            <button
              onClick={handleGoToProject}
              className="bg-orange text-white font-bold py-2.5 px-6 rounded-lg mt-2 shadow-md shadow-orange/20 hover:brightness-110 transition-all"
            >
              Go to project →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}