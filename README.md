# EventfulEMS - Event Management System

EventfulEMS is a MERN stack event management system for planning campus events, viewing upcoming events, booking tickets, and generating QR-coded tickets.

## Features

* Schedule an event.
* View upcoming events.
* View events in a calendar.
* Book event tickets.
* Generate QR codes for booked tickets.
* View and delete user tickets.

## Tech Stack

* React 19
* Vite 8
* Tailwind CSS 4
* Node.js
* Express 5
* MongoDB Atlas
* Mongoose 9
* JWT authentication
* QR code generation

## Prerequisites

* Node.js 20 or newer
* npm
* A MongoDB Atlas connection string

## Environment Setup

Create `api/.env` for local development. You can copy `api/.env.example` first:

```env
MONGO_URL=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-secret
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
MONGO_DB_NAME=eventfulems
```

The frontend reads its API location from `VITE_API_BASE_URL`. If it is not set, local Vite dev uses `http://localhost:4000/api` and production uses `/api`.

## Install Dependencies

Open one terminal for the backend:

```bash
cd api
npm install
```

Open a second terminal for the frontend:

```bash
cd client
npm install
```

## Run Locally

Start the backend:

```bash
cd api
npm run dev
```

Start the frontend:

```bash
cd client
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Deploy On Render

This repo is ready for a single Render Web Service that serves both the Express API and the built React app.

### Option 1: Deploy From `render.yaml`

1. Push this repository to GitHub.
2. In Render, choose **New +** -> **Blueprint**.
3. Connect the GitHub repository.
4. Render will read `render.yaml` and create the web service.
5. Add your `MONGO_URL` value when Render asks for environment variables.
6. Deploy.

### Option 2: Create A Web Service Manually

In Render, choose **New +** -> **Web Service**, connect your repo, and use these settings:

```bash
Runtime: Node
Build Command: npm run render-build
Start Command: npm start
Health Check Path: /api/health
```

Add these environment variables in Render:

```env
NODE_ENV=production
MONGO_URL=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
JWT_SECRET=<long-random-secret>
MONGO_DB_NAME=eventfulems
```

For the single-service Render setup, do not set `VITE_API_BASE_URL`; the frontend will call `/api` on the same Render domain. For a separate frontend/backend deployment, set `VITE_API_BASE_URL` on the frontend to your backend URL ending in `/api`, and set `CLIENT_ORIGIN` on the backend to the frontend URL.

### Uploads Note

Uploaded event images are stored in `api/uploads`. Render free web services use an ephemeral filesystem, so new uploaded images can disappear after redeploys or restarts. For a production app, move uploads to persistent storage such as Cloudinary, S3, or a paid Render disk.

## Useful Commands

Backend:

```bash
cd api
npm start
```

Frontend:

```bash
cd client
npm run lint
npm run build
npm run preview
```
