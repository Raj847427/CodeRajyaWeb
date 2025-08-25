CodeRajya

CodeRajya is a full-stack web application built with React + Vite + TypeScript on the frontend and Node.js + Express on the backend. It uses TailwindCSS and Radix UI for styling and components, with Drizzle ORM and Neon (serverless PostgreSQL) as the database layer.

🚀 Tech Stack

Frontend: React, Vite, TypeScript

Styling: TailwindCSS, Radix UI

Backend: Node.js, Express

Database: Drizzle ORM + Neon (PostgreSQL)

Tooling: esbuild, tsx, Replit plugins

📦 Getting Started
Prerequisites

Make sure you have installed:

Node.js
 (>= 18)

npm

Installation
# Clone the repo
git clone https://github.com/your-username/CodeRajya.git
cd CodeRajya

# Install dependencies
npm install

Running in Development
npm run dev


This will run both the frontend and backend in development mode.

Build & Production
# Build frontend + backend
npm run build

# Start production server
npm start

Database Setup

CodeRajya uses Drizzle ORM with Neon (PostgreSQL).

Configure your database URL in .env. Example:

DATABASE_URL="postgres://user:password@hostname/dbname"


Push schema changes:

npm run db:push

📂 Project Structure
CodeRajya/
 ├── server/          # Backend (Express + Drizzle)
 ├── src/             # Frontend (React + Vite)
 ├── package.json     # Dependencies & scripts
 ├── tailwind.config.ts
 └── vite.config.ts

🤝 Contributing

Contributions are welcome! Please open issues and pull requests.

Fork the repo

Create your feature branch (git checkout -b feature/my-feature)

Commit your changes (git commit -m 'Add feature')

Push to branch (git push origin feature/my-feature)

Open a PR

📜 License

This project is licensed under the MIT License.
