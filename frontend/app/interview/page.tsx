// "use client";
// import { useEffect, useState, useRef } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import dynamic from "next/dynamic";
// import API from "@/lib/api";
// import Button from "@/components/ui/button";
// import Card from "@/components/ui/card";

// const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

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
//   const [tabWarning, setTabWarning] = useState(0);
//   const [report, setReport] = useState<any>(null);
//   const [generatingReport, setGeneratingReport] = useState(false);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const chunksRef = useRef<Blob[]>([]);

//   useEffect(() => {
//     if (!interviewId) { router.push("/dashboard"); return; }
//     loadInterview();
//     // Tab switch detection
//     const handleVisibility = () => {
//       if (document.hidden) setTabWarning(w => w + 1);
//     };
//     document.addEventListener("visibilitychange", handleVisibility);
//     return () => document.removeEventListener("visibilitychange", handleVisibility);
//   }, []);

//   const loadInterview = async () => {
//     const res = await API.get(`/api/interviews/${interviewId}`);
//     setInterview(res.data);
//     const qRes = await API.get(`/api/questions/${interviewId}`);
//     setQuestions(qRes.data);
//   };

//   const generateQuestions = async () => {
//     setGenerating(true);
//     try {
//       await API.patch(`/api/interviews/${interviewId}/start`);
//       const res = await API.post(`/api/questions/generate/${interviewId}`, {
//         job_role: interview.job_role,
//         num_coding: 2, num_technical: 2, num_hr: 1,
//       });
//       setQuestions(res.data);
//       setCurrentIdx(0);
//       setFeedback(null);
//     } finally { setGenerating(false); }
//   };

//   const submitAnswer = async () => {
//     const q = questions[currentIdx];
//     if (!q) return;
//     setSubmitting(true);
//     setFeedback(null);
//     try {
//       const res = await API.post("/api/questions/answer", {
//         question_id: q.id,
//         transcript: q.question_type !== "coding" ? transcript : null,
//         code: q.question_type === "coding" ? code : null,
//       });
//       setFeedback(res.data);
//     } finally { setSubmitting(false); }
//   };

//   const nextQuestion = () => {
//     setCurrentIdx(i => i + 1);
//     setFeedback(null);
//     setTranscript("");
//     setCode("// Write your solution here\n");
//   };

//   const generateReport = async () => {
//     setGeneratingReport(true);
//     try {
//       await API.patch(`/api/interviews/${interviewId}/end`);
//       const res = await API.post(`/api/reports/generate/${interviewId}`);
//       setReport(res.data);
//     } finally { setGeneratingReport(false); }
//   };

//   const startRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const mr = new MediaRecorder(stream);
//     chunksRef.current = [];
//     mr.ondataavailable = e => chunksRef.current.push(e.data);
//     mr.onstop = async () => {
//       const blob = new Blob(chunksRef.current, { type: "audio/webm" });
//       const formData = new FormData();
//       formData.append("audio", blob, "audio.webm");
//       const res = await API.post("/api/questions/transcribe", formData, { headers: { "Content-Type": "multipart/form-data" } });
//       setTranscript(res.data.transcript);
//     };
//     mr.start();
//     mediaRecorderRef.current = mr;
//     setRecording(true);
//   };

//   const stopRecording = () => {
//     mediaRecorderRef.current?.stop();
//     setRecording(false);
//   };

//   const currentQ = questions[currentIdx];
//   const isLast = currentIdx === questions.length - 1;

//   if (!interview) return (
//     <div className="min-h-screen bg-gray-950 flex items-center justify-center">
//       <p className="text-gray-400">Loading interview...</p>
//     </div>
//   );

