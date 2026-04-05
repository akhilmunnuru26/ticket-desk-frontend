# Zeto Ticket Desk - Frontend UI

This is the frontend user interface for the Zeto Ticket Desk application. It is a modern, responsive single-page application built to consume the Zeto Backend API. It leverages React Query for aggressive caching, background fetching, and optimistic UI updates.

## Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **State Management / Data Fetching:** TanStack React Query & Axios
* **Styling:** Tailwind CSS
* **Form Validation:** React Hook Form
* **Icons:** Lucide React

## Project Structure

```text
├── src/
│   ├── app/            # Next.js App Router pages and layouts
│   ├── hooks/          # Custom React Query hooks for API interaction
│   ├── lib/            # Axios API client and Provider configurations
│   ├── types/          # TypeScript interface definitions
│   └── globals.css     # Tailwind CSS base styles
├── .env.local.example  # Example environment variables
└── package.json

```
## Getting Started

**Prerequisites**
Node.js (v18+ recommended)

**Important**: Ensure the Zeto Backend API is running locally on port 5000 before starting the frontend.

## Installation

1. **Clone the repository**:

```bash
https://github.com/akhilmunnuru26/ticket-desk-frontend.git
cd frontend
```

2. **Install dependencies**:

```bash
npm install
```

3. **Environment Variables**:
Create a .env.local file in the root directory to point to your backend API:

**NEXT_PUBLIC_API_URL**=http://localhost:5000/api

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

5.**View the Application**:
Open your browser and navigate to http://localhost:3000.

### Key Features

**Real-time synchronization**: UI updates instantly upon creating tickets or changing statuses utilizing React Query cache invalidation.

**Form Validation**: Strict client-side validation using React Hook Form to prevent bad data submissions.

**Dynamic Routing**: Seamless navigation between the main dashboard and specific ticket details.



postgresql://zeto_ticket_db_user:5TyiSRyQGp0DZEsPuIG6XEmUFTjZlPpC@dpg-d78v1qfkijhs738k9u2g-a.oregon-postgres.render.com/zeto_ticket_db?sslmode=require