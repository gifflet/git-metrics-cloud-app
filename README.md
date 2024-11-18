# 🌟 GitHub Stats Cloud

A modern web application that generates beautiful GitHub statistics badges and repository insights.

## ✨ Features

- 🎯 Generate embeddable GitHub stats badges
- 📊 View detailed repository information
- 🌓 Dark/Light mode support
- 📱 Responsive design
- ⚡ Built with Edge Runtime
- 📋 Easy copy-paste embedding

## 🚀 Demo

Visit the live application at [this link](https://git-metrics-cloud-app.pages.dev).

## 🛠️ Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Cloudflare Pages
- Edge Runtime

## 🏗️ Architecture

The application is built using Next.js App Router and deployed on Cloudflare Pages. It uses Edge Runtime for optimal performance and low latency. The backend API is powered by Cloudflare Workers.

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/github-stats-cloud.git
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env.local` file

```env
NEXT_PUBLIC_GITHUB_API_URL=https://github-stats-api.sousaguilherme89.workers.dev
```

4. Run the development server

```bash
npm run dev
```

## 🎨 Usage

### Generating a Badge

1. Visit the homepage
2. Enter a GitHub username
3. Select "Profile Badge" option
4. Copy either the Markdown or HTML code
5. Paste the code in your README or website

Example badge code:

[![GitHub Stats](https://github-stats-api.sousaguilherme89.workers.dev/gifflet/badge)](https://github-stats-api.sousaguilherme89.workers.dev/username)

### Viewing Repository Stats

1. Visit the homepage
2. Enter a GitHub username
3. Select "Repository List" option
4. Browse through the user's repositories with detailed statistics

## 🔧 API Reference

The application uses the following API endpoints:

### Get User Statistics
```http
GET /:username
```
Returns user's GitHub statistics including total stars, forks, and repositories.

### Generate Badge
```http
GET /:username/badge
```
Generates a SVG badge with user's GitHub statistics.

### List Repositories
```http
GET /:username/repositories
```
Returns a list of user's repositories with detailed information.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👏 Acknowledgments

- Next.js team for the amazing framework
- Cloudflare for the edge computing platform
- All contributors who help improve this project.