//   if (report) return (
//     <div className="min-h-screen bg-gray-950 text-white p-8 max-w-3xl mx-auto">
//       <h1 className="text-3xl font-bold mb-2">Interview Complete</h1>
//       <p className="text-gray-400 mb-8">{interview.title}</p>
//       <Card className="mb-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Overall Score</h2>
//           <span className="text-4xl font-bold text-blue-400">{report.total_score}/10</span>
//         </div>
//         <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
//           report.recommendation === "Strong Hire" ? "bg-green-900/40 text-green-400" :
//           report.recommendation === "Hire" ? "bg-blue-900/40 text-blue-400" :
//           report.recommendation === "Maybe" ? "bg-yellow-900/40 text-yellow-400" :
//           "bg-red-900/40 text-red-400"
//         }`}>{report.recommendation}</div>
//       </Card>
//       <Card className="mb-4"><h3 className="font-semibold mb-2 text-gray-300">Summary</h3><p className="text-gray-400">{report.summary}</p></Card>
//       <Card className="mb-4"><h3 className="font-semibold mb-2 text-green-400">Strengths</h3><p className="text-gray-400">{report.strengths}</p></Card>
//       <Card className="mb-8"><h3 className="font-semibold mb-2 text-red-400">Areas to Improve</h3><p className="text-gray-400">{report.weaknesses}</p></Card>
//       <div className="flex gap-3">
//   <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
//   <Button variant="secondary" onClick={async () => {
//     const token = localStorage.getItem('token');
//     const res = await fetch(`http://localhost:8000/api/reports/download/${interviewId}`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     const blob = await res.blob();
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `interview-report.pdf`;
//     a.click();
//   }}>📄 Download PDF</Button>
// </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-950 text-white">
//       <nav className="border-b border-gray-800 px-8 py-4 flex justify-between items-center">
//         <div>
//           <h1 className="text-lg font-bold">{interview.title}</h1>
//           <p className="text-gray-500 text-sm">{interview.job_role}</p>
//         </div>
//         <div className="flex items-center gap-4">
//           {tabWarning > 0 && (
//             <span className="bg-red-900/40 border border-red-700 text-red-400 text-xs px-3 py-1 rounded-full">
//               ⚠️ Tab switch detected ({tabWarning})
//             </span>
//           )}
//           {questions.length > 0 && (
//             <span className="text-gray-400 text-sm">Question {currentIdx + 1} of {questions.length}</span>
//           )}
//         </div>
//       </nav>

//       <div className="max-w-4xl mx-auto px-8 py-10">
//         {questions.length === 0 ? (
//           <Card className="text-center py-16">
//             <h2 className="text-xl font-semibold mb-2">Ready to begin?</h2>
//             <p className="text-gray-400 mb-8">AI will generate {5} questions tailored for {interview.job_role}</p>
//             <Button onClick={generateQuestions} loading={generating} className="px-8 py-3 text-lg">
//               Generate Questions & Start
//             </Button>
//           </Card>
//         ) : currentQ ? (
//           <div className="flex flex-col gap-6">
//             <Card>
//               <div className="flex items-center gap-3 mb-4">
//                 <span className={`text-xs px-3 py-1 rounded-full border ${
//                   currentQ.question_type === "coding" ? "bg-purple-900/40 text-purple-400 border-purple-700" :
//                   currentQ.question_type === "technical" ? "bg-blue-900/40 text-blue-400 border-blue-700" :
//                   "bg-green-900/40 text-green-400 border-green-700"
//                 }`}>{currentQ.question_type}</span>
//               </div>
//               <p className="text-white text-lg leading-relaxed">{currentQ.text}</p>
//             </Card>

//             {currentQ.question_type === "coding" ? (
//               <Card className="p-0 overflow-hidden">
//                 <div className="px-4 py-2 border-b border-gray-700 flex items-center gap-2">
//                   <div className="w-3 h-3 rounded-full bg-red-500"></div>
//                   <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
//                   <div className="w-3 h-3 rounded-full bg-green-500"></div>
//                   <span className="text-gray-500 text-xs ml-2">solution.py</span>
//                 </div>
//                 <MonacoEditor
//                   height="300px"
//                   language="python"
//                   theme="vs-dark"
//                   value={code}
//                   onChange={(v) => setCode(v || "")}
//                   options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 } }}
//                 />
//               </Card>
//             ) : (
//               <Card>
//                 <div className="flex items-center justify-between mb-3">
//                   <label className="text-sm text-gray-400 font-medium">Your Answer</label>
//                   <button
//                     onClick={recording ? stopRecording : startRecording}
//                     className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
//                       recording ? "bg-red-600 hover:bg-red-700 text-white" : "bg-gray-700 hover:bg-gray-600 text-white"
//                     }`}
//                   >
//                     {recording ? "⏹ Stop Recording" : "🎤 Voice Answer"}
//                   </button>
//                 </div>
//                 <textarea
//                   className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
//                   rows={5}
//                   placeholder="Type your answer or use voice recording above..."
//                   value={transcript}
//                   onChange={e => setTranscript(e.target.value)}
//                 />
//               </Card>
//             )}

//             {feedback && (
//               <Card className="border-blue-700/50">
//                 <div className="flex items-center justify-between mb-3">
//                   <h3 className="font-semibold text-blue-400">AI Feedback</h3>
//                   <span className="text-2xl font-bold text-white">{feedback.score}/10</span>
//                 </div>
//                 <p className="text-gray-300">{feedback.feedback}</p>
//               </Card>
//             )}

