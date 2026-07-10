import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ViewProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  async function fetchProfile() {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      setNotFound(true);
    } else {
      setProfile(data);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-gray-400">Loading profile…</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-gray-400">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-start sm:items-center justify-center px-4 py-10 bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-lg bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/60 p-8">
        <div className="flex items-center gap-4 mb-6">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="avatar"
              className="w-16 h-16 rounded-full object-cover border border-gray-100"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-orange text-white flex items-center justify-center text-xl font-bold">
              {profile.full_name?.[0]?.toUpperCase() || "?"}
            </div>
          )}
          <div>
            <h1 className="text-xl font-extrabold text-navy">{profile.full_name || "Unnamed student"}</h1>
            <p className="text-gray-500 text-sm">{profile.college}</p>
          </div>
        </div>

        {profile.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {profile.skills.map((skill, i) => (
              <span key={i} className="text-xs font-semibold bg-orange/10 text-orange px-2.5 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2 text-sm">
          {profile.email_contact && (
            <a href={`mailto:${profile.email_contact}`} className="text-gray-600 hover:text-orange transition-colors">
              📧 {profile.email_contact}
            </a>
          )}
          {profile.github && (
            <a href={`https://github.com/${profile.github.replace(/^@/, "")}`} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-orange transition-colors">
              💻 GitHub
            </a>
          )}
          {profile.instagram && (
            <a href={`https://instagram.com/${profile.instagram.replace(/^@/, "")}`} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-orange transition-colors">
              📷 Instagram
            </a>
          )}
        </div>
      </div>
    </div>
  );
}