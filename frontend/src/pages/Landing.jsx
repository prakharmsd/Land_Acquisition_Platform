import React, { useState } from "react";
import { useAuth } from "../AuthContext.jsx";
import { ShieldCheck, Users, Loader2 } from "lucide-react";

export default function Landing({ onChooseAdmin }) {
  const { login, loading, error } = useAuth();
  const [citizenBusy, setCitizenBusy] = useState(false);

  async function handleCitizen() {
    setCitizenBusy(true);
    await login("viewer", "viewer123");
    setCitizenBusy(false);
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden", background: "var(--navy-deep)" }}>
      <BackgroundArt />

      <div style={{
        position: "relative", zIndex: 2, minHeight: "100vh",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "40px 20px", textAlign: "center",
      }}>
        <div style={{
          fontSize: 11, letterSpacing: 3, color: "#E2A96B", textTransform: "uppercase", marginBottom: 14,
        }}>
          AI-Powered Infrastructure Monitoring
        </div>
        <h1 className="ledger-head" style={{ fontSize: 40, fontWeight: 700, color: "white", margin: 0, maxWidth: 640, lineHeight: 1.2 }}>
          Land Acquisition Risk Register
        </h1>
        <p style={{ fontSize: 15, color: "#B9C2D6", marginTop: 14, maxWidth: 480, lineHeight: 1.6 }}>
          Predicting delay risk across national infrastructure projects and the
          road-corridor pilot — explainable, transparent, built for public accountability.
        </p>

        <div style={{ display: "flex", gap: 18, marginTop: 44, flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={onChooseAdmin}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
              width: 220, padding: "26px 20px", background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.18)", borderRadius: 2, cursor: "pointer",
              color: "white", backdropFilter: "blur(4px)", transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
          >
            <ShieldCheck size={26} color="#E2A96B" />
            <div style={{ fontSize: 15, fontWeight: 600 }}>Administrator</div>
            <div style={{ fontSize: 11.5, color: "#8E9AB5" }}>Sign in for full control — create, manage, and audit projects</div>
          </button>

          <button
            onClick={handleCitizen}
            disabled={citizenBusy}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
              width: 220, padding: "26px 20px", background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.18)", borderRadius: 2, cursor: citizenBusy ? "default" : "pointer",
              color: "white", backdropFilter: "blur(4px)", transition: "background 0.15s ease",
              opacity: citizenBusy ? 0.7 : 1,
            }}
            onMouseEnter={(e) => !citizenBusy && (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
          >
            {citizenBusy ? <Loader2 size={26} color="#7FA0A4" className="spin" /> : <Users size={26} color="#7FA0A4" />}
            <div style={{ fontSize: 15, fontWeight: 600 }}>Public / Citizen View</div>
            <div style={{ fontSize: 11.5, color: "#8E9AB5" }}>Browse project risk data — no login required</div>
          </button>
        </div>

        {error && (
          <div style={{ marginTop: 20, background: "rgba(162,59,51,0.2)", color: "#E8A29C", fontSize: 12.5, padding: "8px 14px", borderRadius: 2 }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: 50, fontSize: 11, color: "#5C6784" }}>
          Note: National dataset + Lucknow roads pilot · demo data, not live government records
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}

/**
 * Hand-illustrated SVG background: a road in perspective converging toward
 * the horizon, with a faint network/node overlay suggesting the AI layer
 * reading the data. Fully original — no stock imagery, keeps the same
 * navy/amber palette as the rest of the app.
 */
function BackgroundArt() {
  return (
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1 }}
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0F1929" />
          <stop offset="55%" stopColor="#16233F" />
          <stop offset="100%" stopColor="#1B2A4A" />
        </linearGradient>
        <linearGradient id="roadFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2A3A5C" stopOpacity="0" />
          <stop offset="100%" stopColor="#2A3A5C" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#3A4E78" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#3A4E78" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1440" height="900" fill="url(#sky)" />
      <circle cx="720" cy="330" r="420" fill="url(#glow)" />

      {/* distant hills */}
      <path d="M0,560 Q240,500 480,545 T960,530 T1440,560 L1440,900 L0,900 Z" fill="#1E2E50" opacity="0.6" />
      <path d="M0,600 Q300,555 600,590 T1200,580 T1440,610 L1440,900 L0,900 Z" fill="#233459" opacity="0.7" />

      {/* road in perspective, converging toward a vanishing point */}
      <polygon points="620,900 820,900 745,540 695,540" fill="url(#roadFade)" />
      {/* lane markings */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const t0 = 0.12 + i * 0.15;
        const t1 = t0 + 0.06;
        const yA = 900 - t0 * 360;
        const yB = 900 - t1 * 360;
        const widthA = 6 + t0 * 2;
        const widthB = 6 + t1 * 2;
        const xA = 720 - widthA / 2;
        const xB = 720 - widthB / 2;
        return (
          <rect key={i} x={xA} y={yB} width={widthA} height={yA - yB} fill="#E2A96B" opacity="0.5" />
        );
      })}

      {/* network nodes + connecting lines, suggesting the AI/data layer reading the scene */}
      <g stroke="#7FA0A4" strokeWidth="1" opacity="0.45">
        <line x1="180" y1="220" x2="360" y2="300" />
        <line x1="360" y1="300" x2="300" y2="420" />
        <line x1="360" y1="300" x2="540" y2="260" />
        <line x1="540" y1="260" x2="700" y2="340" />
        <line x1="1080" y1="200" x2="1260" y2="270" />
        <line x1="1260" y1="270" x2="1180" y2="400" />
        <line x1="1080" y1="200" x2="960" y2="300" />
        <line x1="960" y1="300" x2="900" y2="420" />
      </g>
      <g fill="#E2A96B">
        <circle cx="180" cy="220" r="3.5" />
        <circle cx="360" cy="300" r="4.5" />
        <circle cx="300" cy="420" r="3" />
        <circle cx="540" cy="260" r="3.5" />
        <circle cx="700" cy="340" r="3" />
        <circle cx="1080" cy="200" r="4" />
        <circle cx="1260" cy="270" r="3.5" />
        <circle cx="1180" cy="400" r="3" />
        <circle cx="960" cy="300" r="3.5" />
        <circle cx="900" cy="420" r="3" />
      </g>

      {/* subtle risk-coloured markers scattered like project points on a map */}
      <g opacity="0.55">
        <circle cx="230" cy="620" r="5" fill="#A23B33" />
        <circle cx="310" cy="670" r="5" fill="#B9791F" />
        <circle cx="1120" cy="640" r="5" fill="#2F5D62" />
        <circle cx="1200" cy="600" r="5" fill="#A23B33" />
        <circle cx="1040" cy="700" r="5" fill="#6E7B5C" />
      </g>

      {/* soft vignette at the bottom for legibility of the buttons */}
      <rect x="0" y="700" width="1440" height="200" fill="url(#roadFade)" opacity="0.5" />
    </svg>
  );
}
