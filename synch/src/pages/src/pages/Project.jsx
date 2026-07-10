import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import confetti from "canvas-confetti";

export default function Project() {
  const { id } = useParams();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskTitle, setTaskTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [adding, setAdding] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [copied, setCopied] = useState(false);
  const hasCelebrated = useRef(false);

  const isCreator = group?.created_by === user?.id;

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  async function fetchProjectData() {
    setLoading(true);

    const { data: groupData } = await supabase
      .from("groups")
      .select("*")
      .eq("id", id)
      .single();
    setGroup(groupData);

    const { data: memberRows } = await supabase
      .from("group_members")
      .select("user_id, profiles(id, full_name, avatar_url)")
      .eq("group_id", id);
    setMembers(memberRows?.map(m => m.profiles) || []);

    const { data: taskRows } = await supabase
      .from("tasks")
      .select("*, profiles!tasks_assigned_to_fkey(full_name)")
      .eq("group_id", id)
      .order("created_at", { ascending: true });
    setTasks(taskRows || []);

    if (groupData?.created_by === user.id) {
      const { data: requests } = await supabase
        .from("join_requests")
        .select("id, user_id, profiles(full_name, avatar_url)")
        .eq("group_id", id)
        .eq("status", "pending");
      setPendingRequests(requests || []);
    }

    setLoading(false);
  }

  async function handleAddTask(e) {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    setAdding(true);

    const { error } = await supabase.from("tasks").insert({
      group_id: id,
      title: taskTitle.trim(),
      assigned_to: assignedTo || null,
      created_by: user.id,
    });

    if (!error) {
      setTaskTitle("");
      setAssignedTo("");
      hasCelebrated.current = false;
      fetchProjectData();
    }
    setAdding(false);
  }

  async function moveTask(task, newStatus) {
    await supabase.from("tasks").update({ status: newStatus }).eq("id", task.id);
    fetchProjectData();
  }

  function handleCopyCode() {
    navigator.clipboard.writeText(group.join_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function acceptRequest(request) {
    await supabase.from("group_members").insert({
      group_id: id,
      user_id: request.user_id,
    });
    await supabase.from("join_requests").update({ status: "accepted" }).eq("id", request.id);
    fetchProjectData();
  }

  async function rejectRequest(request) {
    await supabase.from("join_requests").update({ status: "rejected" }).eq("id", request.id);
    fetchProjectData();
  }

  const doneCount = tasks.filter(t => t.status === "done").length;
  const progress = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  useEffect(() => {
    if (progress === 100 && tasks.length > 0 && !hasCelebrated.current) {
      hasCelebrated.current = true;
      setShowCelebration(true);

      const duration = 2500;
      const end = Date.now() + duration;

      (function frame() {
        confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 } });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();

      const timer = setTimeout(() => setShowCelebration(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [progress, tasks.length]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-gray-400">Loading project…</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-gray-400">Project not found.</p>
      </div>
    );
  }

  const columns = [
    { key: "todo", label: "To Do", dot: "bg-red-500" },
    { key: "inprogress", label: "In Progress", dot: "bg-yellow-500 animate-pulse" },
    { key: "done", label: "Done", dot: "bg-green-500" },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] px-4 py-10 bg-gradient-to-b from-white to-gray-50">
      {showCelebration && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white border border-orange/30 shadow-2xl rounded-2xl px-8 py-5 text-center animate-bounce">
          <p className="text-2xl font-extrabold text-orange">🎉 Congratulations! 🎉</p>
          <p className="text-sm text-gray-500 mt-1">All tasks completed for {group.name}</p>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-navy">{group.name}</h1>

        {/* Members */}
        <div className="flex items-center gap-2 mt-3">
          {members.map(m => (
            <div key={m.id} title={m.full_name} className="w-8 h-8 rounded-full overflow-hidden border border-white shadow-sm">
              {m.avatar_url ? (
                <img src={m.avatar_url} alt={m.full_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-orange text-white flex items-center justify-center text-xs font-bold">
                  {m.full_name?.[0]?.toUpperCase() || "?"}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Join code bar */}
        <div className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 mt-4 shadow-sm">
          <div>
            <p className="text-xs text-gray-400">Join code</p>
            <p className="text-lg font-extrabold text-navy tracking-widest">{group.join_code}</p>
          </div>
          <button
            onClick={handleCopyCode}
            className="text-sm font-semibold text-orange border border-orange/30 rounded-lg px-4 py-2 hover:bg-orange/10 transition-all"
          >
            {copied ? "Copied!" : "Copy code"}
          </button>
        </div>

        {/* Pending join requests — creator only */}
        {isCreator && pendingRequests.length > 0 && (
          <div className="bg-white border border-orange/30 rounded-xl p-4 mt-4 shadow-sm">
            <h3 className="text-sm font-bold text-navy mb-3">
              Pending requests ({pendingRequests.length})
            </h3>
            <div className="flex flex-col gap-2">
              {pendingRequests.map(req => (
                <div key={req.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    {req.profiles?.avatar_url ? (
                      <img src={req.profiles.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-orange text-white flex items-center justify-center text-xs font-bold">
                        {req.profiles?.full_name?.[0]?.toUpperCase() || "?"}
                      </div>
                    )}
                    <p className="text-sm font-semibold text-navy">{req.profiles?.full_name || "Unknown"}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => acceptRequest(req)}
                      className="text-xs font-semibold text-green-700 border border-green-200 rounded-md px-3 py-1.5 hover:bg-green-50 transition-all"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => rejectRequest(req)}
                      className="text-xs font-semibold text-red-600 border border-red-200 rounded-md px-3 py-1.5 hover:bg-red-50 transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div className="mt-4 mb-8">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-orange h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Add task form */}
        <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-2 mb-8">
          <input
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange"
            placeholder="New task title"
            value={taskTitle}
            onChange={e => setTaskTitle(e.target.value)}
          />
          <select
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
            value={assignedTo}
            onChange={e => setAssignedTo(e.target.value)}
          >
            <option value="">Unassigned</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.full_name}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={adding}
            className="bg-orange text-white font-bold px-5 py-2.5 rounded-lg hover:brightness-110 transition-all disabled:opacity-60"
          >
            {adding ? "Adding…" : "Add task"}
          </button>
        </form>

        {/* Task board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map(col => (
            <div key={col.key} className="bg-gray-50 rounded-xl p-4">
              <h3 className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${col.dot}`} />
                {col.label}
              </h3>
              <div className="flex flex-col gap-2">
                {tasks.filter(t => t.status === col.key).map(task => (
                  <div
                    key={task.id}
                    className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-all"
                  >
                    <p className="text-sm font-semibold text-navy">{task.title}</p>
                    <p className="text-xs text-gray-400 mt-1 mb-2">
                      {task.profiles?.full_name || "Unassigned"}
                    </p>

                    <div className="flex gap-1.5 flex-wrap">
                      {task.status === "todo" && (
                        <button
                          onClick={() => moveTask(task, "inprogress")}
                          className="text-xs font-semibold text-orange border border-orange/30 rounded-md px-2 py-1 hover:bg-orange/10 transition-all"
                        >
                          Start →
                        </button>
                      )}

                      {task.status === "inprogress" && (
                        <>
                          <button
                            onClick={() => moveTask(task, "todo")}
                            className="text-xs font-semibold text-gray-500 border border-gray-200 rounded-md px-2 py-1 hover:bg-gray-50 transition-all"
                          >
                            ← To Do
                          </button>
                          <button
                            onClick={() => moveTask(task, "done")}
                            className="text-xs font-semibold text-green-700 border border-green-200 rounded-md px-2 py-1 hover:bg-green-50 transition-all"
                          >
                            Mark Done ✓
                          </button>
                        </>
                      )}

                      {task.status === "done" && (
                        <button
                          onClick={() => moveTask(task, "inprogress")}
                          className="text-xs font-semibold text-gray-500 border border-gray-200 rounded-md px-2 py-1 hover:bg-gray-50 transition-all"
                        >
                          ↺ Undo
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {tasks.filter(t => t.status === col.key).length === 0 && (
                  <p className="text-xs text-gray-300 italic">No tasks</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}