# Team Leave & On-Call Manager

A responsive web application for managing team leave requests and tracking on-call rotations. It automatically detects scheduling conflicts when an on-call team member has approved leave requests during their assigned week.

---

## Technical Stack
- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Containerization:** Docker, Docker Compose

## Architecture & Design Patterns
- **Multi-layered Architecture (N-Tier):** The backend is strictly structured into Routes, Controllers, Services, and Repositories. This guarantees a clean separation of concerns:
- **Routes:** Map endpoints to controllers.
- **Controllers:** Handle HTTP requests/responses and API input validation.
- **Services:** Contain encapsulated domain business logic (e.g., date processing, conflict detection).
- **Repositories:** Manage raw database abstraction and direct SQL operations.
- **Component-Driven Frontend:** The React frontend is fully modularized into isolated, reusable presentation and state components (LeaveForm, LeaveTable, OnCallSchedule).

---

## How to Run the Application

### Method 1: Docker Compose (Recommended)
The easiest way to run the entire stack (Database, API, Frontend). Run this single command in the project root to clean up any cached volumes and start the app:

```bash
docker-compose down --volumes --remove-orphans
docker-compose up --build
```
 ## Once the containers are running:
   - **Frontend App:** http://localhost:3000
   - **Backend API:** http://localhost:5000
   - **PostgreSQL Database:** localhost:5432

### Method 2: Manual Node.js Setup
If you want to run the components manually without Docker:

#### 1. Database Setup
1. Set up a PostgreSQL instance.
2. Create a database named `leave_calendar`.
3. Run the schema initializer found in `backend/src/db/init.sql` to create the tables (`users`, `leave_requests`) and seed default team members.

#### 2. Backend API Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder containing:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://<user>:<password>@localhost:5432/leave_calendar
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

#### 3. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` folder containing:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000 in your browser.

---

## Design Decisions & Assumptions
1. **camelCase JavaScript Transition:** The database uses standard `snake_case` naming conventions for PostgreSQL tables and column names (`employee_name`, `start_date`, etc.). The repository layer dynamically maps columns to `camelCase` properties at the query boundary (e.g. `employee_name AS "employeeName"`), allowing the rest of the JavaScript codebase (both frontend and backend) to remain strictly camelCase.
2. **Stable Dynamic On-Call Rotation:** The application fetches the list of team members dynamically from the database and sorts them by their IDs to produce a stable, predictable rotation cycle.
3. **Strict Year Range Validation:** Validating standard JavaScript date parsing is not sufficient since inputs with long/weird numbers can produce valid parsed objects. I implemented a backend check restricting leave dates to years between `2000` and `2100`.
4. **No "partial" leave:** I assumed that all leave requests are full-day events. The current system and schema do not support hourly or half-day leaves.
5. **No automatic replacement:** I assumed that when an on-call conflict is detected (the assigned person is on leave), the system only flags a conflict alert but does not automatically swap them for the next available team member. Rotation changes must be resolved manually by management.
6. **Week Definition (ISO-8601):** I assumed that weeks start on Monday and end on Sunday, and the first week of the year contains at least 4 days of that year. The native JavaScript date calculations follow this behavior.
7. **Weekly Leave Conflict Rounding:** For on-call conflict checks, I assumed that if a team member is on leave for even a single day during their on-call week, the entire week is flagged as conflicted.
8. **No Leave Status Management:** I assumed that leave requests are created in "Pending" status by default and can only be transitioned to "Approved" or "Rejected" by an administrator.
9. **No "Change Team Member" Feature:** I assumed that the list of team members is static and cannot be modified through the interface. Editing team members is not implemented.

---

## Features Not Completed
- **None:** All core requirements and requested fixes (refactoring, validation checks, database connection recovery, self-conflict fixes, and date bounds checks) are fully implemented.

---

## Optional Improvements Added
- **Leave Approval Feedback (Comments Workflow):** Admins can add optional comments when approving or rejecting a leave request. These comments are saved in the database and displayed inline in the leave requests table.
- **Detailed On-Call Conflict Highlights:** Instead of just a generic "Conflict" warning, the on-call schedule card displays the precise start/end dates and the reasons for any overlapping leave requests.
- **Centralized API Client:** Created a clean `apiClient` service in the frontend to isolate network fetch logic, endpoint construction, and response parsing.
- **Docker Compose:** The application is containerized using Docker Compose, which includes the database, backend, and frontend.
- **REST API Documentation:** Added a comprehensive REST API documentation.

---

## REST API Documentation

All API endpoints expect and return JSON payloads. Date parameters should be formatted as `YYYY-MM-DD` string format.

### 1. Users Endpoint
- **`GET /api/users`**
  - **Description:** Fetches the list of all team members.
  - **Response (200 OK):**
    ```json
    [
      { "id": 1, "name": "Alice" },
      { "id": 2, "name": "Bob" }
    ]
    ```

