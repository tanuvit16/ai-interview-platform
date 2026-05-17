// "use client";
// import { useEffect, useState, useRef } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import dynamic from "next/dynamic";
// import API from "@/lib/api";

// const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

// const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";

// function Timer({ totalSeconds, onExpire }: { totalSeconds: number; onExpire: () => void }) {
//   const [remaining, setRemaining] = useState(totalSeconds);
//   const ref = useRef<any>();
//   useEffect(() => {
//     ref.current = setInterval(() => {
//       setRemaining(r => {
//         if (r <= 1) { clearInterval(ref.current); onExpire(); return 0; }
//         return r - 1;
//       });
//     }, 1000);
//     return () => clearInterval(ref.current);
//   }, []);
//   const h = Math.floor(remaining / 3600);
//   const m = Math.floor((remaining % 3600) / 60);
//   const s = remaining % 60;
//   const pad = (n: number) => String(n).padStart(2, '0');
//   const isLow = remaining < 600;
//   return (
//     <div style={{
//       display: 'flex', alignItems: 'center', gap: '10px',
//       padding: '8px 16px', borderRadius: '10px',
//       background: isLow ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.04)',
//       border: `1px solid ${isLow ? 'rgba(248,113,113,0.3)' : 'rgba(255,255,255,0.08)'}`,
//     }}>
//       <span>⏱</span>
//       <div>
//         <div style={{ fontSize: '18px', fontWeight: 700, color: isLow ? '#f87171' : '#eef2ff', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.05em' }}>
//           {h > 0 && `${pad(h)}:`}{pad(m)}:{pad(s)}
//         </div>
//         <div style={{ height: '3px', width: '100px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', marginTop: '3px' }}>
//           <div style={{ height: '100%', borderRadius: '2px', width: `${(remaining / totalSeconds) * 100}%`, transition: 'width 1s linear', background: isLow ? '#f87171' : '#6366f1' }} />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function InterviewPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const interviewId = searchParams.get("id");

//   const [interview, setInterview] = useState<any>(null);
//   const [questions, setQuestions] = useState<any[]>([]);
//   const [currentIdx, setCurrentIdx] = useState(0);
//   const [code, setCode] = useState("// Write your solution here\n");
//   const [transcript, setTranscript] = useState("");
//   const [feedback, setFeedback] = useState<any>(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [generating, setGenerating] = useState(false);
//   const [recording, setRecording] = useState(false);
//   const [tabWarnings, setTabWarnings] = useState(0);
//   const [disqualified, setDisqualified] = useState(false);
//   const [report, setReport] = useState<any>(null);
//   const [generatingReport, setGeneratingReport] = useState(false);
//   const [cameraActive, setCameraActive] = useState(false);
//   const [cameraError, setCameraError] = useState("");
//   const [started, setStarted] = useState(false);
//   const [notStartedYet, setNotStartedYet] = useState(false);
//   const [timeExpired, setTimeExpired] = useState(false);
//   const [alreadyAttempted, setAlreadyAttempted] = useState(false);

//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const streamRef = useRef<MediaStream | null>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const chunksRef = useRef<Blob[]>([]);
//   const tabWarningsRef = useRef(0);
//   const startedRef = useRef(false);

//   useEffect(() => {
//     if (!interviewId) { router.push("/dashboard"); return; }
//     loadInterview();
//     // const handleVisibility = () => {
//     //   if (document.hidden && startedRef.current) {
//     //     const newCount = tabWarningsRef.current + 1;
//     //     tabWarningsRef.current = newCount;
//     //     setTabWarnings(newCount);
//     //     if (newCount >= 3) { setDisqualified(true); stopCamera(); }
//     //   }
//     // };



//     const handleVisibility = () => {
//   if (document.hidden && startedRef.current) {
//     const newCount = tabWarningsRef.current + 1;
//     tabWarningsRef.current = newCount;
//     setTabWarnings(newCount);
//     if (newCount >= 3) {
//       setDisqualified(true);
//       stopCamera();
//       // Lock permanently in backend
//       API.patch(`/api/interviews/${interviewId}/disqualify`).catch(() => {});
//     }
//   }
// };
//     document.addEventListener("visibilitychange", handleVisibility);
//     return () => { document.removeEventListener("visibilitychange", handleVisibility); stopCamera(); };
//   }, []);

//   // const loadInterview = async () => {
//   //   try {
//   //     const res = await API.get(`/api/interviews/${interviewId}`);
//   //     setInterview(res.data);
//   //     if (res.data.status === "completed") {
//   //       setAlreadyAttempted(true);
//   //       try {
//   //         const r = await API.get(`/api/reports/${interviewId}`);
//   //         setReport(r.data);
//   //       } catch {}
//   //       return;
//   //     }
//   //     const qRes = await API.get(`/api/questions/${interviewId}`);
//   //     if (qRes.data.length > 0) setQuestions(qRes.data);
//   //   } catch { router.push("/dashboard"); }
//   // };




//   // const loadInterview = async () => {
//   // try {
//   //   const res = await API.get(`/api/interviews/${interviewId}`);
//   //   setInterview(res.data);
//   //   if (res.data.status === "completed") {
//   //     setAlreadyAttempted(true);
//   //     try {
//   //       const r = await API.get(`/api/reports/${interviewId}`);
//   //       setReport(r.data);
//   //     } catch {}
//   //     return;
//   //   }



//   const loadInterview = async () => {
//   try {
//     const res = await API.get(`/api/interviews/${interviewId}`);
//     setInterview(res.data);

//     // ONE ATTEMPT — block if completed OR disqualified
//     if (res.data.status === "completed") {
//       setAlreadyAttempted(true);
//       if (res.data.is_disqualified === "true") {
//         setDisqualified(true);
//         return;
//       }
//       try {
//         const r = await API.get(`/api/reports/${interviewId}`);
//         setReport(r.data);
//       } catch {}
//       return;
//     }

//     const qRes = await API.get(`/api/questions/${interviewId}`);
//     if (qRes.data.length > 0) {
//       setQuestions(qRes.data);
//       if (res.data.status === "in_progress") {
//         setStarted(true);
//         startedRef.current = true;
//         await startCamera();
//       }
//     }
//   } catch { router.push("/dashboard"); }
// };
//     const qRes = await API.get(`/api/questions/${interviewId}`);
//     if (qRes.data.length > 0) {
//       setQuestions(qRes.data);
//       // If questions exist and interview is in progress, resume
//       if (res.data.status === "in_progress") {
//         setStarted(true);
//         startedRef.current = true;
//         await startCamera();
//       }
//     }
//   } catch { router.push("/dashboard"); }
// };

//   // const checkSchedule = (iv: any) => {
//   //   if (!iv?.scheduled_date || !iv?.scheduled_time) return true;
//   //   return new Date() >= new Date(`${iv.scheduled_date}T${iv.scheduled_time}`);
//   // };











//   const checkSchedule = (iv: any) => {
//   if (!iv?.scheduled_date || !iv?.scheduled_time) return true;
//   const scheduled = new Date(`${iv.scheduled_date}T${iv.scheduled_time}:00`);
//   const now = new Date();
//   console.log("Scheduled:", scheduled, "Now:", now, "Allow:", now >= scheduled);
//   return now >= scheduled;
// };

//   // const startCamera = async () => {
//   //   try {
//   //     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//   //     streamRef.current = stream;
//   //     if (videoRef.current) videoRef.current.srcObject = stream;
//   //     setCameraActive(true);
//   //   } catch { setCameraError("Camera denied — proctoring limited"); }
//   // };


// // const startCamera = async () => {
// //   try {
// //     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
// //     streamRef.current = stream;
// //     setCameraActive(true);
// //     // Wait for video element to be in DOM then assign
// //     setTimeout(() => {
// //       if (videoRef.current) {
// //         videoRef.current.srcObject = stream;
// //       }
// //     }, 500);
// //   } catch { setCameraError("Camera denied — proctoring limited"); }
// // };


