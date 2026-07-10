import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

export default function MyProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

  async function fetchProjects() {
    setLoading(true);

    const { data: memberRows } = await supabase
      .from("group_members")
      .select("groups(id, name, join_code, created_by, created_at)")
      .eq("user_id", user.id);

    const list = (memberRows || [])
      .map(m => m.groups)
      .filter(Boolean)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setProjects(list);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-gray-400">Loading your projects…</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-10 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-navy">My Projects</h1>
          <div className="flex gap-2">
            <Link
              to="/create-project"
              className="text-sm font-semibold bg-orange text-white px-4 py-2 rounded-lg hover:brightness-110 transition-all"
            >
              + Create
            </Link>
            <Link
              to="/join-project"
              className="text-sm font-semibold border border-gray-200 text-navy px-4 py-2 rounded-lg hover:bg-gray-50 transition-all"
            >
              Join
            </Link>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-gray-400">You haven't joined or created any projects yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(p => (
              <Link
                key={p.id}
                to={`/project/${p.id}`}
                className="border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-orange/30 transition-all duration-200 bg-white"
              >
                <h3 className="text-lg font-bold text-navy">{p.name}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  {p.created_by === user.id ? "Created by you" : "Joined project"}
                </p>
                <p className="text-xs text-gray-400 mt-2 tracking-widest font-semibold">
                  Code: {p.join_code}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}