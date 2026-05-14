"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";
import { getUser, logout } from "@/lib/auth";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";

export default function DashboardPage() {
  const router = useRouter();
  const user = getUser();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", job_role: "", candidate_email: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await API.get("/api/interviews/");
      setInterviews(res.data);
    } catch { router.push("/login"); }
  };

  const createInterview = async () => {
    setLoading(true);
    try {
      await API.post("/api/interviews/", form);
      setShowCreate(false);
      setForm({ title: "", job_role: "", candidate_email: "" });
      fetchInterviews();
    } catch (e: any) {
      alert(e.response?.data?.detail || "Failed to create interview");
    } finally { setLoading(false); }
  };

  const statusColor: any = {
    scheduled: "bg-yellow-900/40 text-yellow-400 border-yellow-700",
    in_progress: "bg-blue-900/40 text-blue-400 border-blue-700",
    completed: "bg-green-900/40 text-green-400 border-green-700",
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">AI Interview Platform</h1>
          <p className="text-gray-500 text-sm">Welcome, {user?.full_name}</p>
        </div>
        <Button variant="ghost" onClick={() => { logout(); router.push("/login"); }}>Logout</Button>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Your Interviews</h2>
          <Button onClick={() => setShowCreate(true)}>+ New Interview</Button>
        </div>

        {showCreate && (
          <Card className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Create New Interview</h3>
            <div className="flex flex-col gap-4">
              <Input label="Interview Title" placeholder="e.g. Senior Frontend Developer" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <Input label="Job Role" placeholder="e.g. React Developer" value={form.job_role} onChange={e => setForm({ ...form, job_role: e.target.value })} />
              <Input label="Candidate Email" type="email" placeholder="candidate@email.com" value={form.candidate_email} onChange={e => setForm({ ...form, candidate_email: e.target.value })} />
              <div className="flex gap-3 mt-2">
                <Button onClick={createInterview} loading={loading}>Create Interview</Button>
                <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        )}

        {interviews.length === 0 ? (
          <Card className="text-center py-16">
            <p className="text-gray-500 text-lg">No interviews yet</p>
            <p className="text-gray-600 text-sm mt-2">Create your first interview to get started</p>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {interviews.map((interview) => (
              <Card key={interview.id} className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-white text-lg">{interview.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{interview.job_role} · {interview.candidate_email}</p>
                  <p className="text-gray-600 text-xs mt-1">{new Date(interview.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs px-3 py-1 rounded-full border ${statusColor[interview.status]}`}>
                    {interview.status.replace("_", " ")}
                  </span>
                  <Button onClick={() => router.push(`/interview?id=${interview.id}`)}>
                    {interview.status === "completed" ? "View Report" : "Open"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}