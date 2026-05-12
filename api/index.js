const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const UserModel = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Ticket = require("./models/Ticket");
const { randomUUID } = require("crypto");

const app = express();
const api = express.Router();

const bcryptSalt = bcrypt.genSaltSync(10);
const isProduction = process.env.NODE_ENV === "production";
const clientDistPath = path.join(__dirname, "..", "client", "dist");
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const cookieOptions = {
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
};
const jwtSecret = process.env.JWT_SECRET; // ✅ From .env, never hardcoded

app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors((req, callback) => {
    const origin = req.header("Origin");
    const requestHost = req.get("host");
    let originAllowed = !origin || allowedOrigins.includes(origin);

    if (!originAllowed && requestHost) {
      try {
        originAllowed = new URL(origin).host === requestHost;
      } catch {
        originAllowed = false;
      }
    }

    callback(null, {
      origin: originAllowed ? origin : false,
      credentials: true,
    });
  })
);
// ✅ Serve uploaded images as static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

if (!process.env.MONGO_URL) {
  console.error("MONGO_URL is missing. Add it to api/.env before starting.");
  process.exit(1);
}

if (!jwtSecret) {
  console.error("JWT_SECRET is missing. Add it to your environment before starting.");
  process.exit(1);
}

// ✅ Auto-create uploads/ directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // ✅ Prevent filename collisions
  },
});

const upload = multer({ storage });

api.get("/test", (req, res) => {
  res.json("test ok");
});

api.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
  });
});

api.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await UserModel.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    jwt.sign(
      { email: userDoc.email, id: userDoc._id },
      jwtSecret,
      {},
      (err, token) => {
        if (err) return res.status(500).json({ error: "Failed to generate token" });
        res.cookie("token", token, cookieOptions).json(userDoc);
      }
    );
  } catch (e) {
    res.status(422).json(e);
  }
});

api.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await UserModel.findOne({ email });
  if (!userDoc) return res.status(404).json({ error: "User not found" });

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (!passOk) return res.status(401).json({ error: "Invalid password" });

  jwt.sign(
    { email: userDoc.email, id: userDoc._id },
    jwtSecret,
    {},
    (err, token) => {
      if (err) return res.status(500).json({ error: "Failed to generate token" });
      res.cookie("token", token, cookieOptions).json(userDoc);
    }
  );
});

api.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.json(null); // ✅ Early return if no token

  // ✅ Return error response instead of throwing
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) return res.clearCookie("token", cookieOptions).status(401).json({ error: "Invalid token" });
    const userDoc = await UserModel.findById(userData.id);
    if (!userDoc) return res.clearCookie("token", cookieOptions).json(null);
    const { name, email, _id } = userDoc;
    res.json({ name, email, _id });
  });
});

api.post("/logout", (req, res) => {
  res.clearCookie("token", cookieOptions).json(true);
});

const eventSchema = new mongoose.Schema({
  owner: String,
  title: String,
  description: String,
  organizedBy: String,
  eventDate: Date,
  eventTime: String,
  location: String,
  Participants: Number,
  Count: Number,
  Income: Number,
  ticketPrice: Number,
  Quantity: Number,
  image: String,
  ownerName: String,
  likes: { type: Number, default: 0 }, // ✅ Default prevents NaN on likes += 1
  Comment: [String],
});

const Event = mongoose.model("Event", eventSchema);

api.post("/createEvent", upload.single("image"), async (req, res) => {
  try {
    const eventData = req.body;
    eventData.image = req.file ? `/uploads/${req.file.filename}` : "";
    eventData.Count = Number(eventData.Count || 0);
    eventData.Quantity = Number(eventData.Quantity || eventData.Participants || 0);
    eventData.ticketPrice = Number(eventData.ticketPrice || 0);
    const newEvent = new Event(eventData);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: "Failed to save the event to MongoDB" });
  }
});

api.get("/createEvent", async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events from MongoDB" });
  }
});

