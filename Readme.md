Community Hub 🚀

A real-time, full-stack community management platform built for speed, scalability, and secure interaction.

🌟 Overview

Community Hub is a real-time messaging application that allows users to create, join, and interact within dedicated communities. The architecture focuses on performance and reliability, utilizing Redis for state management and rate-limiting, and Socket.io for low-latency communication.

🛠 Tech Stack

Frontend: React, Tailwind CSS, Axios, Socket.io-client

Backend: Node.js, Express, TypeScript

Database: PostgreSQL with Prisma ORM

Caching: Redis

Auth: JWT & Bcrypt

🔑 Key Features

Secure Auth: Stateless authentication using JWT stored in HttpOnly cookies.

Real-time Chat: Instant messaging using Socket.io rooms.

Transactional Integrity: Database operations (creating/joining communities) are handled via Prisma Transactions.

Rate Limiting: A custom Redis-based middleware that protects the API from abuse.

Modern UI: Clean, responsive design.

🚀 Getting Started

Installation

git clone https://github.com/yourusername/community-hub.git
npm install


Environment Setup

Create a .env file and configure the following:

DATABASE_URL="..."
JWT_TOKEN="..."
REDIS_URL="..."


📈 Future Roadmap

[ ] Implement the Repository Pattern

[ ] Add Unit/Integration Tests

[ ] Redis Streams Integration