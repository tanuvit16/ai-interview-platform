
// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import API from "@/lib/api";
// import { getUser, logout } from "@/lib/auth";
// import Button from "@/components/ui/button";
// import Card from "@/components/ui/card";
// import Input from "@/components/ui/input";

// export default function DashboardPage() {
//   const router = useRouter();
//   const user = getUser();
//   const [interviews, setInterviews] = useState<any[]>([]);
//   const [showCreate, setShowCreate] = useState(false);
//   const [form, setForm] = useState({
//     title: "", job_role: "", candidate_email: "",
//     candidate_name: "", scheduled_date: "", scheduled_time: ""
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!user) { router.push("/login"); return; }
//     fetchInterviews();
//   }, []);

//   const fetchInterviews = async () => {
//     try {
//       const res = await API.get("/api/interviews/");
//       setInterviews(res.data);
//     } catch { router.push("/login"); }
//   };

//   const createInterview = async () => {
//     setLoading(true);
//     try {
//       await API.post("/api/interviews/", form);
//       setShowCreate(false);
//       setForm({ title: "", job_role: "", candidate_email: "", candidate_name: "", scheduled_date: "", scheduled_time: "" });
//       fetchInterviews();
//     } catch (e: any) {
//       alert(e.response?.data?.detail || "Failed to create interview");
//     } finally { setLoading(false); }
//   };

//   const statusColor: any = {
//     scheduled: "bg-yellow-900/40 text-yellow-400 border-yellow-700",
//     in_progress: "bg-blue-900/40 text-blue-400 border-blue-700",
//     completed: "bg-green-900/40 text-green-400 border-green-700",
//   };

//   const isRecruiter = user?.role === "recruiter";

//   return (
//     <div className="min-h-screen bg-gray-950 text-white">
//       <nav className="border-b border-gray-800 px-8 py-4 flex justify-between items-center">
//         <div>
//           <h1 className="text-xl font-bold">AI Interview Platform</h1>
//           <p className="text-gray-500 text-sm">
//             Welcome, {user?.full_name} ·{" "}
//             <span className={`capitalize font-medium ${isRecruiter ? "text-purple-400" : "text-blue-400"}`}>
//               {user?.role}
//             </span>
//           </p>
//         </div>
//         <Button variant="ghost" onClick={() => { logout(); router.push("/login"); }}>Logout</Button>
//       </nav>

//       <div className="max-w-5xl mx-auto px-8 py-10">

//         {/* ── RECRUITER PORTAL ── */}
//         {isRecruiter && (
//           <>
//             <div className="flex justify-between items-center mb-8">
//               <div>
//                 <h2 className="text-2xl font-semibold">Recruiter Dashboard</h2>
//                 <p className="text-gray-500 text-sm mt-1">Schedule and manage candidate interviews</p>
//               </div>
//               <Button onClick={() => setShowCreate(true)}>+ Schedule Interview</Button>
//             </div>

//             {showCreate && (
//               <Card className="mb-8">
//                 <h3 className="text-lg font-semibold mb-4">Schedule New Interview</h3>
//                 <div className="flex flex-col gap-4">
//                   <Input label="Interview Title" placeholder="e.g. Senior Frontend Developer" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
//                   <Input label="Job Role" placeholder="e.g. React Developer" value={form.job_role} onChange={e => setForm({ ...form, job_role: e.target.value })} />
//                   <Input label="Candidate Name" placeholder="e.g. John Doe" value={form.candidate_name} onChange={e => setForm({ ...form, candidate_name: e.target.value })} />
//                   <Input label="Candidate Email" type="email" placeholder="candidate@email.com" value={form.candidate_email} onChange={e => setForm({ ...form, candidate_email: e.target.value })} />
//                   <div className="grid grid-cols-2 gap-4">
//                     <Input label="Interview Date" type="date" value={form.scheduled_date} onChange={e => setForm({ ...form, scheduled_date: e.target.value })} />
//                     <Input label="Interview Time" type="time" value={form.scheduled_time} onChange={e => setForm({ ...form, scheduled_time: e.target.value })} />
//                   </div>
//                   <div className="flex gap-3 mt-2">
//                     <Button onClick={createInterview} loading={loading}>Schedule Interview</Button>
//                     <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
//                   </div>
//                 </div>
//               </Card>
//             )}

