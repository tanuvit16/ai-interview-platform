"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";
import { getUser, logout } from "@/lib/auth";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: "", job_role: "", candidate_email: "",
    candidate_name: "", scheduled_date: "", scheduled_time: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push("/login"); return; }
    setUser(u);
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

  if (!user) return null;

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


























// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import API from "@/lib/api";
// import { getUser, logout } from "@/lib/auth";
// import Button from "@/components/ui/button";
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

//   const S: Record<string, any> = {
//     scheduled: { label: "Scheduled", color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)" },
//     in_progress: { label: "In Progress", color: "#818cf8", bg: "rgba(129,140,248,0.08)", border: "rgba(129,140,248,0.2)" },
//     completed: { label: "Completed", color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)" },
//   };

//   const stats = isRecruiter ? [
//     { label: "Total Interviews", value: interviews.length, icon: "", color: "#818cf8" },
//     { label: "Scheduled", value: interviews.filter(i => i.status === "scheduled").length, icon: "", color: "#fbbf24" },
//     { label: "Completed", value: interviews.filter(i => i.status === "completed").length, icon: "", color: "#34d399" },
//   ] : [
//     { label: "Total Assigned", value: interviews.length, icon: "", color: "#818cf8" },
//     { label: "Pending", value: interviews.filter(i => i.status === "scheduled").length, icon: "", color: "#fbbf24" },
//     { label: "Completed", value: interviews.filter(i => i.status === "completed").length, icon: "", color: "#34d399" },
//   ];

//   const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";

//   return (
//     <div style={{ minHeight: '100vh', background: '#060a12', fontFamily: font, color: '#eef2ff' }}>

//       {/* Background glow */}
//       <div style={{
//         position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
//         width: '900px', height: '400px', pointerEvents: 'none',
//         background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.05) 0%, transparent 60%)',
//       }} />

//       {/* ── Navbar ── */}
//       <nav style={{
//         position: 'sticky', top: 0, zIndex: 50,
//         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//         padding: '0 40px', height: '64px',
//         background: 'rgba(6,10,18,0.85)', backdropFilter: 'blur(20px)',
//         borderBottom: '1px solid rgba(255,255,255,0.06)',
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//           <div style={{
//             width: '34px', height: '34px', borderRadius: '9px',
//             background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             color: 'white', fontWeight: 700, fontSize: '12px',
//             boxShadow: '0 0 16px rgba(99,102,241,0.35)',
//           }}>AI</div>
//           <span style={{ fontWeight: 600, fontSize: '16px', color: '#eef2ff' }}>InterviewAI</span>
//           <div style={{
//             display: 'flex', alignItems: 'center', gap: '6px',
//             padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
//             background: isRecruiter ? 'rgba(139,92,246,0.1)' : 'rgba(99,102,241,0.1)',
//             border: `1px solid ${isRecruiter ? 'rgba(139,92,246,0.25)' : 'rgba(99,102,241,0.25)'}`,
//             color: isRecruiter ? '#c4b5fd' : '#a5b4fc',
//           }}>
//             <span>{isRecruiter ? '' : ''}</span>
//             <span style={{ textTransform: 'capitalize' }}>{user?.role}</span>
//           </div>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//           <span style={{ fontSize: '14px', color: '#8b95a8' }}>{user?.full_name}</span>
//           <button onClick={() => { logout(); router.push("/login"); }}
//             style={{
//               padding: '6px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
//               background: 'transparent', border: '1px solid rgba(255,255,255,0.08)',
//               color: '#8b95a8', cursor: 'pointer', fontFamily: font,
//               transition: 'all 0.15s',
//             }}
//             onMouseEnter={e => {
//               (e.target as HTMLElement).style.color = '#eef2ff';
//               (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
//             }}
//             onMouseLeave={e => {
//               (e.target as HTMLElement).style.color = '#8b95a8';
//               (e.target as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
//             }}>
//             Sign out
//           </button>
//         </div>
//       </nav>

//       {/* ── Main Content ── */}
//       <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 40px' }}>

//         {/* Header */}
//         <div style={{ marginBottom: '40px' }}>
//           <h1 style={{
//             fontSize: '32px', fontWeight: 700, color: '#eef2ff',
//             marginBottom: '8px', letterSpacing: '-0.5px',
//           }}>
//             {isRecruiter ? 'Recruiter Dashboard' : 'My Interviews'}
//           </h1>
//           <p style={{ color: '#8b95a8', fontSize: '15px' }}>
//             {isRecruiter
//               ? 'Schedule interviews and track candidate progress'
//               : 'Your scheduled interviews and results'}
//           </p>
//         </div>

