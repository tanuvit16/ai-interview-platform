// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import API from "@/lib/api";
// import { saveAuth } from "@/lib/auth";
// import Button from "@/components/ui/button";
// import Input from "@/components/ui/input";

// export default function LoginPage() {
//   const router = useRouter();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await API.post("/api/auth/login", form);
//       saveAuth(res.data.access_token, res.data.user);
//       router.push("/dashboard");
//     } catch (e: any) {
//       setError(e.response?.data?.detail || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-950 flex items-center justify-center">
//       <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl p-8 flex flex-col gap-6">
//         <div>
//           <h1 className="text-2xl font-bold text-white">Welcome back</h1>
//           <p className="text-gray-400 mt-1">Sign in to your account</p>
//         </div>
//         {error && <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-lg px-4 py-3 text-sm">{error}</div>}
//         <div className="flex flex-col gap-4">
//           <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
//           <Input label="Password" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
//         </div>
//         <Button onClick={handleSubmit} loading={loading} className="w-full py-3">Sign In</Button>
//         <p className="text-gray-500 text-sm text-center">
//           Don't have an account?{" "}
//           <Link href="/signup" className="text-blue-400 hover:underline">Sign up</Link>
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

// export default function LoginPage() {
//   const router = useRouter();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await API.post("/api/auth/login", form);
//       saveAuth(res.data.access_token, res.data.user);
//       router.push("/dashboard");
//     } catch (e: any) {
//       setError(e.response?.data?.detail || "Invalid credentials");
//     } finally { setLoading(false); }
//   };

//   return (
//     <div className="min-h-screen flex" style={{ background: 'var(--bg-base)', fontFamily: 'var(--font-body)' }}>

//       {/* Left branding panel */}
//       <div className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 p-12 relative overflow-hidden"
//         style={{ background: 'var(--bg-surface)', borderRight: '1px solid var(--border)' }}>
//         <div className="absolute inset-0 opacity-[0.03]"
//           style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
//         <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-10"
//           style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />

//         <div className="relative z-10">
//           <div className="flex items-center gap-3 mb-16">
//             <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
//               style={{ background: 'var(--accent)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>AI</div>
//             <span className="font-semibold text-lg" style={{ fontFamily: 'var(--font-display)' }}>InterviewAI</span>
//           </div>
//           <h1 className="text-4xl font-bold leading-tight mb-4" style={{ fontFamily: 'var(--font-display)' }}>
//             Hire smarter.<br />
//             <span style={{ color: 'var(--accent-bright)' }}>Interview faster.</span>
//           </h1>
//           <p style={{ color: 'var(--text-secondary)' }}>
//             AI-powered technical interviews with real-time proctoring, instant evaluation, and detailed hiring scorecards.
//           </p>
//         </div>

//         <div className="relative z-10 grid grid-cols-3 gap-4">
//           {[{ val: "20+", label: "Questions" }, { val: "AI", label: "Evaluation" }, { val: "PDF", label: "Scorecards" }].map(({ val, label }) => (
//             <div key={label} className="rounded-xl p-4" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
//               <div className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-bright)' }}>{val}</div>
//               <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</div>
//             </div>
//           ))}
//         </div>

