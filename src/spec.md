# Specification

## Summary
**Goal:** Build a hospitality recruitment management app for Tyagi Chef with Internet Identity login, role-based access, and CRUD management for Jobs, Candidates, Interviews, and Clients.

**Planned changes:**
- Add Internet Identity authentication with sign-in/sign-out and a basic role model (Admin, Staff) enforced in the backend.
- Implement backend data models and CRUD APIs for Clients, Job Openings (optionally linked to Clients), Candidates (optionally linked to Job Openings), and Interviews (linked to Candidates; optionally to Job Openings).
- Build a React UI with navigation for Dashboard, Jobs, Candidates, Interviews, and Clients, each providing list (search + filters), detail, create, edit, and archive/delete actions.
- Add a Dashboard home screen with key summary counts and quick links to create new records.
- Apply a consistent professional visual theme suitable for hospitality staffing (not primarily blue/purple), using Tailwind and compositional use of existing UI components.
- Add static generated brand assets (icon/favicon + illustration) under `frontend/public/assets/generated` and reference them in the UI (header + sign-in/empty state).

**User-visible outcome:** After signing in with Internet Identity, users can navigate a themed dashboard and manage clients, job openings, candidates, and interviews through searchable/filtered lists and create/edit/detail screens, with access controlled by Admin/Staff roles.