//             {interviews.length === 0 ? (
//               <Card className="text-center py-16">
//                 <p className="text-gray-500 text-lg">No interviews scheduled yet</p>
//                 <p className="text-gray-600 text-sm mt-2">Click "Schedule Interview" to get started</p>
//               </Card>
//             ) : (
//               <div className="flex flex-col gap-4">
//                 {interviews.map((interview) => (
//                   <Card key={interview.id} className="flex justify-between items-center">
//                     <div>
//                       <h3 className="font-semibold text-white text-lg">{interview.title}</h3>
//                       <p className="text-gray-400 text-sm mt-1">{interview.job_role} · {interview.candidate_name} · {interview.candidate_email}</p>
//                       {interview.scheduled_date && (
//                         <p className="text-blue-400 text-xs mt-1">
//                           📅 {interview.scheduled_date} at {interview.scheduled_time}
//                         </p>
//                       )}
//                       <p className="text-gray-600 text-xs mt-1">{new Date(interview.created_at).toLocaleDateString()}</p>
//                     </div>
//                     <div className="flex items-center gap-4">
//                       <span className={`text-xs px-3 py-1 rounded-full border ${statusColor[interview.status]}`}>
//                         {interview.status.replace("_", " ")}
//                       </span>
//                       {interview.status === "completed" && (
//                         <Button onClick={() => router.push(`/interview?id=${interview.id}`)}>
//                           View Report
//                         </Button>
//                       )}
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </>
//         )}

//         {/* ── CANDIDATE PORTAL ── */}
//         {!isRecruiter && (
//           <>
//             <div className="mb-8">
//               <h2 className="text-2xl font-semibold">Candidate Dashboard</h2>
//               <p className="text-gray-500 text-sm mt-1">Your scheduled interviews appear here</p>
//             </div>

//             {interviews.length === 0 ? (
//               <Card className="text-center py-16">
//                 <div className="text-5xl mb-4">📋</div>
//                 <p className="text-gray-500 text-lg">No interviews scheduled yet</p>
//                 <p className="text-gray-600 text-sm mt-2">Your recruiter will schedule an interview for you</p>
//               </Card>
//             ) : (
//               <div className="flex flex-col gap-4">
//                 {interviews.map((interview) => (
//                   <Card key={interview.id}>
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="font-semibold text-white text-lg">{interview.title}</h3>
//                         <p className="text-gray-400 text-sm mt-1">{interview.job_role}</p>
//                         {interview.scheduled_date && (
//                           <p className="text-blue-400 text-sm mt-2">
//                             📅 Scheduled: {interview.scheduled_date} at {interview.scheduled_time}
//                           </p>
//                         )}
//                         <p className="text-gray-600 text-xs mt-1">{new Date(interview.created_at).toLocaleDateString()}</p>
//                       </div>
//                       <div className="flex items-center gap-4">
//                         <span className={`text-xs px-3 py-1 rounded-full border ${statusColor[interview.status]}`}>
//                           {interview.status.replace("_", " ")}
//                         </span>
//                         {interview.status === "scheduled" && (
//                           <Button onClick={() => router.push(`/interview?id=${interview.id}`)}>
//                             Start Interview
//                           </Button>
//                         )}
//                         {interview.status === "in_progress" && (
//                           <Button onClick={() => router.push(`/interview?id=${interview.id}`)}>
//                             Continue Interview
//                           </Button>
//                         )}
//                         {interview.status === "completed" && (
//                           <Button variant="secondary" onClick={() => router.push(`/interview?id=${interview.id}`)}>
//                             View Result
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }




































// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import API from "@/lib/api";
// import { getUser, logout } from "@/lib/auth";
// import Button from "@/components/ui/button";
// import Card from "@/components/ui/card";
// import Input from "@/components/ui/input";

// export default function DashboardPage() {
//   const router = useRouter();
//   const user = getUser();
//   const [interviews, setInterviews] = useState<any[]>([]);
//   const [showCreate, setShowCreate] = useState(false);
//   const [form, setForm] = useState({
//     title: "", job_role: "", candidate_email: "",
//     candidate_name: "", scheduled_date: "", scheduled_time: ""
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!user) { router.push("/login"); return; }
//     fetchInterviews();
//   }, []);

//   const fetchInterviews = async () => {
//     try {
//       const res = await API.get("/api/interviews/");
//       setInterviews(res.data);
//     } catch { router.push("/login"); }
//   };

