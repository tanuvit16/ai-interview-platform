// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import API from "@/lib/api";
// import { saveAuth } from "@/lib/auth";
// import Button from "@/components/ui/button";
// import Input from "@/components/ui/input";

// export default function SignupPage() {
//   const router = useRouter();
//   const [form, setForm] = useState({ email: "", password: "", full_name: "", role: "recruiter" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await API.post("/api/auth/signup", form);
//       saveAuth(res.data.access_token, res.data.user);
//       router.push("/dashboard");
//     } catch (e: any) {
//       setError(e.response?.data?.detail || "Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-950 flex items-center justify-center">
//       <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl p-8 flex flex-col gap-6">
//         <div>
//           <h1 className="text-2xl font-bold text-white">Create account</h1>
//           <p className="text-gray-400 mt-1">Start interviewing smarter</p>
//         </div>
//         {error && <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-lg px-4 py-3 text-sm">{error}</div>}
//         <div className="flex flex-col gap-4">
//           <Input label="Full Name" placeholder="John Doe" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
//           <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
//           <Input label="Password" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
//           <div className="flex flex-col gap-1">
//             <label className="text-sm text-gray-400 font-medium">I am a</label>
//             <select
//               className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
//               value={form.role}
//               onChange={e => setForm({ ...form, role: e.target.value })}
//             >
//               <option value="recruiter">Recruiter</option>
//               <option value="candidate">Candidate</option>
//             </select>
//           </div>
//         </div>
//         <Button onClick={handleSubmit} loading={loading} className="w-full py-3">Create Account</Button>
//         <p className="text-gray-500 text-sm text-center">
//           Already have an account?{" "}
//           <Link href="/login" className="text-blue-400 hover:underline">Sign in</Link>
//         </p>
//       </div>
//     </div>
//   );
// }




























// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import API from "@/lib/api";
// import { saveAuth } from "@/lib/auth";
// import Button from "@/components/ui/button";
// import Input from "@/components/ui/input";

// export default function SignupPage() {
//   const router = useRouter();
//   const [form, setForm] = useState({ email: "", password: "", full_name: "", role: "recruiter" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await API.post("/api/auth/signup", form);
//       saveAuth(res.data.access_token, res.data.user);
//       router.push("/dashboard");
//     } catch (e: any) {
//       setError(e.response?.data?.detail || "Signup failed");
//     } finally { setLoading(false); }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-8"
//       style={{ background: 'var(--bg-base)', fontFamily: 'var(--font-body)' }}>
//       <div className="fixed top-0 right-0 w-[600px] h-[600px] rounded-full opacity-5 pointer-events-none"
//         style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />

//       <div className="w-full max-w-md animate-fade-up">
//         <div className="flex items-center gap-3 mb-10">
//           <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
//             style={{ background: 'var(--accent)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>AI</div>
//           <span className="font-semibold text-lg" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>InterviewAI</span>
//         </div>

//         <div className="rounded-2xl p-8" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
//           <div className="mb-8">
//             <h2 className="text-2xl font-bold mb-1.5" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
//               Create your account
//             </h2>
//             <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Start conducting AI-powered interviews today</p>
//           </div>

//           {error && (
//             <div className="mb-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm"
//               style={{ background: 'var(--danger-glow)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}>
//               ⚠ {error}
//             </div>
//           )}

//           <div className="space-y-4 mb-6">
//             <Input label="Full Name" placeholder="Jane Smith" value={form.full_name}
//               onChange={e => setForm({ ...form, full_name: e.target.value })} />
//             <Input label="Email address" type="email" placeholder="you@company.com" value={form.email}
//               onChange={e => setForm({ ...form, email: e.target.value })} />
//             <Input label="Password" type="password" placeholder="Create a strong password" value={form.password}
//               onChange={e => setForm({ ...form, password: e.target.value })} />

