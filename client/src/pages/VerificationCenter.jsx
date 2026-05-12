import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { Navigate, useLocation } from "react-router-dom";

export default function VerificationCenter() {
  const { user, loading } = useContext(UserContext);
  const [tickets, setTickets] = useState([]);
  const [query, setQuery] = useState("");
  const location = useLocation();

  const fetchTickets = useCallback(async () => {
    if (!user?._id) return;
    const response = await axios.get(`/tickets/user/${user._id}`);
    setTickets(response.data);
  }, [user]);

  useEffect(() => {
    fetchTickets().catch((error) => console.error("Error loading verification center:", error));
  }, [fetchTickets]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-lg text-slate-500">
        Loading verification center...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  const matchedTicket = tickets.find((ticket) =>
    (ticket.ticketCode || ticket._id).toLowerCase() === query.trim().toLowerCase()
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-grow flex-col gap-6 px-6 py-10">
      <section className="rounded-lg bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-extrabold">Center</h1>
        <p className="mt-2 text-slate-500">Check a wallet ticket by entering its ticket ID.</p>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="EVE-..."
          className="mt-6 w-full rounded-md border border-slate-200 bg-slate-50 p-3 font-mono outline-none focus:border-primary"
        />
      </section>

      {query && (
        <section className={`rounded-lg p-6 shadow-sm ${matchedTicket ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"}`}>
          {matchedTicket ? (
            <div>
              <h2 className="text-xl font-bold">Ticket verified</h2>
              <p className="mt-2">{matchedTicket.ticketDetails.eventname} for {matchedTicket.ticketDetails.name}</p>
              <p className="mt-1 font-mono">{matchedTicket.ticketCode}</p>
            </div>
          ) : (
            <h2 className="text-xl font-bold">No matching ticket found</h2>
          )}
        </section>
      )}
    </div>
  );
}
