# TaskFlow
### Personal Task Management System — full CRUD with Node.js, Express and SQLite

A small task manager built during Week 1 of the Stack & Scale Remote
Internship (October 2026). Not a UI mock-up: the browser talks to an Express
API, the API reads and writes a SQLite table, and every change survives a
page refresh and a server restart.

---

## 1. Features

- **Create** — add a task with a required title, optional description, due
  date and status.
- **Read** — the list loads from the database on every page open, newest
  first, with Pending / Completed badges and due dates.
- **Update** — edit a task in place, or flip its status between pending and
  completed with one click.
- **Delete** — remove a task permanently, behind a confirmation prompt.
- **Validation on both sides** — the browser blocks a blank title before it
  is sent, and the API returns `400` if one arrives anyway.
- **Feedback** — success and error banners after every action, plus a
  friendly empty state when there are no tasks left.
- **Responsive** — two columns on desktop, a single stack below 768px.
- **Keyboard usable** — every input and button is reachable with Tab and
  Enter.

---

## 2. Project Structure

```
taskflow/
├── server.js                 # Express app, REST routes, SQLite setup and seed data
├── package.json
├── public/
│   ├── index.html            # Add / edit form and task list
│   ├── app.js                # Fetch API client and DOM rendering
│   └── style.css             # Responsive styling
├── docs/
│   └── api-outline.md        # Data model and API design
├── test-checklist.md         # 12-point CRUD and usability test report
└── tasks.db                  # Created automatically on first run
```

---

## 3. API Endpoints

All endpoints speak JSON and live under the same origin as the page.

| Method | Endpoint | Purpose | Success |
| :--- | :--- | :--- | :--- |
| `GET` | `/tasks` | Return every task, newest first | `200` |
| `POST` | `/tasks` | Create a task | `201` |
| `PUT` | `/tasks/:id` | Edit a task or toggle its status | `200` |
| `DELETE` | `/tasks/:id` | Delete a task | `200` |

Failure cases are handled explicitly:

- `400` — missing or blank title
- `404` — no task with that `id`
- `500` — database error, returned as `{ "error": "..." }`

---

## 4. Database Schema

One table, created by `server.js` on startup if it does not exist.

| Field | Type | Notes |
| :--- | :--- | :--- |
| `id` | INTEGER | Primary key, auto-incremented |
| `title` | TEXT | Required, trimmed before saving |
| `description` | TEXT | Optional, defaults to `''` |
| `status` | TEXT | `pending` (default) or `completed` |
| `due_date` | TEXT | Optional, `YYYY-MM-DD` |
| `created_at` | DATETIME | Defaults to `CURRENT_TIMESTAMP` |

If the table is empty on first run, three sample tasks are inserted so the
interface is not blank.

---

## 5. Setup

**Requirement:** Node.js 22.5 or newer — the server uses the built-in
`node:sqlite` module.

```bash
# 1. Install dependencies
npm install

# 2. Start the server
node server.js
```

Then open <http://localhost:3000>.

`tasks.db` is created next to `server.js` on first run. To start from an
empty list, stop the server and delete that file.

---

## 6. Testing

`test-checklist.md` records 12 test cases run on 2026-10-29, all passing:

| Area | Cases |
| :--- | :--- |
| CRUD | Create, read, toggle status, edit, delete |
| Validation | Blank title rejected with `400` |
| Usability | Delete confirmation, empty state, feedback banners |
| Reliability | Persistence across refresh and restart |
| Responsive | Layout below 768px, no horizontal scroll |
| Accessibility | Full keyboard navigation |

---

## 7. Known Limits

- No accounts — everyone using the server shares the same task list.
- `tasks.db` is local to the machine running the server, so there is no sync
  between devices.
- No pagination or search yet; the whole list is returned in one request.

Next up would be authentication, per-user lists, and a small filter bar.

---

<p align="center">
  <sub>Built by <a href="https://github.com/zikriya141-cpu">Zikriya Khan</a> — also on my <a href="https://zikriya141-cpu.github.io/portfolio/">portfolio</a>.</sub>
</p>
