 

📋 Pastebin Lite

A lightweight Pastebin-like application built as part of a take-home assignment.
Users can create text pastes, optionally configure time-to-live (TTL) or maximum view limits, and share a link to view the content securely.

🔗 Live Demo

Deployed URL
👉 https://pastebin-lite-aganitha.vercel.app

(Replace with your actual Vercel URL if needed)

GitHub Repository
👉 https://github.com/your-username/Pastebin-Lite-Aganitha

(Update with your real repository link)

✨ Features Implemented

Create Paste
POST /api/pastes

View Paste (HTML)
GET /p/:id

Fetch Paste (JSON API)
GET /api/pastes/:id
(Counts as a view)

Health Check
GET /api/healthz

Optional TTL (time-based expiry) and/or maximum view count

Paste becomes unavailable when either constraint is exceeded

Safe HTML rendering (escaped content)

Deterministic testing support

TEST_MODE=1

x-test-now-ms request header

Proper 404 handling for:

Expired pastes

View limit exceeded

Non-existent pastes

🛠 Tech Stack

Runtime: Node.js + Express.js

Database: PostgreSQL (Neon.tech – free tier)

ORM: Prisma

ID Generation: nanoid (10 characters)

Deployment: Vercel (Serverless)

⚙️ Local Setup
✅ Prerequisites

Node.js ≥ 18

PostgreSQL database
(Recommended: free Neon.tech account)

🚀 Installation Steps
1️⃣ Clone the Repository
git clone https://github.com/your-username/Pastebin-Lite-Aganitha.git
cd Pastebin-Lite-Aganitha
2️⃣ Install Dependencies
npm install
3️⃣ Create .env File (Project Root)
DATABASE_URL=postgresql://[user]:[password]@[your-neon-host]/dbname?sslmode=require&channel_binding=require
PORT=3000
TEST_MODE=0
4️⃣ Generate Prisma Client & Sync Schema
npx prisma generate
npx prisma db push
5️⃣ Start Development Server
npm run dev

🌐 Open in browser:

http://localhost:3000
🧪 Quick Local Test Commands
✅ Health Check
curl http://localhost:3000/api/healthz
✅ Create Paste Example
curl -X POST http://localhost:3000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello world from Manish",
    "ttl_seconds": 3600,
    "max_views": 5
  }'