//   const createInterview = async () => {
//     setLoading(true);
//     try {
//       await API.post("/api/interviews/", form);
//       setShowCreate(false);
//       setForm({ title: "", job_role: "", candidate_email: "", candidate_name: "", scheduled_date: "", scheduled_time: "" });
//       fetchInterviews();
//     } catch (e: any) {
//       alert(e.response?.data?.detail || "Failed");
//     } finally { setLoading(false); }
//   };

//   const isRecruiter = user?.role === "recruiter";

//   const statusConfig: any = {
//     scheduled: { label: "Scheduled", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" },
//     in_progress: { label: "In Progress", color: "#6366f1", bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.2)" },
//     completed: { label: "Completed", color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" },
//   };

//   const stats = isRecruiter ? [
//     { label: "Total", value: interviews.length, icon: "📋" },
//     { label: "Scheduled", value: interviews.filter(i => i.status === "scheduled").length, icon: "📅" },
//     { label: "Completed", value: interviews.filter(i => i.status === "completed").length, icon: "✅" },
//   ] : [
//     { label: "Assigned", value: interviews.length, icon: "📋" },
//     { label: "Pending", value: interviews.filter(i => i.status === "scheduled").length, icon: "⏳" },
//     { label: "Done", value: interviews.filter(i => i.status === "completed").length, icon: "🏆" },
//   ];

//   return (
//     <div className="min-h-screen" style={{ background: 'var(--bg-base)', fontFamily: 'var(--font-body)' }}>

//       {/* Background glow */}
//       <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] opacity-[0.04] pointer-events-none"
//         style={{ background: 'radial-gradient(ellipse, #6366f1 0%, transparent 70%)' }} />

//       {/* Navbar */}
//       <nav className="sticky top-0 z-50 px-8 py-4"
//         style={{ background: 'rgba(8,11,20,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
//         <div className="max-w-6xl mx-auto flex justify-between items-center">
//           <div className="flex items-center gap-4">
//             <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
//               style={{ background: 'var(--accent)', boxShadow: '0 0 16px rgba(99,102,241,0.4)' }}>AI</div>
//             <span className="font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
//               InterviewAI
//             </span>
//             <div className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
//               style={{
//                 background: isRecruiter ? 'rgba(139,92,246,0.1)' : 'rgba(99,102,241,0.1)',
//                 border: `1px solid ${isRecruiter ? 'rgba(139,92,246,0.2)' : 'rgba(99,102,241,0.2)'}`,
//                 color: isRecruiter ? '#c4b5fd' : 'var(--accent-bright)'
//               }}>
//               <span>{isRecruiter ? "👔" : "🎯"}</span>
//               <span className="capitalize">{user?.role}</span>
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             <div className="hidden sm:block text-sm" style={{ color: 'var(--text-secondary)' }}>
//               {user?.full_name}
//             </div>
//             <Button variant="ghost" size="sm" onClick={() => { logout(); router.push("/login"); }}>
//               Sign out
//             </Button>
//           </div>
//         </div>
//       </nav>

//       <div className="max-w-6xl mx-auto px-8 py-10">

//         {/* Header */}
//         <div className="mb-10 animate-fade-up">
//           <h1 className="text-3xl font-bold mb-2"
//             style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
//             {isRecruiter ? "Recruiter Dashboard" : "My Interviews"}
//           </h1>
//           <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
//             {isRecruiter
//               ? "Schedule interviews and track candidate progress"
//               : "Your scheduled interviews and results"}
//           </p>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-3 gap-4 mb-8 stagger">
//           {stats.map(({ label, value, icon }) => (
//             <div key={label} className="rounded-2xl p-5 animate-fade-up"
//               style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
//               <div className="flex items-center justify-between mb-3">
//                 <span className="text-xl">{icon}</span>
//                 <span className="text-3xl font-bold"
//                   style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
//                   {value}
//                 </span>
//               </div>
//               <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{label}</div>
//             </div>
//           ))}
//         </div>

//         {/* ── RECRUITER PORTAL ── */}
//         {isRecruiter && (
//           <>
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
//                 Interviews ({interviews.length})
//               </h2>
//               {!showCreate && (
//                 <Button onClick={() => setShowCreate(true)} icon={<span>+</span>}>
//                   Schedule Interview
//                 </Button>
//               )}
//             </div>

