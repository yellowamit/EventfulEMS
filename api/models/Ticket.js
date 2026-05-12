const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      default: uuidv4,
      unique: true,
    },

    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    eventid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    ticketCode: {
      type: String,
      unique: true,
    },

    ticketDetails: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },

      eventname: {
        type: String,
        required: true,
      },

      eventdate: {
        type: Date,
        required: true,
      },

      eventtime: {
        type: String,
        required: true,
      },

      ticketprice: {
        type: Number,
        required: true,
        min: 0,
      },

      totalPrice: {
        type: Number,
        default: 0,
        min: 0,
      },

      qr: {
        type: String,
        required: true,
      },
    },

    count: {
      type: Number,
      default: 1,
      min: 1,
      max: 10,
    },

    status: {
      type: String,
      enum: ["active", "used", "cancelled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ticket", ticketSchema);