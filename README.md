# PulseSocial — Real-Time Reactive Social Media Feed Platform

> **Skill-Nexus Capstone Project (Serial No. 2: Social Media Feed Application)**  
> Built with Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Serverless Route Handlers, Real-Time Polling/WebSockets, Interactive Polls, Syntax Highlighting, and Follower Graph.

---

## 🌟 Capabilities & Features

### 🚀 1. Feed & Post Interaction
- **Dual Tab Feeds**: "For You" global algorithm and "Following" filtered timeline.
- **Rich Post Composer**: 280 character countdown, media image preset picker, interactive 2-4 option Poll builder, and syntax-highlighted code snippet editor.
- **Instant Optimistic Actions**: Instant Like heart animation, expandable comment threads with immediate reply dispatch, bookmarking, and link sharing.
- **Dynamic Poll Telemetry**: Interactive voting with animated percentage bars and real-time total vote aggregation.
- **Live Stream Alerts**: Simulated real-time incoming updates pill with 1-click feed reload.

### 👤 2. Profiles, Followers & Bookmarks
- **Comprehensive User Profile Pages (`/profile/[handle]`)**: Banner imagery, avatar, bio, external links, follower/following metrics, and tabbed post filters (Posts, Likes, Media).
- **1-Click Persona Switcher**: Seamlessly switch between test developer profiles (Yash, Sarah Chen, Alex Rivera, Marcus Brody).
- **Notifications Hub (`/notifications`)**: Interactive event timeline for likes, replies, and follower additions with bulk read markers.
- **Explore & Trending (`/explore`)**: Dynamic hashtag filtering (`#Nextjs14`, `#React19`, `#AIEngineering`, `#TypeScript`, `#WebDev`).

---

## 🚀 Quick Start (Local Run)

```bash
cd social-media-feed-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the live feed.

---

## 🌐 Deploy to GitHub & Vercel Guide

```bash
# Push to GitHub
git init
git add .
git commit -m "feat: complete real-time social media feed capstone project"
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/pulse-social-feed.git
git branch -M main
git push -u origin main
```

Deploy on [Vercel](https://vercel.com): Import the repository, select Next.js, and click **Deploy**.
