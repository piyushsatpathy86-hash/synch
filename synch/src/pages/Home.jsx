import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Home() {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  async function fetchResources() {
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("status", "approved");

    if (!error) setResources(data);
    setLoading(false);
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
            <a href={resource.file_url} target="_blank" rel="noreferrer" className="mt-3 inline-block bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700">
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}