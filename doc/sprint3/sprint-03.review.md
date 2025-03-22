# CodeLingo

> _Note:_ This document is meant to be written during (or shortly after) your review meeting, which should happen fairly close to the due date.  
>  
> _Suggestion:_ Have your review meeting a day or two before the due date. This way you will have some time to go over (and edit) this document, and all team members should have a chance to make their contribution.

---

## Iteration 03 - Review & Retrospect

- **When:** 3/21/2025  
- **Where:** Online

---

## Process - Reflection

- Identified task dependencies and created a network diagram to plan the sprint’s critical path  
- Prioritized backend schema and API-related tasks early in the sprint  
- Implemented progress tracking logic  
- Continued refinement of the admin dashboard  
- Added placeholder logic for fill-in-the-blank interactive questions (AP-8)  
- Daily standups and mid-sprint syncs were used to align the team and unblock issues quickly

---

### ✅ Decisions that turned out well

- **Critical Path Planning:** Mapping dependencies helped us avoid mid-sprint delays and ensured smoother task handoffs.
- **Pair Programming on High-Complexity Tasks:** Improved code quality and reduced cycle time for critical modules like progress tracking.
- **Daily Standups & Communication:** Helped identify blockers early and allowed dynamic task reassignment when necessary.
- **Backend Planning at Sprint Start:** Finalizing the database schema early made it easier to build features that depended on it, such as tracking user lesson progress.

---

### ⚠️ Decisions that didn’t work as well

- **Underestimation of AP-8 (Fill-in-the-Blank Logic):**  
  The complexity of implementing flexible, dynamic interactive questions with real-time validation was not fully scoped during planning, leading to delays.
- **Assuming Uniform Workflows Across Team:**  
  A one-size-fits-all development flow led to some inefficiencies. We’ve since adjusted to allow for more flexibility based on individual strengths.

---

### 🔄 Planned Changes

- Add pre-sprint “technical breakdown” sessions to improve the accuracy of story point estimation  
- Introduce buffer time for exploratory tasks or new feature formats  
- Increase async documentation to reduce reliance on full-group syncs

---

## Product - Review

### ✅ Goals and Tasks Completed:

- **Progress Tracking Logic (Backend):**  
  Implemented logic to track user progress through lessons and questions  
- **Admin Dashboard Updates:**  
  Refined UI, added filtering and editable lesson modules  
- **Database and API Dependencies Finalized:**  
  Laid groundwork for lesson-based interactions (including future interactive questions)  
- **Daily Standups + Midweek Syncs:**  
  Maintained velocity by quickly resolving blockers  
- **Sprint 3 Documentation:**  
  Completed and reviewed collaboratively during the sprint

---

### ❌ Tasks Planned But Not Completed:

- **AP-8 (Interactive Fill-in-the-Blank Questions):**  
  - **User Story:** _"As a user, I want fill-in-the-blank questions during lessons so that I can test my understanding interactively."_  
  - **Status:** Incomplete due to unexpected backend and validation complexity. Work is partially implemented but requires more time for full integration.

- **GitHub Code Uploads:**  
  Project files were not pushed to GitHub as priority shifted to backend and API logic stabilization.

---

## Looking Ahead

In the next sprint, we aim to:

- Complete AP-8, including frontend components and answer validation logic  
- Upload finalized modules to GitHub with README and setup docs  
- Begin implementation of multiplayer functionality (real-time collaborative lesson sessions)  
- Expand AI question integration within lesson flows  
