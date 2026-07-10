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
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Resource Library</h1>
      <p className="text-gray-500 mb-6">Free study materials shared by students</p>
      <input
        className="w-full border rounded-lg p-3 mb-8 shadow-sm"
        placeholder="Search by title or subject..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {loading && <p className="text-gray-400">Loading...</p>}
      {!loading && filtered.length === 0 && (
        <p className="text-gray-400">No Resources Found!! Kindly Upload It.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(resource => (
          <div key={resource.id} className="border rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              {resource.subject || "General"}
            </span>
            <h3 className="text-lg font-bold mt-2">{resource.title}</h3>
            <p className="text-gray-500 text-sm mt-1">{resource.description}</p>

            <div className="flex items-center justify-between mt-3">
              
              <a  href={resource.file_url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => handleDownloadClick(e, resource.file_url)}
                className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700"
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

            <p className="text-xs text-gray-400 mt-2">
              Uploaded by {resource.profiles?.full_name || "Unknown"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}