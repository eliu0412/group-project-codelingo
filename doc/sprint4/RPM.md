# Release Plan - Sprint 4

## Release Name: Sprint 4

## Release Objectives

### Specific Goals
- Launch GitHub integration for user code uploads and sharing.
- Implement gamified streak system to encourage daily engagement.
- Finalize competitive coding mode and post-game lobby.
- Enable fill-in-the-blank questions for lessons.
- Deploy final version of simplified navbar and UI refinements.
- Complete CI/CD pipeline for automated testing and production deployment.

### Metrics for Measurement
- GitHub uploads succeed via API and confirm on GitHub repo (tracked via webhook logs).
- Streaks update accurately with daily logins and lesson completions (verified via test cases).
- Competitive mode and post-game lobby display correct results and scores (confirmed via multiplayer tests).
- Fill-in-the-blank questions render correctly and submit answers reliably (monitored via frontend logs).
- CI/CD pipeline executes backend/frontend tests and auto-deploys with no manual intervention.
- UI updates reduce bounce rates and increase average time-on-page (measured via Firebase/Google Analytics).

## Release Scope

### Included Features
- **GitHub Integration**: Users can upload and share code files directly from the platform.
- **Streak System**: Tracks user learning streaks with motivational UI feedback.
- **Competitive Coding Mode**: Real-time challenge solving between users with a game lobby and leaderboard.
- **Post-Game Lobby**: Visual breakdown of player performance after game sessions.
- **Fill-in-the-Blank Lessons**: Interactive lesson type to boost user engagement.
- **Simplified Navbar**: Cleaned up navigation bar for streamlined user experience.
- **Discussion Comments**: Users can comment and reply within discussion threads.
- **CI/CD Pipeline Finalization**: Automatic test execution and deployment to production on push.

### Bug Fixes
- Resolved lesson test failures and increased test coverage.
- Fixed user-service bugs related to authentication and session handling.
- Addressed frontend state issues with streak visuals.
- Fixed inconsistencies in discussion post rendering.

## Non-Functional Requirements
- Maintain 95%+ test pass rate in CI pipeline before deploy.
- Ensure < 200ms response time for major API endpoints under load.
- Support concurrent multiplayer games with stable socket communication.
- Ensure WCAG 2.1 AA compliance in new UI components and navigation.

## Dependencies and Limitations

### External Dependencies
- Firebase for auth, analytics, and progress tracking.
- GitHub REST API for code uploads.
- WebSockets (Socket.io) for real-time game communication.
- CI/CD powered by GitHub Actions and Docker.
- React + Redux + TypeScript frontend stack.

### Known Limitations
- Streaks do not yet support backfilling missed days.
- Competitive mode not optimized for more than 4 users per session.

## Deployment Plan

### Steps to Carry Out the Deployment
1. Merge Sprint 4 branches into `main`.
2. Run backend and frontend tests through CI.
3. Push build to staging for internal QA and verification.
4. Tag a production release and trigger automated deployment.
5. Monitor real-time logs and analytics for issues or regressions.

### PIV (Post Implementation Verification) Instructions
- Upload test code to GitHub and confirm appearance in linked repo.
- Log in daily and verify streak counter updates accurately.
- Play multiplayer challenge and ensure score breakdown is correct.
- Complete a fill-in-the-blank lesson and verify answer submission and feedback.
- Navigate app using keyboard to confirm accessibility compliance.
- Review CI/CD logs for test pass/fail and deployment completion.