//             <div className="flex flex-col gap-1.5">
//               <label className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>I am a</label>
//               <div className="grid grid-cols-2 gap-2">
//                 {[
//                   { val: "recruiter", label: "Recruiter", desc: "Schedule & manage", icon: "👔" },
//                   { val: "candidate", label: "Candidate", desc: "Take interviews", icon: "🎯" },
//                 ].map(({ val, label, desc, icon }) => (
//                   <button key={val} onClick={() => setForm({ ...form, role: val })}
//                     className="flex flex-col items-start gap-1 rounded-xl p-3.5 text-left transition-all duration-200"
//                     style={{
//                       background: form.role === val ? 'var(--accent-glow)' : 'var(--bg-elevated)',
//                       border: `1px solid ${form.role === val ? 'var(--border-accent)' : 'var(--border)'}`,
//                     }}>
//                     <div className="text-lg">{icon}</div>
//                     <div className="text-sm font-semibold" style={{ color: form.role === val ? 'var(--accent-bright)' : 'var(--text-primary)' }}>{label}</div>
//                     <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{desc}</div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <Button onClick={handleSubmit} loading={loading} size="lg" className="w-full">Create account</Button>
//         </div>

//         <div className="text-center mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
//           Already have an account?{" "}
//           <Link href="/login" className="font-medium" style={{ color: 'var(--accent-bright)' }}>Sign in</Link>
//         </div>
//       </div>
//     </div>
//   );
// }




















"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import API from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", full_name: "", role: "recruiter" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.email || !form.password || !form.full_name) { setError("Please fill in all fields"); return; }
    setLoading(true); setError("");
    try {
      const res = await API.post("/api/auth/signup", form);
      saveAuth(res.data.access_token, res.data.user);
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.response?.data?.detail || "Signup failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '48px 24px', background: '#060a12',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Background effects */}
      <div style={{
        position: 'fixed', top: '-100px', right: '-100px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-100px', left: '-100px',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }} className="animate-fade-up">

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '11px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: '14px',
            boxShadow: '0 0 24px rgba(99,102,241,0.35)',
          }}>AI</div>
          <span style={{ fontWeight: 600, fontSize: '18px', color: '#eef2ff', letterSpacing: '-0.3px' }}>
            InterviewAI
          </span>
        </div>

        {/* Card */}
        <div style={{
          background: '#0c1018', borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.07)',
          padding: '36px', marginBottom: '20px',
          boxShadow: '0 4px 32px rgba(0,0,0,0.4)',
        }}>
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#eef2ff', marginBottom: '6px', letterSpacing: '-0.4px' }}>
              Create your account
            </h2>
            <p style={{ color: '#8b95a8', fontSize: '14px' }}>
              Start with AI-powered interviews in minutes
            </p>
          </div>

          {error && (
            <div style={{
              marginBottom: '20px', padding: '12px 16px', borderRadius: '12px',
              background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
              color: '#fca5a5', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span>⚠️</span> {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <Input label="Full name" placeholder="Jane Smith" value={form.full_name}
              onChange={e => setForm({ ...form, full_name: e.target.value })} />
            <Input label="Email address" type="email" placeholder="you@company.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
            <Input label="Password" type="password" placeholder="Create a strong password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} />

            {/* Role picker */}
            <div>
              <div style={{
                fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: '#4a5568', marginBottom: '8px',
              }}>I am joining as</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { val: "recruiter", emoji: "👔", label: "Recruiter", sub: "Schedule & review" },
                  { val: "candidate", emoji: "🎯", label: "Candidate", sub: "Take interviews" },
                ].map(({ val, emoji, label, sub }) => (
                  <button key={val} onClick={() => setForm({ ...form, role: val })}
                    style={{
                      padding: '14px 16px', borderRadius: '12px', textAlign: 'left', cursor: 'pointer',
                      background: form.role === val ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${form.role === val ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)'}`,
                      transition: 'all 0.15s ease', outline: 'none', fontFamily: 'inherit',
                    }}>
                    <div style={{ fontSize: '20px', marginBottom: '6px' }}>{emoji}</div>
                    <div style={{
                      fontSize: '13px', fontWeight: 600, marginBottom: '2px',
                      color: form.role === val ? '#a5b4fc' : '#eef2ff',
                    }}>{label}</div>
                    <div style={{ fontSize: '11px', color: '#4a5568' }}>{sub}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button onClick={handleSubmit} loading={loading} size="lg" className="w-full">
            Create account →
          </Button>
        </div>

        <div style={{ textAlign: 'center', fontSize: '13px', color: '#4a5568' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#a5b4fc', fontWeight: 500, textDecoration: 'none' }}>
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
}