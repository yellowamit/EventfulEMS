import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { MdCheckCircle } from 'react-icons/md';

export default function AddEvent() {
  const {user, loading} = useContext(UserContext);
  const location = useLocation();
  const [formData, setFormData] = useState({
    owner: "",
    ownerName: "",
    title: "",
    optional:"",
    description: "",
    organizedBy: "",
    eventDate: "",
    eventTime: "",
    location: "",
    ticketPrice: 0,
    Quantity: 100,
    image: '',
    likes: 0
  });
  const [submittedEvent, setSubmittedEvent] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!user) return;

    setFormData((prevState) => ({
      ...prevState,
      owner: user._id,
      ownerName: user.name,
    }));
  }, [user]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prevState) => ({ ...prevState, image: file }));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prevState) => ({ ...prevState, [name]: files[0] }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user?._id) {
      setMessage({ type: "error", text: "Please sign in before creating an event." });
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        payload.append(key, value);
      }
    });

    axios
      .post("/createEvent", payload)
      .then((response) => {
        console.log("Event posted successfully:", response.data);
        setSubmittedEvent(response.data);
        setMessage(null);
        
      })
      .catch((error) => {
        console.error("Error posting event:", error);
        setMessage({ type: "error", text: error.response?.data?.error || "Could not create the event. Please try again." });
      });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-lg text-slate-500">
        Loading event form...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (submittedEvent) {
    return (
      <div className="mx-auto mt-16 max-w-2xl rounded-lg border border-emerald-200 bg-white p-8 text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-4xl text-emerald-700">
          <MdCheckCircle />
        </div>
        <h1 className="text-3xl font-extrabold">Event created</h1>
        <p className="mt-3 text-slate-600">{submittedEvent.title} is now published.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to={`/event/${submittedEvent._id}`}><button className="primary">View Event</button></Link>
          <Link to="/myevents"><button className="secondary">My Events</button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto mt-10 flex w-full max-w-5xl flex-col px-6'>
      <div><h1 className='font-bold text-[36px] mb-5'>Post an Event</h1></div>
      {message && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 font-semibold text-red-700">
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className='flex flex-co'>
      <div className='flex flex-col gap-5'>
        <label className='flex flex-col'>
          Title:
          <input
            type="text"
            name="title"
            className=' rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none'
            value={formData.title}
            onChange={handleChange}
          />
        </label>
        <label className='flex flex-col'>
          Optional:
          <input
            type="text"
            name="optional"
            className=' rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none'
            value={formData.optional}
            onChange={handleChange}
          />
        </label >
        <label className='flex flex-col'>
          Description:
          <textarea
            name="description"
            className=' rounded mt-2 pl-5 px-4 py-2 ring-sky-700 ring-2 h-8 border-none'
            value={formData.description}
            onChange={handleChange}
          />
        </label>
        <label className='flex flex-col'>
          Organized By:
          <input
            type="text"
            className=' rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none'
            name="organizedBy"
            value={formData.organizedBy}
            onChange={handleChange}
          />
        </label>
        <label className='flex flex-col'>
          Event Date:
          <input
            type="date"
            className=' rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none'
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
          />
        </label>
        <label className='flex flex-col'>
          Event Time:
          <input
            type="time"
            name="eventTime"
            className=' rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none'
            value={formData.eventTime}
            onChange={handleChange}
          />
        </label>
        <label className='flex flex-col'>
          Location:
          <input
            type="text"
            name="location"
            className=' rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none'
            value={formData.location}
            onChange={handleChange}
          />
        </label>
        <label className='flex flex-col'>
          Ticket Price:
          <input
            type="number"
            name="ticketPrice"
            className=' rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none'
            value={formData.ticketPrice}
            onChange={handleChange}
          />
        </label>
        <label className='flex flex-col'>
          Total Tickets:
          <input
            type="number"
            name="Quantity"
            min="1"
            className=' rounded mt-2 pl-5 px-4 ring-sky-700 ring-2 h-8 border-none'
            value={formData.Quantity}
            onChange={handleChange}
          />
        </label>
        <label className='flex flex-col'>
          Image:
          <input
            type="file"
            name="image"
            
            className=' rounded mt-2 pl-5 px-4 py-10 ring-sky-700 ring-2 h-8 border-none'
            onChange={handleImageUpload}
          />
        </label >
        <button className='primary' type="submit">Submit</button>
        </div>
        
      </form>
    </div>
  );
}
