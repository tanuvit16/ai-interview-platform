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
  // const ref = useRef<any>();
  const ref = useRef<any>(null);

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

  // const loadInterview = async () => {
  //   try {
  //     const res = await API.get(
  //       `/api/interviews/${interviewId}`
  //     );
  // const loadInterview = async () => {
  // try {
  //   const res = await API.get(`/api/interviews/${interviewId}`);
  //   setInterview(res.data);

  //   // Block if disqualified
  //   if (res.data.is_disqualified === "true") {
  //     setDisqualified(true);
  //     setAlreadyAttempted(true);
  //     return;
  //   }

  //   // Block if completed
  //   if (res.data.status === "completed") {
  //     setAlreadyAttempted(true);
  //     try {
  //       const r = await API.get(`/api/reports/${interviewId}`);
  //       setReport(r.data);
  //     } catch {}
  //     return;
  //   }

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





  //     setInterview(res.data);

  //     if (res.data.status === "completed") {
  //       setAlreadyAttempted(true);

  //       if (res.data.is_disqualified === "true") {
  //         setDisqualified(true);
  //         return;
  //       }

  //       try {
  //         const r = await API.get(
  //           `/api/reports/${interviewId}`
  //         );

  //         setReport(r.data);
  //       } catch (error) {}

  //       return;
  //     }

  //     const qRes = await API.get(
  //       `/api/questions/${interviewId}`
  //     );

  //     if (qRes.data.length > 0) {
  //       setQuestions(qRes.data);

  //       if (res.data.status === "in_progress") {
  //         setStarted(true);

  //         startedRef.current = true;

  //         await startCamera();
  //       }
  //     }
  //   } catch (error) {
  //     router.push("/dashboard");
  //   }
  // };

const loadInterview = async () => {
  try {
    const res = await API.get(`/api/interviews/${interviewId}`);
    setInterview(res.data);

    if (res.data.is_disqualified === "true") {
      setDisqualified(true);
      setAlreadyAttempted(true);
      return;
    }

    if (res.data.status === "completed") {
      setAlreadyAttempted(true);
      try {
        const r = await API.get(`/api/reports/${interviewId}`);
        setReport(r.data);
      } catch {
        // no report yet
      }
      return;
    }

    const qRes = await API.get(`/api/questions/${interviewId}`);
    if (qRes.data.length > 0) {
      setQuestions(qRes.data);
      if (res.data.status === "in_progress") {
        setStarted(true);
        startedRef.current = true;
        await startCamera();
      }
    }
  } catch {
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

  // if (!interview) {
  //   return <div>Loading...</div>;
  // }
  if (!interview) return (
  <div style={{ minHeight: '100vh', background: '#060a12', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#8b95a8', fontSize: '14px' }}>Loading your interview...</p>
    </div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

  // if (disqualified) {
  //   return <div>Disqualified</div>;
  // }



  // ── DISQUALIFIED (check before alreadyAttempted) ──
if (disqualified) return (
  <div style={{ minHeight: '100vh', background: '#060a12', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font, padding: '24px' }}>
    <div style={{ maxWidth: '480px', width: '100%', background: '#0c1018', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '20px', padding: '48px 40px', textAlign: 'center', boxShadow: '0 0 60px rgba(248,113,113,0.06)' }}>
      <div style={{ fontSize: '56px', marginBottom: '20px' }}>🚫</div>
      <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#f87171', marginBottom: '12px' }}>Disqualified</h2>
      <p style={{ color: '#8b95a8', fontSize: '15px', lineHeight: 1.7, marginBottom: '20px' }}>
        You switched tabs <strong style={{ color: '#f87171' }}>3 times</strong>, violating the proctoring policy. Your interview has been permanently terminated.
      </p>
      <div style={{ padding: '14px', borderRadius: '10px', marginBottom: '28px', background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)', fontSize: '14px', color: '#fca5a5' }}>
        Tab switches detected: {tabWarnings}/3 — Interview locked
      </div>
      <button onClick={() => router.push("/dashboard")}
        style={{ padding: '12px 32px', borderRadius: '10px', background: '#ef4444', border: 'none', color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: font }}>
        Back to Dashboard
      </button>
    </div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// ── ALREADY ATTEMPTED ──
if (alreadyAttempted && !report) return (
  <div style={{ minHeight: '100vh', background: '#060a12', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font, padding: '24px' }}>
    <div style={{ maxWidth: '460px', width: '100%', background: '#0c1018', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '48px 40px', textAlign: 'center' }}>
      <div style={{ fontSize: '56px', marginBottom: '20px' }}>🔒</div>
      <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#eef2ff', marginBottom: '12px' }}>Already Attempted</h2>
      <p style={{ color: '#8b95a8', fontSize: '15px', marginBottom: '28px', lineHeight: 1.7 }}>
        You have already completed this interview. Only <strong style={{ color: '#f87171' }}>one attempt</strong> is allowed per interview.
      </p>
      <button onClick={() => router.push("/dashboard")}
        style={{ padding: '12px 32px', borderRadius: '10px', background: '#6366f1', border: 'none', color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: font }}>
        Back to Dashboard
      </button>
    </div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

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













