import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';

export default function AddEvent() {
  const {user} = useContext(UserContext);
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
      console.error("Cannot create event without a logged-in user.");
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
        
      })
      .catch((error) => {
        console.error("Error posting event:", error);
      });
  };

  return (
    <div className='mx-auto mt-10 flex w-full max-w-5xl flex-col px-6'>
      <div><h1 className='font-bold text-[36px] mb-5'>Post an Event</h1></div>
      {submittedEvent && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 font-semibold text-emerald-800">
          Event published: {submittedEvent.title}
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
