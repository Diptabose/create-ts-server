# Prebuilt MERN Server CLI

A fast and opinionated Node.js CLI tool to scaffold a prebuilt **MERN-style server** with TypeScript, Express, and a ready-to-use folder structure. Perfect for quickly starting backend projects with all essential boilerplate in place.

---

## Features

- Create a **project root folder** with a valid name.
- Initialize **npm package** with `"type": "module"`.
- Automatically install **dependencies**:
  - `express`, `cors`
- Automatically install **dev dependencies**:
  - `typescript`, `nodemon`, `@types/express`, `@types/cors`
- Prebuilt **TypeScript project setup** with `tsconfig.json`.
- Generates a **`src` folder** with subfolders:
  - `controllers`, `middlewares`, `routes`, `services`, `types`, `utils`
- Creates an **`index.ts`** file to start coding immediately.
- Provides **npm scripts** for build and development:
  - `npm run build:watch` – watch and compile TypeScript
  - `npm run dev:watch` – start server in watch mode

---

## Installation

Make sure you have **Node.js v18+** installed.

```bash
# Clone the repository
git clone https://github.com/Diptabose/create-ts-server.git
cd create-mer-server

```
