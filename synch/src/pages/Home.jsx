import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  async function fetchResources() {
    setLoading(true);
    const { data, error } = await supabase
      .from("resources")
      .select("*, profiles(full_name)")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (!error) setResources(data);
    setLoading(false);
  }

  async function handleDelete(resource) {
    const confirmDelete = window.confirm(`Delete "${resource.title}"? This can't be undone.`);
    if (!confirmDelete) return;

    const filePath = resource.file_url.split("/resources/")[1];
    if (filePath) {
      await supabase.storage.from("resources").remove([filePath]);
    }

    const { error } = await supabase.from("resources").delete().eq("id", resource.id);

    if (!error) {
      setResources(prev => prev.filter(r => r.id !== resource.id));
    } else {
      alert("Delete failed: " + error.message);
    }
  }

  function handleDownloadClick(e, fileUrl) {
    if (!user) {
      e.preventDefault();
      navigate("/signup");
      return;
    }
    // Logged in — let the default <a> behavior open it in a new tab
  }

  const filtered = resources.filter(r =>
    r.title?.toLowerCase().includes(search.toLowerCase()) ||
    r.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-10 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-wide text-orange mb-1">Resource library</p>
          <h1 className="text-3xl font-extrabold text-navy">Free study materials</h1>
          <p className="text-gray-500 mt-1">Notes, cheat sheets, and past papers shared by students</p>
        </div>

        <div className="relative mb-8">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <input
            className="w-full border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all"
            placeholder="Search by title or subject..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-36 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-gray-400">No resources found. Kindly upload one!</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(resource => (
            <div
              key={resource.id}
              className="border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-orange/30 transition-all duration-200 bg-white"
            >
              <span className="text-xs font-semibold bg-orange/10 text-orange px-2.5 py-1 rounded-full">
                {resource.subject || "General"}
              </span>
              <h3 className="text-lg font-bold text-navy mt-3">{resource.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{resource.description}</p>

              <div className="flex items-center justify-between mt-4">
                <a
                  href={resource.file_url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => handleDownloadClick(e, resource.file_url)}
                  className="inline-block bg-orange text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md shadow-orange/20 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
                >
                  Download
                </a>

                {user?.id === resource.uploaded_by && (
                  <button
                    onClick={() => handleDelete(resource)}
                    className="text-xs font-semibold text-red-600 border border-red-200 rounded-md px-3 py-1.5 hover:bg-red-50 transition-all"
                  >
                    Delete
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-400 mt-3">
                Uploaded by {resource.profiles?.full_name || "Unknown"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}