import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

const AVATAR_GRADIENTS = [
  "bg-gradient-to-br from-purple to-[#7B72E8]",
  "bg-gradient-to-br from-teal to-[#22C98A]",
  "bg-gradient-to-br from-orange to-[#FF8A5C]",
];

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
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-orange mb-3">Skill search</p>
        <h1 className="text-4xl font-extrabold tracking-[-1.5px] text-navy leading-[1.1]">Find teammates</h1>
        <p className="text-gray-mid text-[17px] leading-relaxed mt-2 mb-8 max-w-md">
          Search students by skill — React, DSA, ML, Design…
        </p>

        <form onSubmit={handleSearch} className="relative mb-8">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-mid"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          <input
            className="w-full border-[1.5px] border-orange rounded-lg py-3 pl-11 pr-28 text-sm shadow-[0_4px_24px_rgba(0,0,0,0.06)] focus:outline-none transition-all"
            placeholder="Search by skill (e.g. React, DSA)"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 bg-orange text-white font-semibold text-sm px-4 rounded-md hover:bg-orange-dark transition-all"
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
            <p className="text-gray-mid">No students found with that skill yet.</p>
          </div>
        )}

        {!loading && !searched && (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-gray-mid">Search for a skill above to find teammates.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((profile, i) => (
            <div
              key={profile.id}
              className="border border-gray-200 rounded-[10px] p-4 hover:border-orange transition-all duration-150"
            >
              <div className="flex items-center gap-3">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="avatar"
                    className="w-[42px] h-[42px] rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className={`w-[42px] h-[42px] rounded-full flex-shrink-0 text-white flex items-center justify-center text-[15px] font-bold ${AVATAR_GRADIENTS[i % 3]}`}>
                    {profile.full_name?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-bold text-navy">{profile.full_name || "Unnamed student"}</h3>
                  <p className="text-gray-mid text-xs mt-0.5">{profile.college}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-[5px] mt-2.5">
                {(profile.skills || []).map((skill, si) => (
                  <span key={si} className="text-[11px] font-semibold bg-purple-light text-purple px-2 py-0.5 rounded-[10px]">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3 text-xs">
                  {profile.github && (
                    <a href={`https://github.com/${profile.github.replace(/^@/, "")}`} target="_blank" rel="noreferrer" className="text-gray-mid hover:text-navy font-medium transition-colors">
                      GitHub
                    </a>
                  )}
                  {profile.instagram && (
                    <a href={`https://instagram.com/${profile.instagram.replace(/^@/, "")}`} target="_blank" rel="noreferrer" className="text-gray-mid hover:text-navy font-medium transition-colors">
                      Instagram
                    </a>
                  )}
                </div>

                <Link
                  to={`/profile/${profile.id}`}
                  className="text-xs font-semibold text-orange bg-orange/[0.08] border border-orange/20 px-3.5 py-1.5 rounded-md hover:bg-orange/[0.14] transition-all whitespace-nowrap"
                >
                  View profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}