//         {/* Stats Row */}
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
//           {stats.map(({ label, value, icon, color }) => (
//             <div key={label} style={{
//               padding: '24px', borderRadius: '16px',
//               background: '#0c1018', border: '1px solid rgba(255,255,255,0.07)',
//               display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//             }}>
//               <div>
//                 <div style={{ fontSize: '13px', color: '#8b95a8', marginBottom: '8px', fontWeight: 500 }}>{label}</div>
//                 <div style={{ fontSize: '36px', fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
//               </div>
//               <div style={{ fontSize: '32px', opacity: 0.6 }}>{icon}</div>
//             </div>
//           ))}
//         </div>

//         {/* ── RECRUITER VIEW ── */}
//         {isRecruiter && (
//           <>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
//               <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#eef2ff' }}>
//                 Interviews ({interviews.length})
//               </h2>
//               {!showCreate && (
//                 <button onClick={() => setShowCreate(true)}
//                   style={{
//                     display: 'flex', alignItems: 'center', gap: '8px',
//                     padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
//                     background: '#6366f1', border: '1px solid rgba(99,102,241,0.6)',
//                     color: 'white', cursor: 'pointer', fontFamily: font,
//                     boxShadow: '0 0 20px rgba(99,102,241,0.25)',
//                     transition: 'all 0.15s',
//                   }}
//                   onMouseEnter={e => (e.currentTarget.style.background = '#5558e8')}
//                   onMouseLeave={e => (e.currentTarget.style.background = '#6366f1')}>
//                   <span>+</span> Schedule Interview
//                 </button>
//               )}
//             </div>

//             {/* Create Form */}
//             {showCreate && (
//               <div style={{
//                 marginBottom: '24px', padding: '28px', borderRadius: '16px',
//                 background: '#0c1018', border: '1px solid rgba(99,102,241,0.3)',
//                 boxShadow: '0 0 40px rgba(99,102,241,0.06)',
//               }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
//                   <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#eef2ff' }}>Schedule New Interview</h3>
//                   <button onClick={() => setShowCreate(false)}
//                     style={{
//                       width: '32px', height: '32px', borderRadius: '8px', border: 'none',
//                       background: 'rgba(255,255,255,0.05)', color: '#8b95a8',
//                       cursor: 'pointer', fontSize: '16px', fontFamily: font,
//                       display: 'flex', alignItems: 'center', justifyContent: 'center',
//                     }}>✕</button>
//                 </div>
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
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
//                 <div style={{ display: 'flex', gap: '12px' }}>
//                   <button onClick={createInterview}
//                     disabled={loading}
//                     style={{
//                       padding: '10px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
//                       background: loading ? '#4a4e8a' : '#6366f1', border: 'none',
//                       color: 'white', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: font,
//                     }}>
//                     {loading ? 'Scheduling...' : 'Schedule Interview'}
//                   </button>
//                   <button onClick={() => setShowCreate(false)}
//                     style={{
//                       padding: '10px 20px', borderRadius: '10px', fontSize: '14px',
//                       background: 'transparent', border: '1px solid rgba(255,255,255,0.08)',
//                       color: '#8b95a8', cursor: 'pointer', fontFamily: font,
//                     }}>Cancel</button>
//                 </div>
//               </div>
//             )}