### 2. Leave Requests Endpoints
- **`GET /api/leaves`**
  - **Description:** Fetches all leave requests.
  - **Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "employeeName": "Alice",
        "startDate": "2026-06-17T00:00:00.000Z",
        "endDate": "2026-06-26T00:00:00.000Z",
        "reason": "Family vacation",
        "status": "Approved",
        "comment": "Have fun!"
      }
    ]
    ```

- **`POST /api/leaves/create`**
  - **Description:** Creates a new leave request.
  - **Request Body:**
    ```json
    {
      "employeeName": "Charlie",
      "startDate": "2026-07-20",
      "endDate": "2026-07-25",
      "reason": "Summer Trip"
    }
    ```
  - **Response (201 Created):**
    ```json
    {
      "id": 6,
      "employeeName": "Charlie",
      "startDate": "2026-07-20T00:00:00.000Z",
      "endDate": "2026-07-25T00:00:00.000Z",
      "reason": "Summer Trip",
      "status": "Pending",
      "comment": null,
      "warning": "Ez a kérés átfedésben van más csapattagok kéréseivel!" // (Optional overlap warning message)
    }
    ```

- **`PUT /api/leaves/approve/:id`**
  - **Description:** Approves a pending leave request, setting an optional feedback comment.
  - **Request Body:**
    ```json
    {
      "comment": "Approved!"
    }
    ```
  - **Response (200 OK):** The updated leave request object.

- **`PUT /api/leaves/reject/:id`**
  - **Description:** Rejects a pending leave request, setting an optional feedback comment.
  - **Request Body:**
    ```json
    {
      "comment": "Rejected due to capacity limits."
    }
    ```
  - **Response (200 OK):** The updated leave request object.

- **`PUT /api/leaves/update/:id`**
  - **Description:** Updates details of an existing leave request.
  - **Request Body:** Same as `POST /api/leaves/create`.
  - **Response (200 OK):** The updated leave request object.

- **`DELETE /api/leaves/delete/:id`**
  - **Description:** Deletes a leave request.
  - **Response (200 OK):**
    ```json
    "Sikeresen törölve"
    ```

### 3. On-Call Schedule Endpoint
- **`GET /api/oncalls/upcoming-weeks`**
  - **Description:** Generates the on-call schedule for the next 5 weeks, computing overlapping leave conflicts dynamically.
  - **Response (200 OK):**
    ```json
    [
      {
        "week": 23,
        "employee": "Charlie",
        "hasConflict": false,
        "conflicts": []
      },
      {
        "week": 25,
        "employee": "Alice",
        "hasConflict": true,
        "conflicts": [
          {
            "startDate": "2026-06-17T00:00:00.000Z",
            "endDate": "2026-06-26T00:00:00.000Z",
            "reason": "Family vacation"
          }
        ]
      }
    ]
    ```

---

## Future Improvements & Roadmap
While the core functionality of the application is fully implemented, the codebase was structured to easily accommodate the following production-ready enhancements:

### Transition to Modern ORM (Prisma):
- Migrate the current raw SQL repository layer to Prisma ORM.
- This will eliminate manual string queries, introduce compile-time type safety for database models, and abstract away custom column mapping.

### Strict Data Transfer Objects (DTO) & Schema Validation (Zod):
- Introduce DTOs to govern data payloads crossing the API boundary.
- Use Zod schemas inside controllers to strictly validate incoming requests, decoupling runtime business logic from raw payload validation and improving API error responses.

### Authentication & Authorization (RBAC):
- Implement JWT-based authentication (using bcrypt for password hashing).
- Introduce Role-Based Access Control (RBAC) to differentiate between standard Employees (who can only request leave) and Administrators (who can approve/reject requests and modify schedules).

### Automated On-Call Replacement Logic:
- Instead of just flag-marking a conflict, implement an intelligent, automated engine that suggests or automatically assigns the next eligible, non-conflicted team member in the rotation when a conflict is detected.

### Advanced Date and Time Management:
- Migrate native JavaScript date calculations to a dedicated, lightweight library like Date-fns or Luxon to robustly handle complex timezone mutations, daylight saving transitions, and custom corporate holiday calendars.

### Notifications & Third-Party Integrations:
- Add Email notifications (via Nodemailer/SendGrid) or Slack Webhooks to instantly notify employees when their leave request status changes, or to alert managers about newly filed requests.
- Sync approved leave requests and on-call schedules directly into external calendars via the Google Calendar API or iCal feeds.

### Adding Tests:
- Add backend integration tests using Jest and supertest to automatically verify the overlap validation logic.
- Add frontend component testing using React Testing Library and End-to-End (E2E) testing with Cypress or Playwright.