//             {showCreate && (
//               <div className="mb-6 rounded-2xl p-6 animate-fade-up"
//                 style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-accent)' }}>
//                 <div className="flex items-center justify-between mb-6">
//                   <h3 className="font-semibold"
//                     style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
//                     Schedule New Interview
//                   </h3>
//                   <button onClick={() => setShowCreate(false)}
//                     className="w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-colors"
//                     style={{ color: 'var(--text-muted)' }}>✕</button>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4 mb-4">
//                   <Input label="Interview Title" placeholder="Senior React Developer"
//                     value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
//                   <Input label="Job Role" placeholder="React Developer"
//                     value={form.job_role} onChange={e => setForm({ ...form, job_role: e.target.value })} />
//                   <Input label="Candidate Name" placeholder="John Doe"
//                     value={form.candidate_name} onChange={e => setForm({ ...form, candidate_name: e.target.value })} />
//                   <Input label="Candidate Email" type="email" placeholder="candidate@email.com"
//                     value={form.candidate_email} onChange={e => setForm({ ...form, candidate_email: e.target.value })} />
//                   <Input label="Interview Date" type="date"
//                     value={form.scheduled_date} onChange={e => setForm({ ...form, scheduled_date: e.target.value })} />
//                   <Input label="Interview Time" type="time"
//                     value={form.scheduled_time} onChange={e => setForm({ ...form, scheduled_time: e.target.value })} />
//                 </div>
//                 <div className="flex gap-3">
//                   <Button onClick={createInterview} loading={loading}>Schedule Interview</Button>
//                   <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
//                 </div>
//               </div>
//             )}

//             {interviews.length === 0 ? (
//               <div className="rounded-2xl p-16 text-center"
//                 style={{ background: 'var(--bg-surface)', border: '1px dashed var(--border)' }}>
//                 <div className="text-4xl mb-4 animate-float">📋</div>
//                 <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No interviews yet</p>
//                 <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
//                   Schedule your first interview to get started
//                 </p>
//                 <Button onClick={() => setShowCreate(true)}>Schedule Interview</Button>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {interviews.map((interview) => {
//                   const sc = statusConfig[interview.status];
//                   return (
//                     <div key={interview.id}
//                       className="rounded-2xl p-5 flex items-center justify-between transition-all duration-200"
//                       style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
//                       onMouseEnter={e => (e.currentTarget.style.border = '1px solid var(--border-hover)')}
//                       onMouseLeave={e => (e.currentTarget.style.border = '1px solid var(--border)')}>
//                       <div className="flex items-center gap-4">
//                         <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
//                           style={{ background: 'var(--bg-elevated)' }}>💼</div>
//                         <div>
//                           <div className="font-semibold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>
//                             {interview.title}
//                           </div>
//                           <div className="text-xs flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
//                             <span>{interview.job_role}</span>
//                             <span>·</span>
//                             <span>{interview.candidate_name}</span>
//                             <span>·</span>
//                             <span>{interview.candidate_email}</span>
//                           </div>
//                           {interview.scheduled_date && (
//                             <div className="text-xs mt-1 flex items-center gap-1" style={{ color: 'var(--accent-bright)' }}>
//                               <span>📅</span>
//                               <span>{interview.scheduled_date} at {interview.scheduled_time}</span>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-3 shrink-0">
//                         <span className="text-xs px-3 py-1 rounded-full font-medium"
//                           style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}>
//                           {sc.label}
//                         </span>
//                         {interview.status === "completed" && (
//                           <Button size="sm" variant="secondary"
//                             onClick={() => router.push(`/interview?id=${interview.id}`)}>
//                             View Report
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </>
//         )}

//         {/* ── CANDIDATE PORTAL ── */}
//         {!isRecruiter && (
//           <>
//             <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
//               Your Interviews ({interviews.length})
//             </h2>