//             <div className="flex gap-3">
//               {!feedback ? (
//                 <Button onClick={submitAnswer} loading={submitting} className="px-8">Submit Answer</Button>
//               ) : isLast ? (
//                 <Button onClick={generateReport} loading={generatingReport} className="px-8 bg-green-600 hover:bg-green-700">
//                   Finish & Generate Report
//                 </Button>
//               ) : (
//                 <Button onClick={nextQuestion} className="px-8">Next Question →</Button>
//               )}
//             </div>
//           </div>
//         ) : null}
//       </div>
//     </div>
//   );
// }








































"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import API from "@/lib/api";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

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
  const [tabWarning, setTabWarning] = useState(0);
  const [report, setReport] = useState<any>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!interviewId) { router.push("/dashboard"); return; }
    loadInterview();
    const handleVisibility = () => {
      if (document.hidden) setTabWarning(w => w + 1);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      stopCamera();
    };
  }, []);

  // const loadInterview = async () => {
  //   const res = await API.get(`/api/interviews/${interviewId}`);
  //   setInterview(res.data);
  //   const qRes = await API.get(`/api/questions/${interviewId}`);
  //   setQuestions(qRes.data);
  // };
  const loadInterview = async () => {
  const res = await API.get(`/api/interviews/${interviewId}`);
  setInterview(res.data);
  const qRes = await API.get(`/api/questions/${interviewId}`);
  setQuestions(qRes.data);
  // If interview is completed, load existing report
  if (res.data.status === "completed") {
    try {
      const reportRes = await API.get(`/api/reports/${interviewId}`);
      setReport(reportRes.data);
    } catch {
      // No report yet, that's fine
    }
  }
};

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setCameraError("");
    } catch (e) {
      setCameraError("Camera access denied");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const generateQuestions = async () => {
    setGenerating(true);
    try {
      await startCamera();
      await API.patch(`/api/interviews/${interviewId}/start`);
      const res = await API.post(`/api/questions/generate/${interviewId}`, {
        job_role: interview.job_role,
        num_coding: 8, num_technical: 8, num_hr: 4,
      });
      setQuestions(res.data);
      setCurrentIdx(0);
      setFeedback(null);
    } finally { setGenerating(false); }
  };

  const submitAnswer = async () => {
    const q = questions[currentIdx];
    if (!q) return;
    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await API.post("/api/questions/answer", {
        question_id: q.id,
        transcript: q.question_type !== "coding" ? transcript : null,
        code: q.question_type === "coding" ? code : null,
      });
      setFeedback(res.data);
    } finally { setSubmitting(false); }
  };

  const nextQuestion = () => {
    setCurrentIdx(i => i + 1);
    setFeedback(null);
    setTranscript("");
    setCode("// Write your solution here\n");
  };

  const generateReport = async () => {
    setGeneratingReport(true);
    stopCamera();
    try {
      await API.patch(`/api/interviews/${interviewId}/end`);
      const res = await API.post(`/api/reports/generate/${interviewId}`);
      setReport(res.data);
    } finally { setGeneratingReport(false); }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    chunksRef.current = [];
    mr.ondataavailable = e => chunksRef.current.push(e.data);
    mr.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("audio", blob, "audio.webm");
      const res = await API.post("/api/questions/transcribe", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setTranscript(res.data.transcript);
    };
    mr.start();
    mediaRecorderRef.current = mr;
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const currentQ = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;

  if (!interview) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400">Loading interview...</p>
    </div>
  );

  if (report) return (
    <div className="min-h-screen bg-gray-950 text-white p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Interview Complete</h1>
      <p className="text-gray-400 mb-8">{interview.title}</p>
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Overall Score</h2>
          <span className="text-4xl font-bold text-blue-400">{report.total_score}/10</span>
        </div>
        <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
          report.recommendation === "Strong Hire" ? "bg-green-900/40 text-green-400" :
          report.recommendation === "Hire" ? "bg-blue-900/40 text-blue-400" :
          report.recommendation === "Maybe" ? "bg-yellow-900/40 text-yellow-400" :
          "bg-red-900/40 text-red-400"
        }`}>{report.recommendation}</div>
      </Card>
      <Card className="mb-4"><h3 className="font-semibold mb-2 text-gray-300">Summary</h3><p className="text-gray-400">{report.summary}</p></Card>
      <Card className="mb-4"><h3 className="font-semibold mb-2 text-green-400">Strengths</h3><p className="text-gray-400">{report.strengths}</p></Card>
      <Card className="mb-8"><h3 className="font-semibold mb-2 text-red-400">Areas to Improve</h3><p className="text-gray-400">{report.weaknesses}</p></Card>
      <div className="flex gap-3">
        <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
        <Button variant="secondary" onClick={async () => {
          const token = localStorage.getItem('token');
          const res = await fetch(`http://localhost:8000/api/reports/download/${interviewId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `interview-report.pdf`;
          a.click();
        }}>📄 Download PDF</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="border-b border-gray-800 px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold">{interview.title}</h1>
          <p className="text-gray-500 text-sm">{interview.job_role}</p>
        </div>
        <div className="flex items-center gap-4">
          {cameraError && (
            <span className="bg-red-900/40 border border-red-700 text-red-400 text-xs px-3 py-1 rounded-full">
              ⚠️ {cameraError}
            </span>
          )}
          {tabWarning > 0 && (
            <span className="bg-red-900/40 border border-red-700 text-red-400 text-xs px-3 py-1 rounded-full">
              ⚠️ Tab switch detected ({tabWarning})
            </span>
          )}
          {cameraActive && (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-32 h-24 rounded-lg border-2 border-green-500 object-cover"
              />
              <div className="absolute top-1 left-1 flex items-center gap-1 bg-black/50 rounded px-1">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-white text-xs font-bold">LIVE</span>
              </div>
            </div>
          )}
          {questions.length > 0 && (
            <span className="text-gray-400 text-sm">Question {currentIdx + 1} of {questions.length}</span>
          )}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-10">
        {questions.length === 0 ? (
          <Card className="text-center py-16">
            <h2 className="text-xl font-semibold mb-2">Ready to begin?</h2>
            <p className="text-gray-400 mb-4">AI will generate 20 questions tailored for {interview.job_role}</p>
            <p className="text-yellow-400 text-sm mb-8">📷 Camera access required for proctoring</p>
            <Button onClick={generateQuestions} loading={generating} className="px-8 py-3 text-lg">
              Generate Questions & Start
            </Button>
          </Card>
        ) : currentQ ? (
          <div className="flex flex-col gap-6">
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs px-3 py-1 rounded-full border ${
                  currentQ.question_type === "coding" ? "bg-purple-900/40 text-purple-400 border-purple-700" :
                  currentQ.question_type === "technical" ? "bg-blue-900/40 text-blue-400 border-blue-700" :
                  "bg-green-900/40 text-green-400 border-green-700"
                }`}>{currentQ.question_type}</span>
              </div>
              <p className="text-white text-lg leading-relaxed">{currentQ.text}</p>
            </Card>

            {currentQ.question_type === "coding" ? (
              <Card className="p-0 overflow-hidden">
                <div className="px-4 py-2 border-b border-gray-700 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-500 text-xs ml-2">solution.py</span>
                </div>
                <MonacoEditor
                  height="300px"
                  language="python"
                  theme="vs-dark"
                  value={code}
                  onChange={(v) => setCode(v || "")}
                  options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 } }}
                />
              </Card>
            ) : (
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm text-gray-400 font-medium">Your Answer</label>
                  <button
                    onClick={recording ? stopRecording : startRecording}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      recording ? "bg-red-600 hover:bg-red-700 text-white" : "bg-gray-700 hover:bg-gray-600 text-white"
                    }`}
                  >
                    {recording ? "⏹ Stop Recording" : "🎤 Voice Answer"}
                  </button>
                </div>
                <textarea
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                  rows={5}
                  placeholder="Type your answer or use voice recording above..."
                  value={transcript}
                  onChange={e => setTranscript(e.target.value)}
                />
              </Card>
            )}

            {feedback && (
              <Card className="border-blue-700/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-blue-400">AI Feedback</h3>
                  <span className="text-2xl font-bold text-white">{feedback.score}/10</span>
                </div>
                <p className="text-gray-300">{feedback.feedback}</p>
              </Card>
            )}

            <div className="flex gap-3">
              {!feedback ? (
                <Button onClick={submitAnswer} loading={submitting} className="px-8">Submit Answer</Button>
              ) : isLast ? (
                <Button onClick={generateReport} loading={generatingReport} className="px-8 bg-green-600 hover:bg-green-700">
                  Finish & Generate Report
                </Button>
              ) : (
                <Button onClick={nextQuestion} className="px-8">Next Question →</Button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}