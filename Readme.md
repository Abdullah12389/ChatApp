<html>
<body class="bg-gray-50 text-gray-900 font-sans leading-relaxed">

    <main class="max-w-4xl mx-auto p-6 md:p-12">
        <header class="mb-12 text-center md:text-left">
            <h1 class="text-5xl font-black text-purple-900 mb-4">Community Hub 🚀</h1>
            <p class="text-xl text-gray-600">A real-time, full-stack community management platform built for speed, scalability, and secure interaction.</p>
        </header>

        <section class="mb-12">
            <h2 class="text-3xl font-bold text-gray-950 mb-4">🌟 Overview</h2>
            <p class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-gray-700">
                Community Hub is a real-time messaging application that allows users to create, join, and interact within dedicated communities. The architecture focuses on performance and reliability, utilizing <strong>Redis</strong> for state management and rate-limiting, and <strong>Socket.io</strong> for low-latency communication.
            </p>
        </section>

        <section class="mb-12 grid md:grid-cols-2 gap-8">
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 class="text-xl font-bold text-purple-800 mb-4">🛠 Tech Stack</h3>
                <ul class="list-disc list-inside space-y-2 text-gray-700">
                    <li><strong>Frontend:</strong> React, Tailwind CSS, Axios, Socket.io-client</li>
                    <li><strong>Backend:</strong> Node.js, Express, TypeScript</li>
                    <li><strong>Database:</strong> PostgreSQL with <strong>Prisma ORM</strong></li>
                    <li><strong>Caching:</strong> Redis</li>
                    <li><strong>Auth:</strong> JWT & Bcrypt</li>
                </ul>
            </div>
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 class="text-xl font-bold text-purple-800 mb-4">🔑 Key Features</h3>
                <ul class="list-disc list-inside space-y-2 text-gray-700">
                    <li>Secure Auth (HttpOnly Cookies)</li>
                    <li>Real-time Chat via Socket.io</li>
                    <li>Transactional Integrity (Prisma)</li>
                    <li>Custom Redis Rate Limiting</li>
                    <li>Glassmorphism UI</li>
                </ul>
            </div>
        </section>

        <section class="mb-12">
            <h2 class="text-3xl font-bold text-gray-950 mb-6">🚀 Getting Started</h2>
            <div class="bg-gray-900 text-gray-100 p-8 rounded-2xl font-mono text-sm shadow-xl">
                <h4 class="text-purple-400 font-bold mb-2 uppercase tracking-wider">Installation</h4>
                <p class="mb-4">git clone https://github.com/yourusername/community-hub.git</p>
                <p class="mb-4">npm install</p>
                <h4 class="text-purple-400 font-bold mb-2 mt-6 uppercase tracking-wider">Environment Setup</h4>
                <p>DATABASE_URL="..."</p>
                <p>JWT_TOKEN="..."</p>
                <p>REDIS_URL="..."</p>
            </div>
        </section>

        <section class="bg-white p-8 rounded-2xl border border-purple-100">
            <h2 class="text-2xl font-bold text-gray-950 mb-4">📈 Future Roadmap</h2>
            <ul class="space-y-3">
                <li class="flex items-center gap-3 text-gray-600">
                    <span class="w-4 h-4 rounded border border-gray-300"></span> Implement Repository Pattern
                </li>
                <li class="flex items-center gap-3 text-gray-600">
                    <span class="w-4 h-4 rounded border border-gray-300"></span> Add Unit/Integration Tests
                </li>
                <li class="flex items-center gap-3 text-gray-600">
                    <span class="w-4 h-4 rounded border border-gray-300"></span> Redis Streams Integration
                </li>
            </ul>
        </section>
    </main>

</body>
</html>