// const startCamera = async () => {
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     streamRef.current = stream;
//     setCameraActive(true);
//     // Try multiple times to assign stream to video element
//     const tryAssign = (attempts: number) => {
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       } else if (attempts > 0) {
//         setTimeout(() => tryAssign(attempts - 1), 300);
//       }
//     };
//     setTimeout(() => tryAssign(10), 200);
//   } catch { setCameraError("Camera denied — proctoring limited"); }
// };

//   const stopCamera = () => {
//     streamRef.current?.getTracks().forEach(t => t.stop());
//     streamRef.current = null;
//     setCameraActive(false);
//   };

//   // const generateQuestions = async () => {
//   //   if (!checkSchedule(interview)) { setNotStartedYet(true); return; }
//   //   setGenerating(true);
//   //   try {
//   //     await startCamera();
//   //     await API.patch(`/api/interviews/${interviewId}/start`);
//   //     const res = await API.post(`/api/questions/generate/${interviewId}`, {
//   //       job_role: interview.job_role, num_coding: 8, num_technical: 8, num_hr: 4,
//   //     });





//   const generateQuestions = async () => {
//   if (!checkSchedule(interview)) {
//     setNotStartedYet(true);
//     return;
//   }
//   setGenerating(true);
//   try {
//     await startCamera();
//     await API.patch(`/api/interviews/${interviewId}/start`);
//     const res = await API.post(`/api/questions/generate/${interviewId}`, {
//       job_role: interview.job_role, num_coding: 8, num_technical: 8, num_hr: 4,
//     });
//     setQuestions(res.data);
//     setCurrentIdx(0);
//     setFeedback(null);
//     setStarted(true);
//     startedRef.current = true;
//   } catch (e) {
//     console.error(e);
//   } finally { setGenerating(false); }
// };
//       setQuestions(res.data);
//       setCurrentIdx(0);
//       setFeedback(null);
//       setStarted(true);
//       startedRef.current = true;
//     } finally { setGenerating(false); }
//   };

// //   useEffect(() => {
// //   if (cameraActive && streamRef.current && videoRef.current) {
// //     videoRef.current.srcObject = streamRef.current;
// //   }
// // }, [cameraActive]);
// useEffect(() => {
//   if (cameraActive && streamRef.current && videoRef.current) {
//     videoRef.current.srcObject = streamRef.current;
//   }
// }, [cameraActive]);

//   const handleTimeExpire = async () => {
//     setTimeExpired(true);
//     stopCamera();
//     try {
//       await API.patch(`/api/interviews/${interviewId}/end`);
//       const res = await API.post(`/api/reports/generate/${interviewId}`);
//       setReport(res.data);
//     } catch {}
//   };

//   // const submitAnswer = async () => {
//   //   const q = questions[currentIdx];
//   //   if (!q) return;
//   //   setSubmitting(true); setFeedback(null);
//   //   try {
//   //     const res = await API.post("/api/questions/answer", {
//   //       question_id: q.id,
//   //       transcript: q.question_type !== "coding" ? transcript : null,
//   //       code: q.question_type === "coding" ? code : null,
//   //     });
//   //     setFeedback(res.data);
//   //   } finally { setSubmitting(false); }
//   // };


//   const submitAnswer = async () => {
//   const q = questions[currentIdx];
//   if (!q) return;
  
//   const answerText = q.question_type === "coding" ? code : transcript;
//   if (!answerText || answerText.trim() === "" || answerText.trim() === "// Write your solution here") {
//     alert("Please write your answer before submitting.");
//     return;
//   }
  
//   setSubmitting(true); setFeedback(null);
//   try {
//     const res = await API.post("/api/questions/answer", {
//       question_id: q.id,
//       transcript: q.question_type !== "coding" ? transcript : null,
//       code: q.question_type === "coding" ? code : null,
//     });
//     setFeedback(res.data);
//   } catch (e: any) {
//     alert(e.response?.data?.detail || "Failed to submit answer");
//   } finally { setSubmitting(false); }
// };

//   const nextQuestion = () => {
//     setCurrentIdx(i => i + 1);
//     setFeedback(null);
//     setTranscript("");
//     setCode("// Write your solution here\n");
//   };

//   const generateReport = async () => {
//     setGeneratingReport(true);
//     stopCamera();
//     try {
//       await API.patch(`/api/interviews/${interviewId}/end`);
//       const res = await API.post(`/api/reports/generate/${interviewId}`);
//       setReport(res.data);
//     } finally { setGeneratingReport(false); }
//   };

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mr = new MediaRecorder(stream);
//       chunksRef.current = [];
//       mr.ondataavailable = e => chunksRef.current.push(e.data);
//       mr.onstop = async () => {
//         const blob = new Blob(chunksRef.current, { type: "audio/webm" });
//         const fd = new FormData();
//         fd.append("audio", blob, "audio.webm");
//         try {
//           const res = await API.post("/api/questions/transcribe", fd, { headers: { "Content-Type": "multipart/form-data" } });
//           setTranscript(res.data.transcript);
//         } catch {}
//       };
//       mr.start();
//       mediaRecorderRef.current = mr;
//       setRecording(true);
//     } catch { alert("Microphone access denied"); }
//   };

//   const stopRecording = () => { mediaRecorderRef.current?.stop(); setRecording(false); };
  

//   const currentQ = questions[currentIdx];
//   const isLast = currentIdx === questions.length - 1;

//   // Loading
//   if (!interview) return (
//     <div style={{ minHeight: '100vh', background: '#060a12', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font }}>
//       <div style={{ textAlign: 'center' }}>
//         <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
//         <p style={{ color: '#8b95a8' }}>Loading...</p>
//       </div>
//       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//     </div>
//   );

//   // Already attempted (show report if exists)
//   if (alreadyAttempted && !report) return (
//     <div style={{ minHeight: '100vh', background: '#060a12', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font }}>
//       <div style={{ maxWidth: '460px', textAlign: 'center', padding: '40px' }}>
//         <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔒</div>
//         <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#eef2ff', marginBottom: '12px' }}>Already Attempted</h2>
//         <p style={{ color: '#8b95a8', fontSize: '15px', marginBottom: '28px', lineHeight: 1.7 }}>
//           You have already completed this interview. Only <strong style={{ color: '#f87171' }}>one attempt</strong> is allowed per interview.
//         </p>
//         <button onClick={() => router.push("/dashboard")}
//           style={{ padding: '12px 28px', borderRadius: '10px', background: '#6366f1', border: 'none', color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: font }}>
//           Back to Dashboard
//         </button>
//       </div>
//     </div>
//   );

//   // Not started yet
//   if (notStartedYet) return (
//     <div style={{ minHeight: '100vh', background: '#060a12', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font, padding: '24px' }}>
//       <div style={{ maxWidth: '480px', width: '100%', background: '#0c1018', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '20px', padding: '48px 40px', textAlign: 'center', boxShadow: '0 0 60px rgba(251,191,36,0.05)' }}>
//         <div style={{ fontSize: '56px', marginBottom: '20px' }}>⏰</div>
//         <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#eef2ff', marginBottom: '12px' }}>Interview Not Started Yet</h2>
//         <p style={{ color: '#8b95a8', fontSize: '14px', marginBottom: '20px', lineHeight: 1.7 }}>This interview is scheduled for:</p>
//         <div style={{ padding: '16px 24px', borderRadius: '12px', marginBottom: '28px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
//           <div style={{ fontSize: '20px', fontWeight: 700, color: '#fbbf24' }}>
//             📅 {interview.scheduled_date} at {interview.scheduled_time}
//           </div>
//         </div>
//         <p style={{ color: '#4a5568', fontSize: '13px', marginBottom: '24px' }}>Please return at the scheduled time to take your interview.</p>
//         <button onClick={() => router.push("/dashboard")}
//           style={{ padding: '12px 28px', borderRadius: '10px', background: '#6366f1', border: 'none', color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: font }}>
//           Back to Dashboard
//         </button>
//       </div>
//     </div>
//   );

//   // Disqualified
//   if (disqualified) return (
//     <div style={{ minHeight: '100vh', background: '#060a12', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font, padding: '24px' }}>
//       <div style={{ maxWidth: '480px', width: '100%', background: '#0c1018', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '20px', padding: '48px 40px', textAlign: 'center' }}>
//         <div style={{ fontSize: '56px', marginBottom: '20px' }}>🚫</div>
//         <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f87171', marginBottom: '12px' }}>Disqualified</h2>
//         <p style={{ color: '#8b95a8', fontSize: '15px', lineHeight: 1.7, marginBottom: '20px' }}>
//           You switched tabs <strong style={{ color: '#f87171' }}>3 times</strong>, violating the proctoring policy. Your interview has been terminated.
//         </p>
//         <div style={{ padding: '14px', borderRadius: '10px', marginBottom: '28px', background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)', fontSize: '13px', color: '#fca5a5' }}>
//           Tab switches detected: {tabWarnings}/3
//         </div>
//         <button onClick={() => router.push("/dashboard")}
//           style={{ padding: '12px 28px', borderRadius: '10px', background: '#ef4444', border: 'none', color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: font }}>
//           Exit Interview
//         </button>
//       </div>
//     </div>
//   );

//   // Time expired
//   if (timeExpired && !report) return (
//     <div style={{ minHeight: '100vh', background: '#060a12', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font }}>
//       <div style={{ textAlign: 'center', padding: '40px' }}>
//         <div style={{ fontSize: '64px', marginBottom: '24px' }}>⌛</div>
//         <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#eef2ff', marginBottom: '12px' }}>Time's Up!</h2>
//         <p style={{ color: '#8b95a8', marginBottom: '24px' }}>Generating your report based on submitted answers...</p>
//         <div style={{ width: '36px', height: '36px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', margin: '0 auto', animation: 'spin 0.8s linear infinite' }} />
//       </div>
//       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//     </div>
//   );

//   // Report
//   if (report) return (
//     <div style={{ minHeight: '100vh', background: '#060a12', fontFamily: font, padding: '48px 24px' }}>
//       <div style={{ maxWidth: '720px', margin: '0 auto' }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
//           <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '12px' }}>AI</div>
//           <span style={{ fontWeight: 600, fontSize: '16px', color: '#eef2ff' }}>InterviewAI</span>
//         </div>
//         <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#eef2ff', marginBottom: '6px' }}>Interview Complete 🎉</h1>
//         <p style={{ color: '#8b95a8', marginBottom: '28px' }}>{interview?.title}</p>

//         <div style={{ padding: '28px', borderRadius: '16px', marginBottom: '16px', background: '#0c1018', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <div>
//             <div style={{ fontSize: '13px', color: '#8b95a8', marginBottom: '8px' }}>Overall Score</div>
//             <div style={{ fontSize: '52px', fontWeight: 800, color: '#eef2ff', letterSpacing: '-1px', lineHeight: 1 }}>
//               {report.total_score}<span style={{ fontSize: '22px', color: '#4a5568', fontWeight: 400 }}>/10</span>
//             </div>
//           </div>
//           <div style={{
//             padding: '10px 20px', borderRadius: '30px', fontSize: '14px', fontWeight: 600,
//             ...(report.recommendation === "Strong Hire" ? { background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399' }
//               : report.recommendation === "Hire" ? { background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8' }
//               : report.recommendation === "Maybe" ? { background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24' }
//               : { background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171' })
//           }}>{report.recommendation}</div>
//         </div>

//         {[
//           { label: 'Summary', content: report.summary, color: '#eef2ff' },
//           { label: '✓ Strengths', content: report.strengths, color: '#34d399' },
//           { label: '✗ Areas to Improve', content: report.weaknesses, color: '#f87171' },
//         ].map(({ label, content, color }) => (
//           <div key={label} style={{ padding: '20px 24px', borderRadius: '14px', marginBottom: '12px', background: '#0c1018', border: '1px solid rgba(255,255,255,0.07)' }}>
//             <div style={{ fontSize: '13px', fontWeight: 600, color, marginBottom: '10px' }}>{label}</div>
//             <p style={{ color: '#8b95a8', fontSize: '14px', lineHeight: 1.75 }}>{content}</p>
//           </div>
//         ))}

//         <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
//           <button onClick={() => router.push("/dashboard")}
//             style={{ padding: '12px 24px', borderRadius: '10px', background: '#6366f1', border: 'none', color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: font }}>
//             Back to Dashboard
//           </button>
//           <button onClick={async () => {
//             const token = localStorage.getItem('token');
//             const res = await fetch(`http://localhost:8000/api/reports/download/${interviewId}`, { headers: { Authorization: `Bearer ${token}` } });
//             const blob = await res.blob();
//             const url = window.URL.createObjectURL(blob);
//             const a = document.createElement('a'); a.href = url; a.download = 'interview-report.pdf'; a.click();
//           }} style={{ padding: '12px 24px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#eef2ff', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: font }}>
//             📄 Download PDF
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   // Main interview UI
//   return (
//     <div style={{ minHeight: '100vh', background: '#060a12', fontFamily: font, color: '#eef2ff' }}>

//       {/* Navbar */}
//       <nav style={{
//         position: 'sticky', top: 0, zIndex: 50,
//         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//         padding: '0 32px', height: '68px',
//         background: 'rgba(6,10,18,0.92)', backdropFilter: 'blur(20px)',
//         borderBottom: '1px solid rgba(255,255,255,0.06)',
//       }}>
//         <div>
//           <div style={{ fontSize: '15px', fontWeight: 600, color: '#eef2ff' }}>{interview.title}</div>
//           <div style={{ fontSize: '12px', color: '#8b95a8', marginTop: '2px' }}>{interview.job_role}</div>
//         </div>

//         <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
//           {tabWarnings > 0 && (
//             <div style={{
//               padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
//               background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171',
//             }}>
//               ⚠️ Tab switch: {tabWarnings}/3 {tabWarnings >= 2 ? '— Last warning!' : ''}
//             </div>
//           )}

//           {started && <Timer totalSeconds={90 * 60} onExpire={handleTimeExpire} />}

//           {/* Camera feed */}
//           <div style={{ position: 'relative' }}>
//             <video ref={videoRef} autoPlay muted playsInline
//               style={{
//                 width: '112px', height: '76px', borderRadius: '10px', objectFit: 'cover',
//                 border: cameraActive ? '2px solid #34d399' : '2px solid rgba(255,255,255,0.1)',
//                 background: '#121820', display: 'block',
//               }} />
//             {cameraActive && (
//               <div style={{
//                 position: 'absolute', top: '5px', left: '5px',
//                 display: 'flex', alignItems: 'center', gap: '4px',
//                 background: 'rgba(0,0,0,0.65)', borderRadius: '4px', padding: '2px 7px',
//               }}>
//                 <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', animation: 'livepulse 1.5s ease-in-out infinite' }} />
//                 <span style={{ fontSize: '10px', fontWeight: 700, color: 'white' }}>LIVE</span>
//               </div>
//             )}
//             {!cameraActive && !cameraError && (
//               <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📷</div>
//             )}
//           </div>

//           {cameraError && (
//             <div style={{ fontSize: '12px', color: '#fbbf24', padding: '4px 10px', borderRadius: '6px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
//               ⚠ {cameraError}
//             </div>
//           )}

//           {questions.length > 0 && (
//             <div style={{ fontSize: '13px', color: '#8b95a8', padding: '6px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', whiteSpace: 'nowrap' }}>
//               Q {currentIdx + 1} / {questions.length}
//             </div>
//           )}
//         </div>
//       </nav>

//       {/* Main content */}
//       <main style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 32px' }}>

//         {/* Start screen */}
//         {questions.length === 0 && (
//           <div style={{ padding: '64px 48px', borderRadius: '20px', textAlign: 'center', background: '#0c1018', border: '1px solid rgba(255,255,255,0.07)' }}>
//             <div style={{ fontSize: '56px', marginBottom: '20px' }}>🤖</div>
//             <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#eef2ff', marginBottom: '12px' }}>Ready to begin?</h2>
//             <p style={{ color: '#8b95a8', fontSize: '15px', marginBottom: '28px' }}>
//               AI will generate <strong style={{ color: '#a5b4fc' }}>20 questions</strong> tailored for <strong style={{ color: '#a5b4fc' }}>{interview.job_role}</strong>
//             </p>
//             <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '36px', flexWrap: 'wrap' }}>
//               {[
//                 { icon: '⏱', text: '90 min limit' },
//                 { icon: '📹', text: 'Camera on' },
//                 { icon: '⚠️', text: '3 switches = disqualified' },
//                 { icon: '🔒', text: 'One attempt' },
//               ].map(({ icon, text }) => (
//                 <div key={text} style={{
//                   display: 'flex', alignItems: 'center', gap: '7px',
//                   padding: '8px 16px', borderRadius: '8px', fontSize: '13px',
//                   background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#8b95a8',
//                 }}>{icon} {text}</div>
//               ))}
//             </div>
//             <button onClick={generateQuestions} disabled={generating}
//               style={{
//                 padding: '14px 40px', borderRadius: '12px', fontSize: '15px', fontWeight: 600,
//                 background: generating ? '#4a4e8a' : '#6366f1',
//                 border: 'none', color: 'white',
//                 cursor: generating ? 'not-allowed' : 'pointer', fontFamily: font,
//                 boxShadow: '0 0 28px rgba(99,102,241,0.3)',
//                 display: 'inline-flex', alignItems: 'center', gap: '10px',
//               }}>
//               {generating
//                 ? <><span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> Generating...</>
//                 : 'Generate Questions & Start →'}
//             </button>
//           </div>
//         )}

//         {/* Question UI */}
//         {currentQ && (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

//             {/* Progress */}
//             <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
//               <div style={{ height: '100%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', width: `${((currentIdx + 1) / questions.length) * 100}%`, transition: 'width 0.5s ease', borderRadius: '2px' }} />
//             </div>

//             {/* Question card */}
//             <div style={{ padding: '28px', borderRadius: '16px', background: '#0c1018', border: '1px solid rgba(255,255,255,0.07)' }}>
//               <span style={{
//                 display: 'inline-block', padding: '4px 12px', borderRadius: '6px',
//                 fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '16px',
//                 ...(currentQ.question_type === 'coding'
//                   ? { background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#c4b5fd' }
//                   : currentQ.question_type === 'technical'
//                   ? { background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc' }
//                   : { background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#6ee7b7' })
//               }}>{currentQ.question_type}</span>
//               <p style={{ fontSize: '17px', color: '#eef2ff', lineHeight: 1.75 }}>{currentQ.text}</p>
//             </div>

//             {/* Code editor */}
//             {currentQ.question_type === 'coding' && (
//               <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
//                 <div style={{ padding: '10px 16px', background: '#0c1018', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                   {['#ef4444','#fbbf24','#34d399'].map(c => <div key={c} style={{ width: '11px', height: '11px', borderRadius: '50%', background: c }} />)}
//                   <span style={{ fontSize: '12px', color: '#4a5568', marginLeft: '8px' }}>solution.py</span>
//                 </div>
//                 <MonacoEditor height="320px" language="python" theme="vs-dark" value={code}
//                   onChange={v => setCode(v || "")}
//                   options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16, bottom: 16 }, scrollBeyondLastLine: false }} />
//               </div>
//             )}

//             {/* Text answer */}
//             {currentQ.question_type !== 'coding' && (
//               <div style={{ padding: '24px', borderRadius: '16px', background: '#0c1018', border: '1px solid rgba(255,255,255,0.07)' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
//                   <label style={{ fontSize: '13px', fontWeight: 500, color: '#8b95a8' }}>Your Answer</label>
//                   <button onClick={recording ? stopRecording : startRecording}
//                     style={{
//                       display: 'flex', alignItems: 'center', gap: '7px',
//                       padding: '7px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
//                       background: recording ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
//                       border: `1px solid ${recording ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)'}`,
//                       color: recording ? '#f87171' : '#8b95a8', cursor: 'pointer', fontFamily: font,
//                     }}>
//                     {recording ? '⏹ Stop' : '🎤 Voice'}
//                   </button>
//                 </div>
//                 <textarea value={transcript} onChange={e => setTranscript(e.target.value)}
//                   placeholder="Type your answer here, or click Voice to record..."
//                   style={{
//                     width: '100%', minHeight: '140px', padding: '14px', borderRadius: '10px', resize: 'vertical' as const,
//                     background: '#121820', border: '1px solid rgba(255,255,255,0.07)', color: '#eef2ff',
//                     fontSize: '14px', lineHeight: 1.7, outline: 'none', fontFamily: font,
//                   }} />
//               </div>
//             )}

//             {/* Feedback */}
//             {feedback && (
//               <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
//                   <span style={{ fontSize: '14px', fontWeight: 600, color: '#818cf8' }}>AI Feedback</span>
//                   <div>
//                     <span style={{ fontSize: '28px', fontWeight: 800, color: '#eef2ff' }}>{feedback.score}</span>
//                     <span style={{ fontSize: '14px', color: '#4a5568' }}>/10</span>
//                   </div>
//                 </div>
//                 <p style={{ color: '#8b95a8', fontSize: '14px', lineHeight: 1.75 }}>{feedback.feedback}</p>
//               </div>
//             )}

//             {/* Actions */}
//             <div style={{ display: 'flex', gap: '12px', paddingBottom: '48px' }}>
//               {!feedback ? (
//                 <button onClick={submitAnswer} disabled={submitting}
//                   style={{
//                     padding: '12px 28px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
//                     background: submitting ? '#4a4e8a' : '#6366f1', border: 'none',
//                     color: 'white', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: font,
//                     display: 'inline-flex', alignItems: 'center', gap: '8px',
//                   }}>
//                   {submitting
//                     ? <><span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> Evaluating...</>
//                     : 'Submit Answer'}
//                 </button>
//               ) : isLast ? (
//                 <button onClick={generateReport} disabled={generatingReport}
//                   style={{
//                     padding: '12px 28px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
//                     background: generatingReport ? '#1a6b50' : '#059669', border: 'none',
//                     color: 'white', cursor: generatingReport ? 'not-allowed' : 'pointer', fontFamily: font,
//                   }}>
//                   {generatingReport ? 'Generating...' : '🏁 Finish & Generate Report'}
//                 </button>
//               ) : (
//                 <button onClick={nextQuestion}
//                   style={{ padding: '12px 28px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, background: '#6366f1', border: 'none', color: 'white', cursor: 'pointer', fontFamily: font }}>
//                   Next Question →
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
//       </main>

//       <style>{`
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes livepulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
//       `}</style>
//     </div>
//   );
// }































// "use client";
// import { useEffect, useState, useRef } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import dynamic from "next/dynamic";
// import API from "@/lib/api";

// const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

// const font = "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";

// function Timer({ totalSeconds, onExpire }: { totalSeconds: number; onExpire: () => void }) {
//   const [remaining, setRemaining] = useState(totalSeconds);
//   const ref = useRef<any>();
//   useEffect(() => {
//     ref.current = setInterval(() => {
//       setRemaining(r => {
//         if (r <= 1) { clearInterval(ref.current); onExpire(); return 0; }
//         return r - 1;
//       });
//     }, 1000);
//     return () => clearInterval(ref.current);
//   }, []);
//   const h = Math.floor(remaining / 3600);
//   const m = Math.floor((remaining % 3600) / 60);
//   const s = remaining % 60;
//   const pad = (n: number) => String(n).padStart(2, '0');
//   const isLow = remaining < 600;
//   return (
//     <div style={{
//       display: 'flex', alignItems: 'center', gap: '10px',
//       padding: '8px 16px', borderRadius: '10px',
//       background: isLow ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.04)',
//       border: `1px solid ${isLow ? 'rgba(248,113,113,0.3)' : 'rgba(255,255,255,0.08)'}`,
//     }}>
//       <span>⏱</span>
//       <div>
//         <div style={{ fontSize: '18px', fontWeight: 700, color: isLow ? '#f87171' : '#eef2ff', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.05em' }}>
//           {h > 0 && `${pad(h)}:`}{pad(m)}:{pad(s)}
//         </div>
//         <div style={{ height: '3px', width: '100px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', marginTop: '3px' }}>
//           <div style={{ height: '100%', borderRadius: '2px', width: `${(remaining / totalSeconds) * 100}%`, transition: 'width 1s linear', background: isLow ? '#f87171' : '#6366f1' }} />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function InterviewPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const interviewId = searchParams.get("id");

//   const [interview, setInterview] = useState<any>(null);
//   const [questions, setQuestions] = useState<any[]>([]);
//   const [currentIdx, setCurrentIdx] = useState(0);
//   const [code, setCode] = useState("// Write your solution here\n");
//   const [transcript, setTranscript] = useState("");
//   const [feedback, setFeedback] = useState<any>(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [generating, setGenerating] = useState(false);
//   const [recording, setRecording] = useState(false);
//   const [tabWarnings, setTabWarnings] = useState(0);
//   const [disqualified, setDisqualified] = useState(false);
//   const [report, setReport] = useState<any>(null);
//   const [generatingReport, setGeneratingReport] = useState(false);
//   const [cameraActive, setCameraActive] = useState(false);
//   const [cameraError, setCameraError] = useState("");
//   const [started, setStarted] = useState(false);
//   const [notStartedYet, setNotStartedYet] = useState(false);
//   const [timeExpired, setTimeExpired] = useState(false);
//   const [alreadyAttempted, setAlreadyAttempted] = useState(false);

//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const streamRef = useRef<MediaStream | null>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const chunksRef = useRef<Blob[]>([]);
//   const tabWarningsRef = useRef(0);
//   const startedRef = useRef(false);

//   useEffect(() => {
//     if (!interviewId) { router.push("/dashboard"); return; }
//     loadInterview();
//     // const handleVisibility = () => {
//     //   if (document.hidden && startedRef.current) {
//     //     const newCount = tabWarningsRef.current + 1;
//     //     tabWarningsRef.current = newCount;
//     //     setTabWarnings(newCount);
//     //     if (newCount >= 3) { setDisqualified(true); stopCamera(); }
//     //   }
//     // };



//     const handleVisibility = () => {
//   if (document.hidden && startedRef.current) {
//     const newCount = tabWarningsRef.current + 1;
//     tabWarningsRef.current = newCount;
//     setTabWarnings(newCount);
//     if (newCount >= 3) {
//       setDisqualified(true);
//       stopCamera();
//       // Lock permanently in backend
//       API.patch(`/api/interviews/${interviewId}/disqualify`).catch(() => {});
//     }
//   }
// };
//     document.addEventListener("visibilitychange", handleVisibility);
//     return () => { document.removeEventListener("visibilitychange", handleVisibility); stopCamera(); };
//   }, []);

//   // const loadInterview = async () => {
//   //   try {
//   //     const res = await API.get(`/api/interviews/${interviewId}`);
//   //     setInterview(res.data);
//   //     if (res.data.status === "completed") {
//   //       setAlreadyAttempted(true);
//   //       try {
//   //         const r = await API.get(`/api/reports/${interviewId}`);
//   //         setReport(r.data);
//   //       } catch {}
//   //       return;
//   //     }
//   //     const qRes = await API.get(`/api/questions/${interviewId}`);
//   //     if (qRes.data.length > 0) setQuestions(qRes.data);
//   //   } catch { router.push("/dashboard"); }
//   // };




//   // const loadInterview = async () => {
//   // try {
//   //   const res = await API.get(`/api/interviews/${interviewId}`);
//   //   setInterview(res.data);
//   //   if (res.data.status === "completed") {
//   //     setAlreadyAttempted(true);
//   //     try {
//   //       const r = await API.get(`/api/reports/${interviewId}`);
//   //       setReport(r.data);
//   //     } catch {}
//   //     return;
//   //   }



//   const loadInterview = async () => {
//   try {
//     const res = await API.get(`/api/interviews/${interviewId}`);
//     setInterview(res.data);

//     // ONE ATTEMPT — block if completed OR disqualified
//     if (res.data.status === "completed") {
//       setAlreadyAttempted(true);
//       if (res.data.is_disqualified === "true") {
//         setDisqualified(true);
//         return;
//       }
//       try {
//         const r = await API.get(`/api/reports/${interviewId}`);
//         setReport(r.data);
//       } catch {}
//       return;
//     }

//     const qRes = await API.get(`/api/questions/${interviewId}`);
//     if (qRes.data.length > 0) {
//       setQuestions(qRes.data);
//       if (res.data.status === "in_progress") {
//         setStarted(true);
//         startedRef.current = true;
//         await startCamera();
//       }
//     }
//   } catch { router.push("/dashboard"); }
// };
//     const qRes = await API.get(`/api/questions/${interviewId}`);
//     if (qRes.data.length > 0) {
//       setQuestions(qRes.data);
//       // If questions exist and interview is in progress, resume
//       if (res.data.status === "in_progress") {
//         setStarted(true);
//         startedRef.current = true;
//         await startCamera();
//       }
//     }
//   } catch { router.push("/dashboard"); }
// };

//   // const checkSchedule = (iv: any) => {
//   //   if (!iv?.scheduled_date || !iv?.scheduled_time) return true;
//   //   return new Date() >= new Date(`${iv.scheduled_date}T${iv.scheduled_time}`);
//   // };











//   const checkSchedule = (iv: any) => {
//   if (!iv?.scheduled_date || !iv?.scheduled_time) return true;
//   const scheduled = new Date(`${iv.scheduled_date}T${iv.scheduled_time}:00`);
//   const now = new Date();
//   console.log("Scheduled:", scheduled, "Now:", now, "Allow:", now >= scheduled);
//   return now >= scheduled;
// };

//   // const startCamera = async () => {
//   //   try {
//   //     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//   //     streamRef.current = stream;
//   //     if (videoRef.current) videoRef.current.srcObject = stream;
//   //     setCameraActive(true);
//   //   } catch { setCameraError("Camera denied — proctoring limited"); }
//   // };


// // const startCamera = async () => {
// //   try {
// //     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
// //     streamRef.current = stream;
// //     setCameraActive(true);
// //     // Wait for video element to be in DOM then assign
// //     setTimeout(() => {
// //       if (videoRef.current) {
// //         videoRef.current.srcObject = stream;
// //       }
// //     }, 500);
// //   } catch { setCameraError("Camera denied — proctoring limited"); }
// // };


// const startCamera = async () => {
//   try {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     streamRef.current = stream;
//     setCameraActive(true);
//     // Try multiple times to assign stream to video element
//     const tryAssign = (attempts: number) => {
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       } else if (attempts > 0) {
//         setTimeout(() => tryAssign(attempts - 1), 300);
//       }
//     };
//     setTimeout(() => tryAssign(10), 200);
//   } catch { setCameraError("Camera denied — proctoring limited"); }
// };

//   const stopCamera = () => {
//     streamRef.current?.getTracks().forEach(t => t.stop());
//     streamRef.current = null;
//     setCameraActive(false);
//   };

//   // const generateQuestions = async () => {
//   //   if (!checkSchedule(interview)) { setNotStartedYet(true); return; }
//   //   setGenerating(true);
//   //   try {
//   //     await startCamera();
//   //     await API.patch(`/api/interviews/${interviewId}/start`);
//   //     const res = await API.post(`/api/questions/generate/${interviewId}`, {
//   //       job_role: interview.job_role, num_coding: 8, num_technical: 8, num_hr: 4,
//   //     });





//   const generateQuestions = async () => {
//   if (!checkSchedule(interview)) {
//     setNotStartedYet(true);
//     return;
//   }
//   setGenerating(true);
//   try {
//     await startCamera();
//     await API.patch(`/api/interviews/${interviewId}/start`);
//     const res = await API.post(`/api/questions/generate/${interviewId}`, {
//       job_role: interview.job_role, num_coding: 8, num_technical: 8, num_hr: 4,
//     });
//     setQuestions(res.data);
//     setCurrentIdx(0);
//     setFeedback(null);
//     setStarted(true);
//     startedRef.current = true;
//   } catch (e) {
//     console.error(e);
//   } finally { setGenerating(false); }
// };
//       setQuestions(res.data);
//       setCurrentIdx(0);
//       setFeedback(null);
//       setStarted(true);
//       startedRef.current = true;
//     } finally { setGenerating(false); }
//   };

// //   useEffect(() => {
// //   if (cameraActive && streamRef.current && videoRef.current) {
// //     videoRef.current.srcObject = streamRef.current;
// //   }
// // }, [cameraActive]);
// useEffect(() => {
//   if (cameraActive && streamRef.current && videoRef.current) {
//     videoRef.current.srcObject = streamRef.current;
//   }
// }, [cameraActive]);

//   const handleTimeExpire = async () => {
//     setTimeExpired(true);
//     stopCamera();
//     try {
//       await API.patch(`/api/interviews/${interviewId}/end`);
//       const res = await API.post(`/api/reports/generate/${interviewId}`);
//       setReport(res.data);
//     } catch {}
//   };

//   // const submitAnswer = async () => {
//   //   const q = questions[currentIdx];
//   //   if (!q) return;
//   //   setSubmitting(true); setFeedback(null);
//   //   try {
//   //     const res = await API.post("/api/questions/answer", {
//   //       question_id: q.id,
//   //       transcript: q.question_type !== "coding" ? transcript : null,
//   //       code: q.question_type === "coding" ? code : null,
//   //     });
//   //     setFeedback(res.data);
//   //   } finally { setSubmitting(false); }
//   // };


//   const submitAnswer = async () => {
//   const q = questions[currentIdx];
//   if (!q) return;
  
//   const answerText = q.question_type === "coding" ? code : transcript;
//   if (!answerText || answerText.trim() === "" || answerText.trim() === "// Write your solution here") {
//     alert("Please write your answer before submitting.");
//     return;
//   }
  
//   setSubmitting(true); setFeedback(null);
//   try {
//     const res = await API.post("/api/questions/answer", {
//       question_id: q.id,
//       transcript: q.question_type !== "coding" ? transcript : null,
//       code: q.question_type === "coding" ? code : null,
//     });
//     setFeedback(res.data);
//   } catch (e: any) {
//     alert(e.response?.data?.detail || "Failed to submit answer");
//   } finally { setSubmitting(false); }
// };

//   const nextQuestion = () => {
//     setCurrentIdx(i => i + 1);
//     setFeedback(null);
//     setTranscript("");
//     setCode("// Write your solution here\n");
//   };

//   const generateReport = async () => {
//     setGeneratingReport(true);
//     stopCamera();
//     try {
//       await API.patch(`/api/interviews/${interviewId}/end`);
//       const res = await API.post(`/api/reports/generate/${interviewId}`);
//       setReport(res.data);
//     } finally { setGeneratingReport(false); }
//   };

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mr = new MediaRecorder(stream);
//       chunksRef.current = [];
//       mr.ondataavailable = e => chunksRef.current.push(e.data);
//       mr.onstop = async () => {
//         const blob = new Blob(chunksRef.current, { type: "audio/webm" });
//         const fd = new FormData();
//         fd.append("audio", blob, "audio.webm");
//         try {
//           const res = await API.post("/api/questions/transcribe", fd, { headers: { "Content-Type": "multipart/form-data" } });
//           setTranscript(res.data.transcript);
//         } catch {}
//       };
//       mr.start();
//       mediaRecorderRef.current = mr;
//       setRecording(true);
//     } catch { alert("Microphone access denied"); }
//   };

//   const stopRecording = () => { mediaRecorderRef.current?.stop(); setRecording(false); };
  

//   const currentQ = questions[currentIdx];
//   const isLast = currentIdx === questions.length - 1;

//   // Loading
//   if (!interview) return (
//     <div style={{ minHeight: '100vh', background: '#060a12', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font }}>
//       <div style={{ textAlign: 'center' }}>
//         <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
//         <p style={{ color: '#8b95a8' }}>Loading...</p>
//       </div>
//       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//     </div>
//   );

//   // Already attempted (show report if exists)
//   if (alreadyAttempted && !report) return (
//     <div style={{ minHeight: '100vh', background: '#060a12', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font }}>
//       <div style={{ maxWidth: '460px', textAlign: 'center', padding: '40px' }}>
//         <div style={{ fontSize: '64px', marginBottom: '24px' }}>🔒</div>
//         <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#eef2ff', marginBottom: '12px' }}>Already Attempted</h2>
//         <p style={{ color: '#8b95a8', fontSize: '15px', marginBottom: '28px', lineHeight: 1.7 }}>
//           You have already completed this interview. Only <strong style={{ color: '#f87171' }}>one attempt</strong> is allowed per interview.
//         </p>
//         <button onClick={() => router.push("/dashboard")}
//           style={{ padding: '12px 28px', borderRadius: '10px', background: '#6366f1', border: 'none', color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: font }}>
//           Back to Dashboard
//         </button>
//       </div>
//     </div>
//   );

//   // Not started yet
//   if (notStartedYet) return (
//     <div style={{ minHeight: '100vh', background: '#060a12', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font, padding: '24px' }}>
//       <div style={{ maxWidth: '480px', width: '100%', background: '#0c1018', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '20px', padding: '48px 40px', textAlign: 'center', boxShadow: '0 0 60px rgba(251,191,36,0.05)' }}>
//         <div style={{ fontSize: '56px', marginBottom: '20px' }}>⏰</div>
//         <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#eef2ff', marginBottom: '12px' }}>Interview Not Started Yet</h2>
//         <p style={{ color: '#8b95a8', fontSize: '14px', marginBottom: '20px', lineHeight: 1.7 }}>This interview is scheduled for:</p>
//         <div style={{ padding: '16px 24px', borderRadius: '12px', marginBottom: '28px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
//           <div style={{ fontSize: '20px', fontWeight: 700, color: '#fbbf24' }}>
//             📅 {interview.scheduled_date} at {interview.scheduled_time}
//           </div>
//         </div>
//         <p style={{ color: '#4a5568', fontSize: '13px', marginBottom: '24px' }}>Please return at the scheduled time to take your interview.</p>
//         <button onClick={() => router.push("/dashboard")}
//           style={{ padding: '12px 28px', borderRadius: '10px', background: '#6366f1', border: 'none', color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: font }}>
//           Back to Dashboard
//         </button>
//       </div>
//     </div>
//   );

//   // Disqualified
//   if (disqualified) return (
//     <div style={{ minHeight: '100vh', background: '#060a12', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font, padding: '24px' }}>
//       <div style={{ maxWidth: '480px', width: '100%', background: '#0c1018', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '20px', padding: '48px 40px', textAlign: 'center' }}>
//         <div style={{ fontSize: '56px', marginBottom: '20px' }}>🚫</div>
//         <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f87171', marginBottom: '12px' }}>Disqualified</h2>
//         <p style={{ color: '#8b95a8', fontSize: '15px', lineHeight: 1.7, marginBottom: '20px' }}>
//           You switched tabs <strong style={{ color: '#f87171' }}>3 times</strong>, violating the proctoring policy. Your interview has been terminated.
//         </p>
//         <div style={{ padding: '14px', borderRadius: '10px', marginBottom: '28px', background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)', fontSize: '13px', color: '#fca5a5' }}>
//           Tab switches detected: {tabWarnings}/3
//         </div>
//         <button onClick={() => router.push("/dashboard")}
//           style={{ padding: '12px 28px', borderRadius: '10px', background: '#ef4444', border: 'none', color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: font }}>
//           Exit Interview
//         </button>
//       </div>
//     </div>
//   );

//   // Time expired
//   if (timeExpired && !report) return (
//     <div style={{ minHeight: '100vh', background: '#060a12', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font }}>
//       <div style={{ textAlign: 'center', padding: '40px' }}>
//         <div style={{ fontSize: '64px', marginBottom: '24px' }}>⌛</div>
//         <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#eef2ff', marginBottom: '12px' }}>Time's Up!</h2>
//         <p style={{ color: '#8b95a8', marginBottom: '24px' }}>Generating your report based on submitted answers...</p>
//         <div style={{ width: '36px', height: '36px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', margin: '0 auto', animation: 'spin 0.8s linear infinite' }} />
//       </div>
//       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//     </div>
//   );

//   // Report
//   if (report) return (
//     <div style={{ minHeight: '100vh', background: '#060a12', fontFamily: font, padding: '48px 24px' }}>
//       <div style={{ maxWidth: '720px', margin: '0 auto' }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
//           <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '12px' }}>AI</div>
//           <span style={{ fontWeight: 600, fontSize: '16px', color: '#eef2ff' }}>InterviewAI</span>
//         </div>
//         <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#eef2ff', marginBottom: '6px' }}>Interview Complete 🎉</h1>
//         <p style={{ color: '#8b95a8', marginBottom: '28px' }}>{interview?.title}</p>

//         <div style={{ padding: '28px', borderRadius: '16px', marginBottom: '16px', background: '#0c1018', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <div>
//             <div style={{ fontSize: '13px', color: '#8b95a8', marginBottom: '8px' }}>Overall Score</div>
//             <div style={{ fontSize: '52px', fontWeight: 800, color: '#eef2ff', letterSpacing: '-1px', lineHeight: 1 }}>
//               {report.total_score}<span style={{ fontSize: '22px', color: '#4a5568', fontWeight: 400 }}>/10</span>
//             </div>
//           </div>
//           <div style={{
//             padding: '10px 20px', borderRadius: '30px', fontSize: '14px', fontWeight: 600,
//             ...(report.recommendation === "Strong Hire" ? { background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399' }
//               : report.recommendation === "Hire" ? { background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8' }
//               : report.recommendation === "Maybe" ? { background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24' }
//               : { background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171' })
//           }}>{report.recommendation}</div>
//         </div>

//         {[
//           { label: 'Summary', content: report.summary, color: '#eef2ff' },
//           { label: '✓ Strengths', content: report.strengths, color: '#34d399' },
//           { label: '✗ Areas to Improve', content: report.weaknesses, color: '#f87171' },
//         ].map(({ label, content, color }) => (
//           <div key={label} style={{ padding: '20px 24px', borderRadius: '14px', marginBottom: '12px', background: '#0c1018', border: '1px solid rgba(255,255,255,0.07)' }}>
//             <div style={{ fontSize: '13px', fontWeight: 600, color, marginBottom: '10px' }}>{label}</div>
//             <p style={{ color: '#8b95a8', fontSize: '14px', lineHeight: 1.75 }}>{content}</p>
//           </div>
//         ))}

//         <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
//           <button onClick={() => router.push("/dashboard")}
//             style={{ padding: '12px 24px', borderRadius: '10px', background: '#6366f1', border: 'none', color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: font }}>
//             Back to Dashboard
//           </button>
//           <button onClick={async () => {
//             const token = localStorage.getItem('token');
//             const res = await fetch(`http://localhost:8000/api/reports/download/${interviewId}`, { headers: { Authorization: `Bearer ${token}` } });
//             const blob = await res.blob();
//             const url = window.URL.createObjectURL(blob);
//             const a = document.createElement('a'); a.href = url; a.download = 'interview-report.pdf'; a.click();
//           }} style={{ padding: '12px 24px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#eef2ff', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: font }}>
//             📄 Download PDF
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   // Main interview UI
//   return (
//     <div style={{ minHeight: '100vh', background: '#060a12', fontFamily: font, color: '#eef2ff' }}>

//       {/* Navbar */}
//       <nav style={{
//         position: 'sticky', top: 0, zIndex: 50,
//         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//         padding: '0 32px', height: '68px',
//         background: 'rgba(6,10,18,0.92)', backdropFilter: 'blur(20px)',
//         borderBottom: '1px solid rgba(255,255,255,0.06)',
//       }}>
//         <div>
//           <div style={{ fontSize: '15px', fontWeight: 600, color: '#eef2ff' }}>{interview.title}</div>
//           <div style={{ fontSize: '12px', color: '#8b95a8', marginTop: '2px' }}>{interview.job_role}</div>
//         </div>

//         <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
//           {tabWarnings > 0 && (
//             <div style={{
//               padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
//               background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171',
//             }}>
//               ⚠️ Tab switch: {tabWarnings}/3 {tabWarnings >= 2 ? '— Last warning!' : ''}
//             </div>
//           )}

//           {started && <Timer totalSeconds={90 * 60} onExpire={handleTimeExpire} />}

//           {/* Camera feed */}
//           <div style={{ position: 'relative' }}>
//             <video ref={videoRef} autoPlay muted playsInline
//               style={{
//                 width: '112px', height: '76px', borderRadius: '10px', objectFit: 'cover',
//                 border: cameraActive ? '2px solid #34d399' : '2px solid rgba(255,255,255,0.1)',
//                 background: '#121820', display: 'block',
//               }} />
//             {cameraActive && (
//               <div style={{
//                 position: 'absolute', top: '5px', left: '5px',
//                 display: 'flex', alignItems: 'center', gap: '4px',
//                 background: 'rgba(0,0,0,0.65)', borderRadius: '4px', padding: '2px 7px',
//               }}>
//                 <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', animation: 'livepulse 1.5s ease-in-out infinite' }} />
//                 <span style={{ fontSize: '10px', fontWeight: 700, color: 'white' }}>LIVE</span>
//               </div>
//             )}
//             {!cameraActive && !cameraError && (
//               <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>📷</div>
//             )}
//           </div>

//           {cameraError && (
//             <div style={{ fontSize: '12px', color: '#fbbf24', padding: '4px 10px', borderRadius: '6px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
//               ⚠ {cameraError}
//             </div>
//           )}

//           {questions.length > 0 && (
//             <div style={{ fontSize: '13px', color: '#8b95a8', padding: '6px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', whiteSpace: 'nowrap' }}>
//               Q {currentIdx + 1} / {questions.length}
//             </div>
//           )}
//         </div>
//       </nav>

//       {/* Main content */}
//       <main style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 32px' }}>

//         {/* Start screen */}
//         {questions.length === 0 && (
//           <div style={{ padding: '64px 48px', borderRadius: '20px', textAlign: 'center', background: '#0c1018', border: '1px solid rgba(255,255,255,0.07)' }}>
//             <div style={{ fontSize: '56px', marginBottom: '20px' }}>🤖</div>
//             <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#eef2ff', marginBottom: '12px' }}>Ready to begin?</h2>
//             <p style={{ color: '#8b95a8', fontSize: '15px', marginBottom: '28px' }}>
//               AI will generate <strong style={{ color: '#a5b4fc' }}>20 questions</strong> tailored for <strong style={{ color: '#a5b4fc' }}>{interview.job_role}</strong>
//             </p>
//             <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '36px', flexWrap: 'wrap' }}>
//               {[
//                 { icon: '⏱', text: '90 min limit' },
//                 { icon: '📹', text: 'Camera on' },
//                 { icon: '⚠️', text: '3 switches = disqualified' },
//                 { icon: '🔒', text: 'One attempt' },
//               ].map(({ icon, text }) => (
//                 <div key={text} style={{
//                   display: 'flex', alignItems: 'center', gap: '7px',
//                   padding: '8px 16px', borderRadius: '8px', fontSize: '13px',
//                   background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#8b95a8',
//                 }}>{icon} {text}</div>
//               ))}
//             </div>
//             <button onClick={generateQuestions} disabled={generating}
//               style={{
//                 padding: '14px 40px', borderRadius: '12px', fontSize: '15px', fontWeight: 600,
//                 background: generating ? '#4a4e8a' : '#6366f1',
//                 border: 'none', color: 'white',
//                 cursor: generating ? 'not-allowed' : 'pointer', fontFamily: font,
//                 boxShadow: '0 0 28px rgba(99,102,241,0.3)',
//                 display: 'inline-flex', alignItems: 'center', gap: '10px',
//               }}>
//               {generating
//                 ? <><span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> Generating...</>
//                 : 'Generate Questions & Start →'}
//             </button>
//           </div>
//         )}

//         {/* Question UI */}
//         {currentQ && (
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

//             {/* Progress */}
//             <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
//               <div style={{ height: '100%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', width: `${((currentIdx + 1) / questions.length) * 100}%`, transition: 'width 0.5s ease', borderRadius: '2px' }} />
//             </div>

//             {/* Question card */}
//             <div style={{ padding: '28px', borderRadius: '16px', background: '#0c1018', border: '1px solid rgba(255,255,255,0.07)' }}>
//               <span style={{
//                 display: 'inline-block', padding: '4px 12px', borderRadius: '6px',
//                 fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: '16px',
//                 ...(currentQ.question_type === 'coding'
//                   ? { background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#c4b5fd' }
//                   : currentQ.question_type === 'technical'
//                   ? { background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc' }
//                   : { background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)', color: '#6ee7b7' })
//               }}>{currentQ.question_type}</span>
//               <p style={{ fontSize: '17px', color: '#eef2ff', lineHeight: 1.75 }}>{currentQ.text}</p>
//             </div>

//             {/* Code editor */}
//             {currentQ.question_type === 'coding' && (
//               <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
//                 <div style={{ padding: '10px 16px', background: '#0c1018', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                   {['#ef4444','#fbbf24','#34d399'].map(c => <div key={c} style={{ width: '11px', height: '11px', borderRadius: '50%', background: c }} />)}
//                   <span style={{ fontSize: '12px', color: '#4a5568', marginLeft: '8px' }}>solution.py</span>
//                 </div>
//                 <MonacoEditor height="320px" language="python" theme="vs-dark" value={code}
//                   onChange={v => setCode(v || "")}
//                   options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16, bottom: 16 }, scrollBeyondLastLine: false }} />
//               </div>
//             )}

//             {/* Text answer */}
//             {currentQ.question_type !== 'coding' && (
//               <div style={{ padding: '24px', borderRadius: '16px', background: '#0c1018', border: '1px solid rgba(255,255,255,0.07)' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
//                   <label style={{ fontSize: '13px', fontWeight: 500, color: '#8b95a8' }}>Your Answer</label>
//                   <button onClick={recording ? stopRecording : startRecording}
//                     style={{
//                       display: 'flex', alignItems: 'center', gap: '7px',
//                       padding: '7px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
//                       background: recording ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)',
//                       border: `1px solid ${recording ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)'}`,
//                       color: recording ? '#f87171' : '#8b95a8', cursor: 'pointer', fontFamily: font,
//                     }}>
//                     {recording ? '⏹ Stop' : '🎤 Voice'}
//                   </button>
//                 </div>
//                 <textarea value={transcript} onChange={e => setTranscript(e.target.value)}
//                   placeholder="Type your answer here, or click Voice to record..."
//                   style={{
//                     width: '100%', minHeight: '140px', padding: '14px', borderRadius: '10px', resize: 'vertical' as const,
//                     background: '#121820', border: '1px solid rgba(255,255,255,0.07)', color: '#eef2ff',
//                     fontSize: '14px', lineHeight: 1.7, outline: 'none', fontFamily: font,
//                   }} />
//               </div>
//             )}

//             {/* Feedback */}
//             {feedback && (
//               <div style={{ padding: '24px', borderRadius: '16px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
//                   <span style={{ fontSize: '14px', fontWeight: 600, color: '#818cf8' }}>AI Feedback</span>
//                   <div>
//                     <span style={{ fontSize: '28px', fontWeight: 800, color: '#eef2ff' }}>{feedback.score}</span>
//                     <span style={{ fontSize: '14px', color: '#4a5568' }}>/10</span>
//                   </div>
//                 </div>
//                 <p style={{ color: '#8b95a8', fontSize: '14px', lineHeight: 1.75 }}>{feedback.feedback}</p>
//               </div>
//             )}

//             {/* Actions */}
//             <div style={{ display: 'flex', gap: '12px', paddingBottom: '48px' }}>
//               {!feedback ? (
//                 <button onClick={submitAnswer} disabled={submitting}
//                   style={{
//                     padding: '12px 28px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
//                     background: submitting ? '#4a4e8a' : '#6366f1', border: 'none',
//                     color: 'white', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: font,
//                     display: 'inline-flex', alignItems: 'center', gap: '8px',
//                   }}>
//                   {submitting
//                     ? <><span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} /> Evaluating...</>
//                     : 'Submit Answer'}
//                 </button>
//               ) : isLast ? (
//                 <button onClick={generateReport} disabled={generatingReport}
//                   style={{
//                     padding: '12px 28px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
//                     background: generatingReport ? '#1a6b50' : '#059669', border: 'none',
//                     color: 'white', cursor: generatingReport ? 'not-allowed' : 'pointer', fontFamily: font,
//                   }}>
//                   {generatingReport ? 'Generating...' : '🏁 Finish & Generate Report'}
//                 </button>
//               ) : (
//                 <button onClick={nextQuestion}
//                   style={{ padding: '12px 28px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, background: '#6366f1', border: 'none', color: 'white', cursor: 'pointer', fontFamily: font }}>
//                   Next Question →
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
//       </main>

//       <style>{`
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes livepulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
//       `}</style>
//     </div>
//   );
// }































"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import API from "@/lib/api";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const font =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";

function Timer({
  totalSeconds,
  onExpire,
}: {
  totalSeconds: number;
  onExpire: () => void;
}) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const ref = useRef<any>();

  useEffect(() => {
    ref.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(ref.current);
          onExpire();
          return 0;
        }
        return r - 1;
      });
    }, 1000);

    return () => clearInterval(ref.current);
  }, []);

  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div
      style={{
        padding: "10px 16px",
        borderRadius: "10px",
        background: "rgba(255,255,255,0.05)",
        color: "#fff",
      }}
    >
      ⏱ {h > 0 && `${pad(h)}:`}
      {pad(m)}:{pad(s)}
    </div>
  );
}