//         <div className="relative z-10 rounded-xl p-4" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
//           <p className="text-sm italic mb-3" style={{ color: 'var(--text-secondary)' }}>
//             "This platform transformed our hiring process. We reduced interview time by 60%."
//           </p>
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--accent)' }}>T</div>
//             <div>
//               <div className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Tanu</div>
//               <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Cse Student</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Right form panel */}
//       <div className="flex-1 flex items-center justify-center p-8">
//         <div className="w-full max-w-sm animate-fade-up">
//           <div className="flex items-center gap-3 mb-10 lg:hidden">
//             <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: 'var(--accent)' }}>AI</div>
//             <span className="font-semibold text-lg" style={{ fontFamily: 'var(--font-display)' }}>InterviewAI</span>
//           </div>
//           <div className="mb-8">
//             <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>Welcome back</h2>
//             <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Sign in to your account to continue</p>
//           </div>
//           {error && (
//             <div className="mb-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm animate-fade-in"
//               style={{ background: 'var(--danger-glow)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}>
//               ⚠ {error}
//             </div>
//           )}
//           <div className="space-y-4 mb-6">
//             <Input label="Email address" type="email" placeholder="you@company.com"
//               value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
//               onKeyDown={e => e.key === "Enter" && handleSubmit()} />
//             <Input label="Password" type="password" placeholder="••••••••"
//               value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
//               onKeyDown={e => e.key === "Enter" && handleSubmit()} />
//           </div>
//           <Button onClick={handleSubmit} loading={loading} size="lg" className="w-full mb-6">
//             Sign in to your account
//           </Button>
//           <div className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
//             Don't have an account?{" "}
//             <Link href="/signup" className="font-medium" style={{ color: 'var(--accent-bright)' }}>Create one free</Link>
//           </div>
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

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError("Please fill in all fields"); return; }
    setLoading(true); setError("");
    try {
      const res = await API.post("/api/auth/login", form);
      saveAuth(res.data.access_token, res.data.user);
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.response?.data?.detail || "Invalid email or password");
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: '#060a12', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
    }}>

      {/* ── Left Panel ── */}
      <div style={{
        width: '460px', flexShrink: 0, padding: '48px',
        background: '#0c1018',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden',
      }} className="hidden lg:flex">

        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        {/* Glow */}
        <div style={{
          position: 'absolute', top: '30%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '360px', height: '360px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '64px' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: '13px',
              boxShadow: '0 0 20px rgba(99,102,241,0.35)',
            }}>AI</div>
            <span style={{ fontWeight: 600, fontSize: '17px', color: '#eef2ff', letterSpacing: '-0.3px' }}>
              InterviewAI
            </span>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h1 style={{
              fontSize: '36px', fontWeight: 700, lineHeight: 1.15,
              color: '#eef2ff', marginBottom: '16px', letterSpacing: '-0.5px',
            }}>
              Hire smarter.<br />
              <span style={{ color: '#a5b4fc' }}>Interview faster.</span>
            </h1>
            <p style={{ color: '#8b95a8', lineHeight: 1.7, fontSize: '15px' }}>
              AI-powered technical interviews with camera proctoring, live code editor, and instant PDF scorecards.
            </p>
          </div>

          {/* Feature chips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { icon: '', text: 'AI-generated questions per interview' },
              { icon: '', text: 'Live camera proctoring & tab detection' },
              { icon: '', text: 'Auto-generated PDF hiring scorecard' },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 16px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <span style={{ fontSize: '18px', flexShrink: 0 }}>{icon}</span>
                <span style={{ fontSize: '13px', color: '#8b95a8' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div style={{
          position: 'relative', zIndex: 1,
          padding: '20px', borderRadius: '14px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
            {[1,2,3,4,5].map(i => <span key={i} style={{ color: '#fbbf24', fontSize: '14px' }}>★</span>)}
          </div>
          <p style={{ fontSize: '14px', color: '#8b95a8', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '16px' }}>
            "This platform transformed our hiring. We cut interview time by 60% while improving candidate quality."
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 600, fontSize: '12px',
            }}>SC</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#eef2ff' }}>Sarah Chen</div>
              <div style={{ fontSize: '12px', color: '#4a5568' }}>Head of Engineering, Stripe</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 32px',
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }} className="animate-fade-up">

          {/* Mobile logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}
            className="flex lg:hidden">
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: '13px',
            }}>AI</div>
            <span style={{ fontWeight: 600, fontSize: '17px', color: '#eef2ff' }}>InterviewAI</span>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#eef2ff', marginBottom: '8px', letterSpacing: '-0.4px' }}>
              Welcome back
            </h2>
            <p style={{ color: '#8b95a8', fontSize: '14px' }}>Sign in to continue to your dashboard</p>
          </div>

          {error && (
            <div style={{
              marginBottom: '20px', padding: '12px 16px', borderRadius: '12px',
              background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
              color: '#fca5a5', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px',
            }} className="animate-fade-in">
              <span>⚠️</span> {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <Input label="Email address" type="email" placeholder="you@company.com"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            <Input label="Password" type="password" placeholder="Enter your password"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          </div>

          <Button onClick={handleSubmit} loading={loading} size="lg" className="w-full mb-6">
            Sign in to your account →
          </Button>

          <div style={{ textAlign: 'center', fontSize: '13px', color: '#4a5568' }}>
            Don't have an account?{' '}
            <Link href="/signup" style={{ color: '#a5b4fc', fontWeight: 500, textDecoration: 'none' }}>
              Create one free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

























































