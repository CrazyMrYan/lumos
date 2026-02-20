# Lumos 🪄

**Lumos** is an AI-native "Concept-to-Presentation" engine. It transforms a single Markdown source into stunning, interactive **Slides** and **Mind Maps** instantly.

> **One Source, Infinite Views.**
> Stop formatting. Start creating.

![Lumos Preview](https://via.placeholder.com/1200x600?text=Lumos+Preview+Coming+Soon)

## ✨ Key Features

- **📝 Immersive Editor**: 
  - Full-screen Markdown editor powered by **Vditor**.
  - Instant Rendering (IR) mode for WYSIWYG experience.
  - Source code mode for power users.

- **📊 Dynamic Mind Map**: 
  - Real-time visualization using **Markmap**.
  - **Auto-Layout**: Automatically folds nodes deeper than level 2.
  - **Dark/Light Mode**: Independent theme switching for comfortable viewing.
  - **SVG Export**: Download high-quality vector graphics.

- **📽️ Presentation Deck**: 
  - Professional slides powered by **Reveal.js**.
  - **10+ Themes**: Dracula (Default), Black, White, League, Sky, etc.
  - **Smart Navigation**: Keyboard support (Arrow keys) and Progress bar.
  - **HTML Export**: Download a portable, self-contained HTML file to present anywhere (no internet required).

- **💾 Local First**: 
  - Everything is saved to your browser's **Local Storage** instantly.
  - No login required. No cloud latency. 

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Editor**: [Vditor](https://github.com/Vanessa219/vditor)
- **Visualization**: 
  - [Markmap](https://markmap.js.org/) (Mind Map)
  - [Reveal.js](https://revealjs.com/) (Slides)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/CrazyMrYan/lumos.git
   cd lumos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000).

## 📦 Deployment

This project is optimized for static export (`next build && next export`). It can be deployed to:
- GitHub Pages
- Vercel
- Netlify
- Any static hosting service

## 📄 License

Private Project. All rights reserved.
