import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, LayersControl, ScaleControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useAuth } from "../AuthContext.jsx";
import { api } from "../api.js";
import { RISK_COLOR } from "../constants.js";
import ProjectDetail from "../components/ProjectDetail.jsx";

const { BaseLayer, Overlay } = LayersControl;

// Lucknow-centred default view
const DEFAULT_CENTER = [26.8467, 80.9462];
const DEFAULT_ZOOM = 12;

const RISK_HEX = {
  Critical: "#A23B33",
  High: "#B9791F",
  Medium: "#2F5D62",
  Low: "#6E7B5C",
};

export default function MapView() {
  const { auth } = useAuth();
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [minRisk, setMinRisk] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  function load() {
    setLoading(true);
    api.getGeoProjects(auth.token, minRisk)
      .then(setPoints)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, [minRisk]);

  async function openDetail(pid) {
    setSelectedId(pid);
    try {
      const full = await api.getProject(auth.token, pid);
      setSelectedProject(full);
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
        <div>
          <h2 className="ledger-head" style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>GIS view — geo-tagged projects</h2>
          <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "4px 0 0" }}>
            Lucknow road-corridor pilot ({points.length} points). Switch between street, satellite, and boundary layers
            using the control in the top-right of the map. Coordinates are approximate corridor midpoints, not surveyed points.
          </p>
        </div>
        <select value={minRisk} onChange={(e) => setMinRisk(Number(e.target.value))} style={{ padding: "6px 10px", fontSize: 12.5, border: "1px solid var(--line)", background: "white" }}>
          <option value={0}>All risk levels</option>
          <option value={26}>Medium and above</option>
          <option value={51}>High and above</option>
          <option value={76}>Critical only</option>
        </select>
      </div>

      {err && <div style={{ color: "var(--brick)", padding: 10 }}>{err}</div>}

      <div style={{ border: "1px solid var(--line)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: "center", color: "var(--muted)", background: "white" }}>Loading map…</div>
        ) : points.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center", color: "var(--muted)", background: "white" }}>No geo-tagged projects match this filter.</div>
        ) : (
          <MapContainer center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM} style={{ height: 560, width: "100%" }}>
            <LayersControl position="topright">
              <BaseLayer checked name="Street">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </BaseLayer>
              <BaseLayer name="Satellite">
                <TileLayer
                  attribution='Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
              </BaseLayer>
              <Overlay name="Political boundaries & labels">
                <TileLayer
                  attribution='Boundaries &amp; Places &copy; Esri'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                />
              </Overlay>
            </LayersControl>

            <ScaleControl position="bottomleft" />

            {points.map((p) => (
              <CircleMarker
                key={p.project_id}
                center={[p.latitude, p.longitude]}
                radius={selectedId === p.project_id ? 10 : 7}
                pathOptions={{
                  color: selectedId === p.project_id ? "#16233F" : "white",
                  weight: selectedId === p.project_id ? 2 : 1,
                  fillColor: RISK_HEX[p.risk_category],
                  fillOpacity: 0.9,
                }}
                eventHandlers={{ click: () => openDetail(p.project_id) }}
              >
                <Tooltip direction="top" offset={[0, -6]}>
                  <div style={{ fontSize: 12 }}>
                    <b>{p.location_name}</b><br />
                    {p.segment_label}<br />
                    Risk {p.risk_score} / 100 — {p.risk_category}
                  </div>
                </Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        )}

        <div style={{ display: "flex", gap: 16, padding: "10px 14px", fontSize: 11.5, color: "var(--muted)", flexWrap: "wrap", background: "white", borderTop: "1px solid var(--line)" }}>
          {["Critical", "High", "Medium", "Low"].map((cat) => (
            <span key={cat} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: RISK_HEX[cat], display: "inline-block" }} />
              {cat}
            </span>
          ))}
          <span style={{ marginLeft: "auto" }}>Click a point for the full risk breakdown</span>
        </div>
      </div>

      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={() => { setSelectedId(null); setSelectedProject(null); }}
          onChanged={load}
        />
      )}
    </div>
  );
}
