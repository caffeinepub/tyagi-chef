# Specification

## Summary
**Goal:** Prevent the New Candidate flow from crashing due to calling `toUpperCase()` on a missing/undefined candidate status, and ensure status data is consistently populated for newly created candidates.

**Planned changes:**
- Update candidate status label/badge rendering to safely handle missing/unknown status values (avoid calling `toUpperCase()` on undefined) across candidate UI surfaces, at minimum Candidates list and Candidate detail pages.
- Add/adjust frontend fallback behavior to display a safe English status label when status is missing/unknown.
- Verify end-to-end that the backend returns a populated `status` for candidates created via `createCandidate`, and ensure frontend remains resilient to any legacy/inconsistent records.

**User-visible outcome:** Creating a new candidate no longer crashes the UI, and candidate list/detail pages render safely even when a candidate’s status is missing or unexpected (showing a fallback label instead).
