// Single typed contract shared across all dashboard components.
// Mirrors backend app/schemas/case.py exactly.

export type DataSource = "demo" | "indexed" | "live";
export type Severity = "high" | "medium" | "low";

export interface Signal { name: string; score: number } // 0..1
export interface TemporalPoint { t: number; score: number } // score 0..1
export interface AnomalyBand { start: number; end: number; label: string }

export interface MatchItem {
  id: string;
  label: string;
  source_handle?: string | null;
  platform?: string | null;
  similarity: number; // 0..100
  hamming_distance?: number | null;
  url?: string | null;
  first_seen_at?: string | null;
}

export interface PropagationNode {
  id: string;
  handle: string;
  platform?: string | null;
  timestamp: string;
  label?: string | null;
  is_origin: boolean;
  is_group: boolean;
}
export interface PropagationEdge { source: string; target: string }
export interface TimelineEvent { timestamp: string; handle: string; action: string }

export type AIClassification = "LIKELY_AI_GENERATED" | "LIKELY_AUTHENTIC" | "INCONCLUSIVE";

export interface AIDetection {
  label: string; score: number; severity: Severity; data_source: DataSource;
  // Phase 5.4: real model-inference fields. is_ml_based=false means the ML
  // pipeline was unavailable/unsupported — an honest fallback, not a guess.
  classification?: AIClassification | null;
  model_name?: string | null;
  model_version?: string | null;
  analyzed_at?: string | null;
  explanation?: string | null;
  is_ml_based?: boolean;
}
export interface ManipulationAnalysis {
  type: string; score: number; signals: Signal[];
  temporal: TemporalPoint[]; anomaly?: AnomalyBand | null;
  heatmap_ref?: string | null; data_source: DataSource;
  // Phase 5: structured classification over a fixed taxonomy.
  classification?: string | null;
  classification_confidence?: number | null;
  classification_evidence?: string[];
  classification_method?: string;
}
export interface Originality {
  label: string; score: number; data_source: DataSource;
  // Phase 5: evidence-grounded assessment.
  confidence?: number | null;
  evidence?: string[];
  assessment_method?: string;
}
export interface Fingerprint {
  phash?: string | null; phash_display?: string | null;
  matches_found: number; similarity: number;
  matches: MatchItem[]; data_source: DataSource;
  // Phase 4.5: fingerprinting method transparency.
  method?: string; // "perceptual_phash" | "perceptual_video_frames" | "content_hash_fallback"
  frame_count?: number | null;
}
export interface Provenance {
  metadata: string; c2pa: string; recording_device: string;
  software: string; creation_time: string; data_source: DataSource;
}
export interface ConfidenceBreakdown {
  ai_detection: number; manipulation: number; provenance: number;
  similarity: number; consistency: number;
}
export interface Explainability {
  verdict: string; reasons: string[]; confidence: ConfidenceBreakdown;
}
export interface DisseminationEvent {
  evidence_id: string;
  source_handle?: string | null;
  platform?: string | null;
  timestamp?: string | null;
  url?: string | null;
  similarity: number;
  hamming_distance?: number | null;
  relationship: string;
}

export interface Tracing {
  earliest_timestamp?: string | null;
  earliest_source?: string | null;
  earliest_platform?: string | null;
  earliest_confidence: string;
  // Phase 5: explicit caveat — earliest indexed sighting, never the
  // asserted absolute original source.
  earliest_is_indexed_only?: boolean;
  dissemination_path?: DisseminationEvent[];
  nodes: PropagationNode[];
  edges: PropagationEdge[];
  timeline: TimelineEvent[];
  data_source: DataSource;
}

export interface EvidenceOut {
  id: string; filename: string; file_type: string; media_kind: string;
  uploaded_by: string; uploaded_at: string;
  duration?: string | null; resolution?: string | null;
  size_label?: string | null; sha256?: string | null;
  sha256_display?: string | null;
  thumbnail_url?: string | null; media_url?: string | null;
  data_source: DataSource;
}

export interface ReportInfo { id?: string | null; status: string; includes: string[] }

export interface CaseSummary {
  id: string; status: string; officer_name: string; title: string;
  forensic_score?: number | null; confidence_label?: string | null;
  filename?: string | null; created_at: string; data_source: DataSource;
}

export interface CaseDetail {
  id: string; status: string; officer_name: string; title: string;
  forensic_score?: number | null; confidence_label?: string | null;
  created_at: string; data_source: DataSource;
  evidence: EvidenceOut;
  ai_detection: AIDetection;
  manipulation: ManipulationAnalysis;
  originality: Originality;
  fingerprint: Fingerprint;
  provenance: Provenance;
  explainability: Explainability;
  tracing: Tracing;
  report: ReportInfo;
}

export interface AppConfig {
  app_name: string; app_version: string;
  org_name: string; org_unit: string;
  default_case_id: string; disclaimer: string;
}

export interface IndexedMedia {
  id: string; label: string;
  source_handle?: string | null; platform?: string | null;
  phash?: string | null; has_frame_phashes: boolean;
  frame_count?: number | null; sha256?: string | null;
  url?: string | null; first_seen_at?: string | null;
}