//             {interviews.length === 0 ? (
//               <div className="rounded-2xl p-16 text-center"
//                 style={{ background: 'var(--bg-surface)', border: '1px dashed var(--border)' }}>
//                 <div className="text-4xl mb-4 animate-float">🎯</div>
//                 <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>No interviews yet</p>
//                 <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
//                   Your recruiter will schedule an interview for you
//                 </p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {interviews.map((interview) => {
//                   const sc = statusConfig[interview.status];
//                   return (
//                     <div key={interview.id}
//                       className="rounded-2xl p-5 transition-all duration-200"
//                       style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
//                       onMouseEnter={e => (e.currentTarget.style.border = '1px solid var(--border-hover)')}
//                       onMouseLeave={e => (e.currentTarget.style.border = '1px solid var(--border)')}>
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-4">
//                           <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
//                             style={{ background: 'var(--bg-elevated)' }}>🎯</div>
//                           <div>
//                             <div className="font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
//                               {interview.title}
//                             </div>
//                             <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
//                               {interview.job_role}
//                             </div>
//                             {interview.scheduled_date && (
//                               <div className="text-xs mt-1.5 flex items-center gap-1.5 font-medium"
//                                 style={{ color: 'var(--accent-bright)' }}>
//                                 <span>📅</span>
//                                 <span>{interview.scheduled_date} · {interview.scheduled_time}</span>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <span className="text-xs px-3 py-1 rounded-full font-medium"
//                             style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}>
//                             {sc.label}
//                           </span>
//                           {interview.status === "scheduled" && (
//                             <Button onClick={() => router.push(`/interview?id=${interview.id}`)}>
//                               Start Interview →
//                             </Button>
//                           )}
//                           {interview.status === "in_progress" && (
//                             <Button onClick={() => router.push(`/interview?id=${interview.id}`)}>
//                               Continue →
//                             </Button>
//                           )}
//                           {interview.status === "completed" && (
//                             <Button variant="success" size="sm"
//                               onClick={() => router.push(`/interview?id=${interview.id}`)}>
//                               View Result
//                             </Button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }


























"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";
import { getUser, logout } from "@/lib/auth";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