api.get("/event/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id);
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch event from MongoDB" });
  }
});
api.delete("/event/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete event" });
  }
});

api.post("/event/:eventId", async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    event.likes = (event.likes || 0) + 1; // ✅ Guard against undefined
    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

api.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

api.get("/event/:id/ordersummary", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch event from MongoDB" });
  }
});

api.get("/event/:id/ordersummary/paymentsummary", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch event from MongoDB" });
  }
});
api.get("/events/user/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    const events = await Event.find({ $or: [{ owner: user._id.toString() }, { owner: user.name }, { ownerName: user.name }] });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user events" });
  }
});

// api.post("/tickets", async (req, res) => {
//   try {
//     const newTicket = new Ticket(req.body);
//     await newTicket.save();
//     return res.status(201).json({ ticket: newTicket });
//   } catch (error) {
//     return res.status(500).json({ error: "Failed to create ticket" });
//   }
// });
// api.post("/tickets", async (req, res) => {
//   try {
//     const newTicket = new Ticket(req.body);
//     await newTicket.save();

//     // ✅ Increment Count on the event every time a ticket is bought
//     await Event.findByIdAndUpdate(
//       req.body.eventid,
//       { $inc: { Count: req.body.count } }
//     );

//     return res.status(201).json({ ticket: newTicket });
//   } catch (error) {
//     return res.status(500).json({ error: "Failed to create ticket" });
//   }
// });
api.post("/tickets", async (req, res) => {
  try {
    const userId = req.body.userid;
    const eventId = req.body.eventid;
    const count = Math.min(Math.max(Number(req.body.count || 1), 1), 10);

    if (!userId || !eventId) {
      return res.status(400).json({ error: "User and event are required" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const existingTickets = await Ticket.find({ userid: userId, eventid: eventId });
    const alreadyBought = existingTickets.reduce((total, ticket) => total + Number(ticket.count || 0), 0);
    if (alreadyBought + count > 10) {
      return res.status(400).json({
        error: `Ticket limit reached. You can buy ${Math.max(10 - alreadyBought, 0)} more ticket(s) for this event.`,
      });
    }

    const soldCount = Number(event.Count || 0);
    const maxTickets = Number(event.Quantity || 0);
    if (maxTickets > 0 && soldCount + count > maxTickets) {
      return res.status(400).json({ error: "Not enough tickets are available for this event." });
    }

    const ticketCode = `EVE-${Date.now().toString(36).toUpperCase()}-${randomUUID().slice(0, 8).toUpperCase()}`;
    const ticketPrice = Number(req.body.ticketDetails?.ticketprice || event.ticketPrice || 0);
    const newTicket = new Ticket({
      ...req.body,
      count,
      ticketCode,
      ticketDetails: {
        ...req.body.ticketDetails,
        eventname: req.body.ticketDetails?.eventname || event.title,
        eventdate: req.body.ticketDetails?.eventdate || event.eventDate,
        eventtime: req.body.ticketDetails?.eventtime || event.eventTime,
        ticketprice: ticketPrice,
        totalPrice: ticketPrice * count,
      },
    });
    await newTicket.save();

    event.Count = soldCount + count;
    await event.save();

    return res.status(201).json({ ticket: newTicket });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create ticket" });
  }
});
api.get("/tickets/:id", async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

api.get("/tickets/user/:userId", async (req, res) => {
  try {
    const tickets = await Ticket.find({ userid: req.params.userId });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user tickets" });
  }
});

api.delete("/tickets/:id", async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete ticket" });
  }
});

const PORT = process.env.PORT || 4000;

app.use("/api", api);

if (!isProduction) {
  app.use("/", api);
}

if (isProduction && fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

// ✅ Atlas-compatible connection with timeout option
mongoose
  .connect(process.env.MONGO_URL, {
    dbName: process.env.MONGO_DB_NAME || "eventfulems",
    serverSelectionTimeoutMS: 5000, // Fail fast if Atlas is unreachable
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