export default function InterviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("id");

  const [interview, setInterview] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  const [code, setCode] = useState("// Write your solution here\n");
  const [transcript, setTranscript] = useState("");

  const [feedback, setFeedback] = useState<any>(null);

  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [recording, setRecording] = useState(false);

  const [tabWarnings, setTabWarnings] = useState(0);
  const [disqualified, setDisqualified] = useState(false);

  const [report, setReport] = useState<any>(null);

  const [generatingReport, setGeneratingReport] = useState(false);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const [started, setStarted] = useState(false);
  const [notStartedYet, setNotStartedYet] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);

  const [alreadyAttempted, setAlreadyAttempted] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const streamRef = useRef<MediaStream | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const chunksRef = useRef<Blob[]>([]);

  const tabWarningsRef = useRef(0);

  const startedRef = useRef(false);

  useEffect(() => {
    if (!interviewId) {
      router.push("/dashboard");
      return;
    }

    loadInterview();

    const handleVisibility = () => {
      if (document.hidden && startedRef.current) {
        const newCount = tabWarningsRef.current + 1;

        tabWarningsRef.current = newCount;

        setTabWarnings(newCount);

        if (newCount >= 3) {
          setDisqualified(true);

          stopCamera();

          API.patch(`/api/interviews/${interviewId}/disqualify`).catch(
            () => {}
          );
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );

      stopCamera();
    };
  }, []);

  const loadInterview = async () => {
    try {
      const res = await API.get(
        `/api/interviews/${interviewId}`
      );

      setInterview(res.data);

      if (res.data.status === "completed") {
        setAlreadyAttempted(true);

        if (res.data.is_disqualified === "true") {
          setDisqualified(true);
          return;
        }

        try {
          const r = await API.get(
            `/api/reports/${interviewId}`
          );

          setReport(r.data);
        } catch (error) {}

        return;
      }

      const qRes = await API.get(
        `/api/questions/${interviewId}`
      );

      if (qRes.data.length > 0) {
        setQuestions(qRes.data);

        if (res.data.status === "in_progress") {
          setStarted(true);

          startedRef.current = true;

          await startCamera();
        }
      }
    } catch (error) {
      router.push("/dashboard");
    }
  };

  const checkSchedule = (iv: any) => {
    if (!iv?.scheduled_date || !iv?.scheduled_time)
      return true;

    const scheduled = new Date(
      `${iv.scheduled_date}T${iv.scheduled_time}:00`
    );

    return new Date() >= scheduled;
  };

  const startCamera = async () => {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
        });

      streamRef.current = stream;

      setCameraActive(true);

      const tryAssign = (attempts: number) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        } else if (attempts > 0) {
          setTimeout(
            () => tryAssign(attempts - 1),
            300
          );
        }
      };

      setTimeout(() => tryAssign(10), 200);
    } catch (error) {
      setCameraError(
        "Camera denied — proctoring limited"
      );
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) =>
      t.stop()
    );

    streamRef.current = null;

    setCameraActive(false);
  };

  const generateQuestions = async () => {
    if (!checkSchedule(interview)) {
      setNotStartedYet(true);
      return;
    }

    setGenerating(true);

    try {
      await startCamera();

      await API.patch(
        `/api/interviews/${interviewId}/start`
      );

      const res = await API.post(
        `/api/questions/generate/${interviewId}`,
        {
          job_role: interview.job_role,
          num_coding: 8,
          num_technical: 8,
          num_hr: 4,
        }
      );

      setQuestions(res.data);

      setCurrentIdx(0);

      setFeedback(null);

      setStarted(true);

      startedRef.current = true;
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (
      cameraActive &&
      streamRef.current &&
      videoRef.current
    ) {
      videoRef.current.srcObject =
        streamRef.current;
    }
  }, [cameraActive]);

  const handleTimeExpire = async () => {
    setTimeExpired(true);

    stopCamera();

    try {
      await API.patch(
        `/api/interviews/${interviewId}/end`
      );

      const res = await API.post(
        `/api/reports/generate/${interviewId}`
      );

      setReport(res.data);
    } catch (error) {}
  };

  const submitAnswer = async () => {
    const q = questions[currentIdx];

    if (!q) return;

    const answerText =
      q.question_type === "coding"
        ? code
        : transcript;

    if (
      !answerText ||
      answerText.trim() === "" ||
      answerText.trim() ===
        "// Write your solution here"
    ) {
      alert(
        "Please write your answer before submitting."
      );

      return;
    }

    setSubmitting(true);

    setFeedback(null);

    try {
      const res = await API.post(
        "/api/questions/answer",
        {
          question_id: q.id,
          transcript:
            q.question_type !== "coding"
              ? transcript
              : null,
          code:
            q.question_type === "coding"
              ? code
              : null,
        }
      );

      setFeedback(res.data);
    } catch (e: any) {
      alert(
        e.response?.data?.detail ||
          "Failed to submit answer"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const nextQuestion = () => {
    setCurrentIdx((i) => i + 1);

    setFeedback(null);

    setTranscript("");

    setCode("// Write your solution here\n");
  };

  const generateReport = async () => {
    setGeneratingReport(true);

    stopCamera();

    try {
      await API.patch(
        `/api/interviews/${interviewId}/end`
      );

      const res = await API.post(
        `/api/reports/generate/${interviewId}`
      );

      setReport(res.data);
    } finally {
      setGeneratingReport(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      const mr = new MediaRecorder(stream);

      chunksRef.current = [];

      mr.ondataavailable = (e) =>
        chunksRef.current.push(e.data);

      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, {
          type: "audio/webm",
        });

        const fd = new FormData();

        fd.append("audio", blob, "audio.webm");

        try {
          const res = await API.post(
            "/api/questions/transcribe",
            fd,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

          setTranscript(res.data.transcript);
        } catch (error) {}
      };

      mr.start();

      mediaRecorderRef.current = mr;

      setRecording(true);
    } catch (error) {
      alert("Microphone access denied");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();

    setRecording(false);
  };

  const currentQ = questions[currentIdx];

  if (!interview) {
    return <div>Loading...</div>;
  }

  if (disqualified) {
    return <div>Disqualified</div>;
  }

  if (report) {
    return (
      <div style={{ padding: "40px", color: "#fff" }}>
        <h1>Interview Complete</h1>

        <h2>
          Score: {report.total_score}/10
        </h2>

        <p>{report.summary}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060a12",
        color: "#fff",
        fontFamily: font,
        padding: "30px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h1>{interview.title}</h1>

        {started && (
          <Timer
            totalSeconds={90 * 60}
            onExpire={handleTimeExpire}
          />
        )}
      </div>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: "220px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      />

      {questions.length === 0 ? (
        <button onClick={generateQuestions}>
          {generating
            ? "Generating..."
            : "Start Interview"}
        </button>
      ) : (
        <>
          <div
            style={{
              marginBottom: "20px",
            }}
          >
            <h2>{currentQ?.text}</h2>
          </div>

          {currentQ?.question_type ===
          "coding" ? (
            <MonacoEditor
              height="300px"
              language="python"
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v || "")}
            />
          ) : (
            <textarea
              value={transcript}
              onChange={(e) =>
                setTranscript(e.target.value)
              }
              style={{
                width: "100%",
                minHeight: "150px",
                padding: "10px",
              }}
            />
          )}

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              gap: "10px",
            }}
          >
            {!feedback ? (
              <button
                onClick={submitAnswer}
                disabled={submitting}
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Answer"}
              </button>
            ) : currentIdx ===
              questions.length - 1 ? (
              <button onClick={generateReport}>
                Finish Interview
              </button>
            ) : (
              <button onClick={nextQuestion}>
                Next Question
              </button>
            )}

            {currentQ?.question_type !==
              "coding" && (
              <button
                onClick={
                  recording
                    ? stopRecording
                    : startRecording
                }
              >
                {recording
                  ? "Stop Recording"
                  : "Voice Answer"}
              </button>
            )}
          </div>

          {feedback && (
            <div
              style={{
                marginTop: "20px",
                padding: "20px",
                border: "1px solid #444",
                borderRadius: "10px",
              }}
            >
              <h3>
                Score: {feedback.score}/10
              </h3>

              <p>{feedback.feedback}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}













