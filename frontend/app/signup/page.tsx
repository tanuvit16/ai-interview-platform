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
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/api/auth/signup", form);
      saveAuth(res.data.access_token, res.data.user);
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.response?.data?.detail || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl p-8 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Create account</h1>
          <p className="text-gray-400 mt-1">Start interviewing smarter</p>
        </div>
        {error && <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-lg px-4 py-3 text-sm">{error}</div>}
        <div className="flex flex-col gap-4">
          <Input label="Full Name" placeholder="John Doe" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
          <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Input label="Password" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-400 font-medium">I am a</label>
            <select
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
            >
              <option value="recruiter">Recruiter</option>
              <option value="candidate">Candidate</option>
            </select>
          </div>
        </div>
        <Button onClick={handleSubmit} loading={loading} className="w-full py-3">Create Account</Button>
        <p className="text-gray-500 text-sm text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}