export default function DashboardPage() {
  const router = useRouter();
  const user = getUser();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: "", job_role: "", candidate_email: "",
    candidate_name: "", scheduled_date: "", scheduled_time: ""
  });
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
      setForm({ title: "", job_role: "", candidate_email: "", candidate_name: "", scheduled_date: "", scheduled_time: "" });
      fetchInterviews();
    } catch (e: any) {
      alert(e.response?.data?.detail || "Failed");
    } finally { setLoading(false); }
  };

  const isRecruiter = user?.role === "recruiter";

  const S: Record<string, any> = {
    scheduled: { label: "Scheduled", color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)" },
    in_progress: { label: "In Progress", color: "#818cf8", bg: "rgba(129,140,248,0.08)", border: "rgba(129,140,248,0.2)" },
    completed: { label: "Completed", color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)" },
  };

  const stats = isRecruiter ? [
    { label: "Total Interviews", value: interviews.length, icon: "", color: "#818cf8" },
    { label: "Scheduled", value: interviews.filter(i => i.status === "scheduled").length, icon: "", color: "#fbbf24" },
    { label: "Completed", value: interviews.filter(i => i.status === "completed").length, icon: "", color: "#34d399" },
  ] : [
    { label: "Total Assigned", value: interviews.length, icon: "", color: "#818cf8" },
    { label: "Pending", value: interviews.filter(i => i.status === "scheduled").length, icon: "", color: "#fbbf24" },
    { label: "Completed", value: interviews.filter(i => i.status === "completed").length, icon: "", color: "#34d399" },
  ];

  const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";

  return (
    <div style={{ minHeight: '100vh', background: '#060a12', fontFamily: font, color: '#eef2ff' }}>

      {/* Background glow */}
      <div style={{
        position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '900px', height: '400px', pointerEvents: 'none',
        background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.05) 0%, transparent 60%)',
      }} />

      {/* ── Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: '64px',
        background: 'rgba(6,10,18,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '9px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: '12px',
            boxShadow: '0 0 16px rgba(99,102,241,0.35)',
          }}>AI</div>
          <span style={{ fontWeight: 600, fontSize: '16px', color: '#eef2ff' }}>InterviewAI</span>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
            background: isRecruiter ? 'rgba(139,92,246,0.1)' : 'rgba(99,102,241,0.1)',
            border: `1px solid ${isRecruiter ? 'rgba(139,92,246,0.25)' : 'rgba(99,102,241,0.25)'}`,
            color: isRecruiter ? '#c4b5fd' : '#a5b4fc',
          }}>
            <span>{isRecruiter ? '' : ''}</span>
            <span style={{ textTransform: 'capitalize' }}>{user?.role}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', color: '#8b95a8' }}>{user?.full_name}</span>
          <button onClick={() => { logout(); router.push("/login"); }}
            style={{
              padding: '6px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
              background: 'transparent', border: '1px solid rgba(255,255,255,0.08)',
              color: '#8b95a8', cursor: 'pointer', fontFamily: font,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.color = '#eef2ff';
              (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.color = '#8b95a8';
              (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
            }}>
            Sign out
          </button>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 40px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '32px', fontWeight: 700, color: '#eef2ff',
            marginBottom: '8px', letterSpacing: '-0.5px',
          }}>
            {isRecruiter ? 'Recruiter Dashboard' : 'My Interviews'}
          </h1>
          <p style={{ color: '#8b95a8', fontSize: '15px' }}>
            {isRecruiter
              ? 'Schedule interviews and track candidate progress'
              : 'Your scheduled interviews and results'}
          </p>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
          {stats.map(({ label, value, icon, color }) => (
            <div key={label} style={{
              padding: '24px', borderRadius: '16px',
              background: '#0c1018', border: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: '13px', color: '#8b95a8', marginBottom: '8px', fontWeight: 500 }}>{label}</div>
                <div style={{ fontSize: '36px', fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
              </div>
              <div style={{ fontSize: '32px', opacity: 0.6 }}>{icon}</div>
            </div>
          ))}
        </div>

        {/* ── RECRUITER VIEW ── */}
        {isRecruiter && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#eef2ff' }}>
                Interviews ({interviews.length})
              </h2>
              {!showCreate && (
                <button onClick={() => setShowCreate(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
                    background: '#6366f1', border: '1px solid rgba(99,102,241,0.6)',
                    color: 'white', cursor: 'pointer', fontFamily: font,
                    boxShadow: '0 0 20px rgba(99,102,241,0.25)',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#5558e8')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#6366f1')}>
                  <span>+</span> Schedule Interview
                </button>
              )}
            </div>

            {/* Create Form */}
            {showCreate && (
              <div style={{
                marginBottom: '24px', padding: '28px', borderRadius: '16px',
                background: '#0c1018', border: '1px solid rgba(99,102,241,0.3)',
                boxShadow: '0 0 40px rgba(99,102,241,0.06)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#eef2ff' }}>Schedule New Interview</h3>
                  <button onClick={() => setShowCreate(false)}
                    style={{
                      width: '32px', height: '32px', borderRadius: '8px', border: 'none',
                      background: 'rgba(255,255,255,0.05)', color: '#8b95a8',
                      cursor: 'pointer', fontSize: '16px', fontFamily: font,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>✕</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <Input label="Interview Title" placeholder="Senior React Developer"
                    value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                  <Input label="Job Role" placeholder="React Developer"
                    value={form.job_role} onChange={e => setForm({ ...form, job_role: e.target.value })} />
                  <Input label="Candidate Name" placeholder="John Doe"
                    value={form.candidate_name} onChange={e => setForm({ ...form, candidate_name: e.target.value })} />
                  <Input label="Candidate Email" type="email" placeholder="candidate@email.com"
                    value={form.candidate_email} onChange={e => setForm({ ...form, candidate_email: e.target.value })} />
                  <Input label="Interview Date" type="date"
                    value={form.scheduled_date} onChange={e => setForm({ ...form, scheduled_date: e.target.value })} />
                  <Input label="Interview Time" type="time"
                    value={form.scheduled_time} onChange={e => setForm({ ...form, scheduled_time: e.target.value })} />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={createInterview}
                    disabled={loading}
                    style={{
                      padding: '10px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
                      background: loading ? '#4a4e8a' : '#6366f1', border: 'none',
                      color: 'white', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: font,
                    }}>
                    {loading ? 'Scheduling...' : 'Schedule Interview'}
                  </button>
                  <button onClick={() => setShowCreate(false)}
                    style={{
                      padding: '10px 20px', borderRadius: '10px', fontSize: '14px',
                      background: 'transparent', border: '1px solid rgba(255,255,255,0.08)',
                      color: '#8b95a8', cursor: 'pointer', fontFamily: font,
                    }}>Cancel</button>
                </div>
              </div>
            )}

            {/* Interview List */}
            {interviews.length === 0 ? (
              <div style={{
                padding: '80px 40px', borderRadius: '16px', textAlign: 'center',
                background: '#0c1018', border: '1px dashed rgba(255,255,255,0.08)',
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                <p style={{ fontSize: '16px', fontWeight: 600, color: '#eef2ff', marginBottom: '8px' }}>No interviews yet</p>
                <p style={{ fontSize: '14px', color: '#4a5568', marginBottom: '24px' }}>Schedule your first interview to get started</p>
                <button onClick={() => setShowCreate(true)}
                  style={{
                    padding: '10px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
                    background: '#6366f1', border: 'none', color: 'white', cursor: 'pointer', fontFamily: font,
                  }}>Schedule Interview</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {interviews.map((interview) => {
                  const sc = S[interview.status] || S.scheduled;
                  return (
                    <div key={interview.id}
                      style={{
                        padding: '20px 24px', borderRadius: '14px',
                        background: '#0c1018', border: '1px solid rgba(255,255,255,0.07)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        transition: 'border-color 0.2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                          width: '44px', height: '44px', borderRadius: '12px',
                          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0,
                        }}>💼</div>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: 600, color: '#eef2ff', marginBottom: '4px' }}>
                            {interview.title}
                          </div>
                          <div style={{ fontSize: '13px', color: '#8b95a8', display: 'flex', gap: '8px' }}>
                            <span>{interview.job_role}</span>
                            <span>·</span>
                            <span>{interview.candidate_name}</span>
                            <span>·</span>
                            <span>{interview.candidate_email}</span>
                          </div>
                          {interview.scheduled_date && (
                            <div style={{ fontSize: '12px', color: '#a5b4fc', marginTop: '4px' }}>
                              📅 {interview.scheduled_date} at {interview.scheduled_time}
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                        <span style={{
                          padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
                          background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color,
                        }}>{sc.label}</span>
                        {interview.status === "completed" && (
                          <button onClick={() => router.push(`/interview?id=${interview.id}`)}
                            style={{
                              padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
                              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                              color: '#eef2ff', cursor: 'pointer', fontFamily: font,
                            }}>View Report</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── CANDIDATE VIEW ── */}
        {!isRecruiter && (
          <>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#eef2ff', marginBottom: '20px' }}>
              Your Interviews ({interviews.length})
            </h2>

            {interviews.length === 0 ? (
              <div style={{
                padding: '80px 40px', borderRadius: '16px', textAlign: 'center',
                background: '#0c1018', border: '1px dashed rgba(255,255,255,0.08)',
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
                <p style={{ fontSize: '16px', fontWeight: 600, color: '#eef2ff', marginBottom: '8px' }}>No interviews scheduled yet</p>
                <p style={{ fontSize: '14px', color: '#4a5568' }}>Your recruiter will schedule an interview for you</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {interviews.map((interview) => {
                  const sc = S[interview.status] || S.scheduled;
                  return (
                    <div key={interview.id}
                      style={{
                        padding: '24px', borderRadius: '14px',
                        background: '#0c1018', border: '1px solid rgba(255,255,255,0.07)',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        transition: 'border-color 0.2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                          width: '48px', height: '48px', borderRadius: '13px',
                          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
                        }}>🎯</div>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: 600, color: '#eef2ff', marginBottom: '4px' }}>
                            {interview.title}
                          </div>
                          <div style={{ fontSize: '13px', color: '#8b95a8', marginBottom: '4px' }}>
                            {interview.job_role}
                          </div>
                          {interview.scheduled_date && (
                            <div style={{ fontSize: '12px', color: '#a5b4fc', fontWeight: 500 }}>
                              📅 {interview.scheduled_date} · {interview.scheduled_time}
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
                          background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color,
                        }}>{sc.label}</span>
                        {interview.status === "scheduled" && (
                          <button onClick={() => router.push(`/interview?id=${interview.id}`)}
                            style={{
                              padding: '9px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
                              background: '#6366f1', border: '1px solid rgba(99,102,241,0.6)',
                              color: 'white', cursor: 'pointer', fontFamily: font,
                              boxShadow: '0 0 16px rgba(99,102,241,0.2)',
                            }}>Start Interview →</button>
                        )}
                        {interview.status === "in_progress" && (
                          <button onClick={() => router.push(`/interview?id=${interview.id}`)}
                            style={{
                              padding: '9px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
                              background: '#6366f1', border: 'none', color: 'white', cursor: 'pointer', fontFamily: font,
                            }}>Continue →</button>
                        )}
                        {interview.status === "completed" && (
                          <button onClick={() => router.push(`/interview?id=${interview.id}`)}
                            style={{
                              padding: '9px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 500,
                              background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)',
                              color: '#34d399', cursor: 'pointer', fontFamily: font,
                            }}>View Result</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}