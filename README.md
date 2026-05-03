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

Create `api/.env` and add your MongoDB Atlas URL:

```env
MONGO_URL=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
PORT=4000
```

The app currently expects the API on `http://localhost:4000` and the frontend on `http://localhost:5173`.

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
