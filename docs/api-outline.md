# TaskFlow - Day 1: Architecture, Task Data Model & API Outline

## 1. Architecture Overview (Frontend, Backend & Database)
- **Frontend (HTML, CSS, JavaScript):** Displays the user interface (Add Task form and Task List) and sends HTTP requests (`fetch`) to the backend.
- **Backend (Node.js + Express):** Handles business logic, validates incoming task data, and exposes RESTful API endpoints for CRUD operations.
- **Database (SQLite):** Provides persistent storage in a local database table (`tasks`) so tasks remain saved after refreshing the browser or restarting the server.

## 2. Task Data Model (`tasks` Table)
Each task stored in the database will follow this schema:

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER (Primary Key) | Auto | Unique identifier for each task (Auto-incremented) |
| `title` | TEXT | Yes | Short title of the task (cannot be empty) |
| `description` | TEXT | No | Detailed notes or instructions for the task |
| `status` | TEXT | Yes | Current state: `'pending'` (default) or `'completed'` |
| `due_date` | TEXT | No | Optional target date in `YYYY-MM-DD` format |
| `created_at` | DATETIME | Auto | Timestamp when the task was created |

## 3. Planned REST API Routes (CRUD)

| CRUD Operation | HTTP Method | Endpoint | Purpose |
| :--- | :--- | :--- | :--- |
| **Create** | `POST` | `/tasks` | Create and save a new task in the database |
| **Read** | `GET` | `/tasks` | Fetch all saved tasks from the database |
| **Update** | `PUT` | `/tasks/:id` | Edit task details (title, description, due date) or toggle status (`pending` / `completed`) |
| **Delete** | `DELETE` | `/tasks/:id` | Permanently delete a task by its `id` |