//             {/* Interview List */}
//             {interviews.length === 0 ? (
//               <div style={{
//                 padding: '80px 40px', borderRadius: '16px', textAlign: 'center',
//                 background: '#0c1018', border: '1px dashed rgba(255,255,255,0.08)',
//               }}>
//                 <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
//                 <p style={{ fontSize: '16px', fontWeight: 600, color: '#eef2ff', marginBottom: '8px' }}>No interviews yet</p>
//                 <p style={{ fontSize: '14px', color: '#4a5568', marginBottom: '24px' }}>Schedule your first interview to get started</p>
//                 <button onClick={() => setShowCreate(true)}
//                   style={{
//                     padding: '10px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
//                     background: '#6366f1', border: 'none', color: 'white', cursor: 'pointer', fontFamily: font,
//                   }}>Schedule Interview</button>
//               </div>
//             ) : (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//                 {interviews.map((interview) => {
//                   const sc = S[interview.status] || S.scheduled;
//                   return (
//                     <div key={interview.id}
//                       style={{
//                         padding: '20px 24px', borderRadius: '14px',
//                         background: '#0c1018', border: '1px solid rgba(255,255,255,0.07)',
//                         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                         transition: 'border-color 0.2s',
//                       }}
//                       onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)')}
//                       onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//                         <div style={{
//                           width: '44px', height: '44px', borderRadius: '12px',
//                           background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
//                           display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0,
//                         }}>💼</div>
//                         <div>
//                           <div style={{ fontSize: '15px', fontWeight: 600, color: '#eef2ff', marginBottom: '4px' }}>
//                             {interview.title}
//                           </div>
//                           <div style={{ fontSize: '13px', color: '#8b95a8', display: 'flex', gap: '8px' }}>
//                             <span>{interview.job_role}</span>
//                             <span>·</span>
//                             <span>{interview.candidate_name}</span>
//                             <span>·</span>
//                             <span>{interview.candidate_email}</span>
//                           </div>
//                           {interview.scheduled_date && (
//                             <div style={{ fontSize: '12px', color: '#a5b4fc', marginTop: '4px' }}>
//                               📅 {interview.scheduled_date} at {interview.scheduled_time}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
//                         <span style={{
//                           padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
//                           background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color,
//                         }}>{sc.label}</span>
//                         {interview.status === "completed" && (
//                           <button onClick={() => router.push(`/interview?id=${interview.id}`)}
//                             style={{
//                               padding: '7px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
//                               background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
//                               color: '#eef2ff', cursor: 'pointer', fontFamily: font,
//                             }}>View Report</button>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </>
//         )}

//         {/* ── CANDIDATE VIEW ── */}
//         {!isRecruiter && (
//           <>
//             <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#eef2ff', marginBottom: '20px' }}>
//               Your Interviews ({interviews.length})
//             </h2>

//             {interviews.length === 0 ? (
//               <div style={{
//                 padding: '80px 40px', borderRadius: '16px', textAlign: 'center',
//                 background: '#0c1018', border: '1px dashed rgba(255,255,255,0.08)',
//               }}>
//                 <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
//                 <p style={{ fontSize: '16px', fontWeight: 600, color: '#eef2ff', marginBottom: '8px' }}>No interviews scheduled yet</p>
//                 <p style={{ fontSize: '14px', color: '#4a5568' }}>Your recruiter will schedule an interview for you</p>
//               </div>
//             ) : (
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//                 {interviews.map((interview) => {
//                   const sc = S[interview.status] || S.scheduled;
//                   return (
//                     <div key={interview.id}
//                       style={{
//                         padding: '24px', borderRadius: '14px',
//                         background: '#0c1018', border: '1px solid rgba(255,255,255,0.07)',
//                         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                         transition: 'border-color 0.2s',
//                       }}
//                       onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)')}
//                       onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//                         <div style={{
//                           width: '48px', height: '48px', borderRadius: '13px',
//                           background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
//                           display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
//                         }}>🎯</div>
//                         <div>
//                           <div style={{ fontSize: '16px', fontWeight: 600, color: '#eef2ff', marginBottom: '4px' }}>
//                             {interview.title}
//                           </div>
//                           <div style={{ fontSize: '13px', color: '#8b95a8', marginBottom: '4px' }}>
//                             {interview.job_role}
//                           </div>
//                           {interview.scheduled_date && (
//                             <div style={{ fontSize: '12px', color: '#a5b4fc', fontWeight: 500 }}>
//                               📅 {interview.scheduled_date} · {interview.scheduled_time}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//                         <span style={{
//                           padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
//                           background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color,
//                         }}>{sc.label}</span>
//                         {interview.status === "scheduled" && (
//                           <button onClick={() => router.push(`/interview?id=${interview.id}`)}
//                             style={{
//                               padding: '9px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
//                               background: '#6366f1', border: '1px solid rgba(99,102,241,0.6)',
//                               color: 'white', cursor: 'pointer', fontFamily: font,
//                               boxShadow: '0 0 16px rgba(99,102,241,0.2)',
//                             }}>Start Interview →</button>
//                         )}
//                         {interview.status === "in_progress" && (
//                           <button onClick={() => router.push(`/interview?id=${interview.id}`)}
//                             style={{
//                               padding: '9px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
//                               background: '#6366f1', border: 'none', color: 'white', cursor: 'pointer', fontFamily: font,
//                             }}>Continue →</button>
//                         )}
//                         {interview.status === "completed" && (
//                           <button onClick={() => router.push(`/interview?id=${interview.id}`)}
//                             style={{
//                               padding: '9px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 500,
//                               background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)',
//                               color: '#34d399', cursor: 'pointer', fontFamily: font,
//                             }}>View Result</button>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </>
//         )}
//       </main>
//     </div>
//   );
// }