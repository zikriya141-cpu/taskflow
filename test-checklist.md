# TaskFlow - Day 4: Usability, Reliability & Testing Checklist

## Test Execution Summary
- **Tester:** Intern
- **Date:** 2026-10-29
- **Project:** TaskFlow (Personal Task Management System)
- **Status:** All Core Test Cases Passed (PASS)

---

## 1. Functional & CRUD Test Cases

| Test ID | Feature | Test Description | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Create Task (POST) | Submit form with valid Title and Description | Task added to database and displayed in UI | Task appeared instantly with green feedback | **PASS** |
| **TC-02** | Title Validation | Submit form with empty Title | Blocked with error: "Task title is required." | Red error banner shown; backend returned 400 | **PASS** |
| **TC-03** | Read Tasks (GET) | Open / refresh page | All saved tasks load from SQLite database | 100% tasks fetched from `/tasks` | **PASS** |
| **TC-04** | Toggle Status (PUT) | Click "Complete" / "Mark Pending" | Status toggles between pending & completed | Badge color & strikethrough updated | **PASS** |
| **TC-05** | Edit Task (PUT) | Click "Edit", modify text, click "Save Changes" | Task details updated in database and list | Changes saved and UI refreshed | **PASS** |
| **TC-06** | Delete Task (DELETE) | Click "Delete", confirm browser prompt | Task permanently removed from database | Task removed and count decremented | **PASS** |

---

## 2. Usability & Reliability Test Cases

| Test ID | Area | Test Description | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-07** | Delete Confirmation | Click "Delete" button | Confirmation dialog asks: "Are you sure...?" | Dialog shown; cancels if user clicks Cancel | **PASS** |
| **TC-08** | Empty State | Delete all tasks from the list | Friendly empty state message appears | "No tasks found..." message displayed | **PASS** |
| **TC-09** | Feedback Messages | Perform Add, Edit, Delete, Toggle | Green banner shows success, auto-hides | Feedback banner renders smoothly | **PASS** |
| **TC-10** | Persistence Test | Refresh browser after making changes | All updates remain intact in SQLite | State perfectly restored from database | **PASS** |
| **TC-11** | Responsive Layout | Test on mobile width (<768px) | Layout switches from 2 columns to 1 column | Clean vertical stack without horizontal scroll | **PASS** |
| **TC-12** | Keyboard Usability | Navigate using Tab and Enter | Form inputs and buttons accessible via keyboard | Full keyboard navigation works | **PASS** |