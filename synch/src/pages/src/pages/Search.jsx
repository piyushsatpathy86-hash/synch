import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    const { data, error } = await supabase.from("profiles").select("*");

    if (!error && data) {
      const term = query.trim().toLowerCase();
      const filtered = data.filter(profile =>
        (profile.skills || []).some(skill => skill.toLowerCase().includes(term))
      );
      setResults(filtered);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-10 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-navy">Find teammates</h1>
        <p className="text-gray-500 mt-1 mb-8">Search students by skill — React, DSA, ML, Design…</p>

        <form onSubmit={handleSearch} className="relative mb-8">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <input
            className="w-full border border-gray-200 rounded-xl py-3 pl-11 pr-28 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all"
            placeholder="Search by skill (e.g. React, DSA)"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 bg-orange text-white font-semibold text-sm px-4 rounded-lg hover:brightness-110 active:scale-95 transition-all"
          >
            Search
          </button>
        </form>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-gray-400">No students found with that skill yet.</p>
          </div>
        )}

        {!loading && !searched && (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-gray-400">Search for a skill above to find teammates.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map(profile => (
            <div
              key={profile.id}
              className="border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-orange/30 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-orange text-white flex items-center justify-center text-sm font-bold">
                    {profile.full_name?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-navy">{profile.full_name || "Unnamed student"}</h3>
                  <p className="text-gray-500 text-sm">{profile.college}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {(profile.skills || []).map((skill, i) => (
                  <span key={i} className="text-xs font-semibold bg-orange/10 text-orange px-2.5 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4 text-sm">
                  {profile.github && (
                    <a href={`https://github.com/${profile.github.replace(/^@/, "")}`} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-navy font-medium transition-colors">
                      GitHub
                    </a>
                  )}
                  {profile.instagram && (
                    <a href={`https://instagram.com/${profile.instagram.replace(/^@/, "")}`} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-navy font-medium transition-colors">
                      Instagram
                    </a>
                  )}
                </div>

                <Link
                  to={`/profile/${profile.id}`}
                  className="text-sm font-semibold text-orange hover:underline"
                >
                  View profile →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}