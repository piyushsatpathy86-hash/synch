import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function Upload() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleUpload() {
    if (!title || !file) return alert("Title aur file dono chahiye");
    setLoading(true);

    const fileName = `${Date.now()}_${file.name}`;
    const { error: storageError } = await supabase
      .storage.from("resources").upload(fileName, file, {
        contentType: file.type,
      });

    if (storageError) {
      alert("File upload failed: " + storageError.message);
      setLoading(false);
      return;
    }

    const { data: urlData } = supabase
      .storage.from("resources").getPublicUrl(fileName);

    const { error: dbError } = await supabase
      .from("resources")
      .insert({
        title,
        subject,
        description,
        file_url: urlData.publicUrl,
        uploaded_by: user.id,
        status: "pending"
      });

    if (dbError) {
      alert("DB error: " + dbError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setTitle("");
    setSubject("");
    setDescription("");
    setFile(null);
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-start sm:items-center justify-center px-4 py-10 bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-lg bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/60 p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-navy">Upload your resource</h2>
          <p className="text-gray-500 text-sm mt-1">
            Share notes, cheat sheets, or guides with other students
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Title</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all"
              placeholder="e.g. DSA Sheet - Arrays & Strings"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Subject</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all"
              placeholder="DSA, Web Dev, GATE..."
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Description</label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange transition-all min-h-[90px] resize-none"
              placeholder="Short description..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">File</label>
            <label
              htmlFor="file-upload"
              className="flex items-center justify-between gap-3 w-full border border-dashed border-gray-300 rounded-lg px-3 py-3 text-sm cursor-pointer hover:border-orange hover:bg-orange/5 transition-all"
            >
              <span className="text-gray-500 truncate">
                {file ? file.name : "Click to choose a file (PDF, PNG, JPG, DOCX)"}
              </span>
              <span className="text-orange font-semibold shrink-0">Browse</span>
            </label>
            <input
              id="file-upload"
              className="hidden"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.docx"
              onChange={e => setFile(e.target.files[0])}
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-orange text-white py-2.5 rounded-lg font-bold mt-2 shadow-md shadow-orange/20 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:hover:scale-100 disabled:hover:brightness-100"
          >
            {loading ? "Uploading…" : "Upload"}
          </button>
        </div>

        {success && (
          <p className="mt-4 text-green-700 text-sm bg-green-50 border border-green-100 rounded-lg px-3 py-2">
            Uploaded! Kindly wait for the admin's approval.
          </p>
        )}
      </div>
    </div>
  );
}