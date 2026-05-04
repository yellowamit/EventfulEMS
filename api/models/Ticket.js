const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
   userid: { type: String, require: true },
   eventid: { type: String, require: true },
   ticketCode: { type: String, required: true, unique: true },
   ticketDetails: {
      name: { type: String, required: true },
      email: { type: String, require: true },
      eventname: { type: String, require: true },
      eventdate: { type: Date, require: true },
      eventtime: { type: String, require: true },
      ticketprice: { type: Number, require: true },
      totalPrice: { type: Number, default: 0 },
      qr: { type: String, require: true },
   },
   count: { type: Number, default: 1, min: 1, max: 10 },
}, { timestamps: true });

const TicketModel = mongoose.model(`Ticket`, ticketSchema);
module.exports = TicketModel;
