import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate, useLocation } from "react-router-dom";
import { AiFillCalendar } from "react-icons/ai";
import { MdLocationPin, MdDelete } from "react-icons/md";
import { apiUrl } from "../utils/api";
import { eventImageUrl } from "../utils/media";
import { UserContext } from "../UserContext";
import ConfirmDialog from "../components/ConfirmDialog";

export default function MyEventsPage() {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [message, setMessage] = useState(null);
  const { user, loading: userLoading } = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
    if (userLoading) return;
    if (!user?._id) {
      setLoading(false);
      return;
    }

    axios.get(`/events/user/${user._id}`)
      .then(response => {
        setMyEvents(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching my events:", error);
        setLoading(false);
      });
  }, [user, userLoading]);

  async function handleDelete() {
    if (!eventToDelete) return;

    try {
      const response = await fetch(apiUrl(`/event/${eventToDelete._id}`), {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        setMyEvents(prev => prev.filter(event => event._id !== eventToDelete._id));
        setMessage({ type: "success", text: `${eventToDelete.title} was deleted.` });
        setEventToDelete(null);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to delete the event." });
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      setMessage({ type: "error", text: "Something went wrong while deleting the event." });
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Loading your events...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <div className="flex flex-col mx-5 xl:mx-32 md:mx-10 mt-8">
      <ConfirmDialog
        open={!!eventToDelete}
        title="Delete event?"
        message={`This will permanently delete "${eventToDelete?.title}". Tickets already sold for this event may still exist in attendee wallets.`}
        confirmText="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setEventToDelete(null)}
      />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold">My Events</h1>
        <Link to="/createEvent">
          <button className="primary">+ Create New Event</button>
        </Link>
      </div>

      {message && (
        <div className={`mb-6 rounded-lg border p-4 font-semibold ${
          message.type === "success"
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-red-200 bg-red-50 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      {myEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-4 text-gray-400">
          <p className="text-xl font-semibold">You haven&apos;t created any events yet.</p>
          <Link to="/createEvent">
            <button className="primary">Create your first event</button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {myEvents.map(event => (
            <div
              key={event._id}
              className="flex flex-col md:flex-row gap-4 border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-full md:w-48 h-36 flex-shrink-0">
                {event.image ? (
                  <img
                    src={eventImageUrl(event.image)}
                    alt={event.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-grow gap-2">
                <h2 className="text-xl font-extrabold">{event.title.toUpperCase()}</h2>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <AiFillCalendar className="text-primarydark" />
                  <span>{event.eventDate?.split("T")[0]}</span>
                  <span>-</span>
                  <span>{event.eventTime}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MdLocationPin className="text-primarydark" />
                  <span>{event.location}</span>
                </div>

                <div className="text-sm font-semibold text-primarydark">
                  {event.ticketPrice === 0 ? "Free" : `INR. ${event.ticketPrice}`}
                </div>

                <div className="flex gap-4 text-sm text-gray-500 mt-1">
                  <span>Tickets sold: <strong>{event.Count || 0}</strong></span>
                  <span>Capacity: <strong>{event.Participants || event.Quantity || 0}</strong></span>
                </div>
              </div>

              <div className="flex md:flex-col gap-2 justify-end md:justify-start flex-shrink-0">
                <Link to={`/event/${event._id}`}>
                  <button className="w-full px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                    View
                  </button>
                </Link>

                <button
                  onClick={() => setEventToDelete(event)}
                  className="flex items-center justify-center gap-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  <MdDelete className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
