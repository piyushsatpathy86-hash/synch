import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

export default function Profile() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [college, setCollege] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [github, setGithub] = useState("");
  const [instagram, setInstagram] = useState("");
  const [emailContact, setEmailContact] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  async function fetchProfile() {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!fetchError && data) {
      setFullName(data.full_name || "");
      setCollege(data.college || "");
      setSkillsInput((data.skills || []).join(", "));
      setGithub(data.github || "");
      setInstagram(data.instagram || "");
      setEmailContact(data.email_contact || "");
      setAvatarUrl(data.avatar_url || "");
    }
    setLoading(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const skillsArray = skillsInput
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    let finalAvatarUrl = avatarUrl;

    if (avatarFile) {
      const filePath = `${user.id}/${avatarFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, { upsert: true });

      if (uploadError) {
        setError(uploadError.message);
        setSaving(false);
        return;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      finalAvatarUrl = data.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        college,
        skills: skillsArray,
        github,
        instagram,
        email_contact: emailContact,
        avatar_url: finalAvatarUrl,
      })
      .eq("id", user.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    setAvatarUrl(finalAvatarUrl);
    setMessage("Profile updated successfully!");
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <p className="text-gray-400">Loading your profile…</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-start sm:items-center justify-center px-4 py-10 bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-lg bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/60 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-navy">Your profile</h1>
          <p className="text-gray-500 text-sm mt-1">Logged in as {user?.email}</p>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Profile photo</label>
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-14 h-14 rounded-full object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-orange text-white flex items-center justify-center text-lg font-bold">
                  {fullName?.[0]?.toUpperCase() || "?"}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={e => setAvatarFile(e.target.files[0])}
                className="text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Full name</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all"
              placeholder="Your name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">College</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all"
              placeholder="e.g. IIT Bhubaneswar"
              value={college}
              onChange={e => setCollege(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">
              Skills <span className="font-normal text-gray-400">(comma separated)</span>
            </label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all"
              placeholder="React, DSA, Figma, ML"
              value={skillsInput}
              onChange={e => setSkillsInput(e.target.value)}
            />
            {skillsInput.trim() && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {skillsInput.split(",").map(s => s.trim()).filter(Boolean).map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold bg-orange/10 text-orange px-2.5 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">GitHub</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all"
              placeholder="github.com/username"
              value={github}
              onChange={e => setGithub(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Instagram</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all"
              placeholder="@username"
              value={instagram}
              onChange={e => setInstagram(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Contact email</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all"
              placeholder="you@college.edu"
              value={emailContact}
              onChange={e => setEmailContact(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-orange text-white font-bold py-2.5 rounded-lg mt-2 shadow-md shadow-orange/20 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:hover:scale-100 disabled:hover:brightness-100"
          >
            {saving ? "Saving…" : "Save changes"}
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