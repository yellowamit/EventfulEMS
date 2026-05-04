// import React from 'react'

import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";


export default function UserAccountPage() {
  const {user} = useContext(UserContext);
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState([]);

  const fetchAccountData = useCallback(async () => {
    if (!user?._id) return;
    const [ticketResponse, eventResponse] = await Promise.all([
      axios.get(`/tickets/user/${user._id}`),
      axios.get(`/events/user/${user._id}`),
    ]);
    setTickets(ticketResponse.data);
    setEvents(eventResponse.data);
  }, [user]);

  useEffect(() => {
    fetchAccountData().catch((error) => console.error("Error loading account data:", error));
  }, [fetchAccountData]);

  if(!user){
    return <Navigate to={'/login'} />
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-grow flex-col gap-6 px-6 py-10">
      <section className="rounded-lg bg-white p-8 shadow-lg dark:bg-slate-900">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-black text-white">
              {user.name?.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">{user.name}</h1>
              <p className="text-slate-500 dark:text-slate-300">{user.email}</p>
            </div>
          </div>
          <Link to="/createEvent"><button className="primary">Create Event</button></Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-500">Tickets Bought</p>
          <p className="mt-2 text-4xl font-black">{tickets.reduce((total, ticket) => total + Number(ticket.count || 1), 0)}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-500">Events Created</p>
          <p className="mt-2 text-4xl font-black">{events.length}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-500">Total Spend</p>
          <p className="mt-2 text-4xl font-black">Rs. {tickets.reduce((total, ticket) => total + Number(ticket.ticketDetails?.totalPrice || ticket.ticketDetails?.ticketprice || 0), 0)}</p>
        </div>
      </section>

      <section className="rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900">
        <h2 className="text-xl font-bold">Recent Tickets</h2>
        <div className="mt-4 grid gap-3">
          {tickets.slice(0, 4).map((ticket) => (
            <div key={ticket._id} className="flex flex-col justify-between rounded-md border border-slate-200 p-4 md:flex-row md:items-center dark:border-slate-700">
              <div>
                <p className="font-bold">{ticket.ticketDetails.eventname}</p>
                <p className="text-sm text-slate-500">{ticket.ticketCode || ticket._id}</p>
              </div>
              <p className="font-semibold">{ticket.count || 1} ticket(s)</p>
            </div>
          ))}
          {tickets.length === 0 && <p className="text-slate-500">No tickets yet.</p>}
        </div>
      </section>
    </div>
  );
}
