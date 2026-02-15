# Specification

## Summary
**Goal:** Eliminate shadcn SelectItem empty-string value warnings for optional Select fields while keeping a working “None” option that clears the selection.

**Planned changes:**
- Replace any `<SelectItem value="">…</SelectItem>` used for optional selects with a non-empty sentinel value (e.g., `"__none__"`) and map that sentinel to setting the Select value/state to `""` to clear and show the placeholder.
- Update optional Select implementations in the listed pages so selecting “None” clears the relevant state field (`jobOpeningId` / `clientId`) and selecting a real entity sets the id string:
  - `frontend/src/pages/candidates/CandidateCreatePage.tsx`
  - `frontend/src/pages/candidates/CandidateEditPage.tsx`
  - `frontend/src/pages/interviews/InterviewCreatePage.tsx`
  - `frontend/src/pages/interviews/InterviewEditPage.tsx`
  - `frontend/src/pages/jobs/JobCreatePage.tsx`
  - `frontend/src/pages/jobs/JobEditPage.tsx`

**User-visible outcome:** Optional dropdowns (Job Client, Candidate Linked Job, Interview Job Opening) can be set to a visible “None” option that clears the selection and shows the placeholder, without any empty-string SelectItem runtime warnings in the browser console.
