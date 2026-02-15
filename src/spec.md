# Specification

## Summary
**Goal:** Restrict the application so only Admin users can access any functionality, with backend enforcement and a frontend access-denied gate for non-Admins.

**Planned changes:**
- Enforce Admin-only authorization across all backend APIs for Jobs, Candidates, Interviews, Clients, and UserProfile (non-Admins are blocked from all read/write operations).
- Add a frontend Admin gate that, for logged-in non-Admin users, replaces the main app layout/routes with an “Access Denied” screen and a logout option (including direct URL navigation to protected routes).
- Ensure frontend query/mutation error handling remains stable when authorization traps occur (no blank screens, crashes, or infinite loading for blocked users).

**User-visible outcome:** Admin users can use the app normally; any non-Admin who logs in will only see an Access Denied screen and can log out, even if they try to open a protected URL directly.
