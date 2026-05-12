 
import axios from "axios";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { BsArrowRightShort } from "react-icons/bs";
import { BiLike } from "react-icons/bi";
import { eventImageUrl } from "../utils/media";

  export default function IndexPage() {
    const [events, setEvents] = useState([]);

   //! Fetch events from the server ---------------------------------------------------------------
    useEffect(() => {
      
      axios
        .get("/createEvent")
        .then((response) => {
          setEvents(response.data);
        })
        .catch((error) => {
          console.error("Error fetching events:", error);
        });
    }, []);
    
  //! Like Functionality --------------------------------------------------------------
    const handleLike = (eventId) => {
      axios
        .post(`/event/${eventId}`)
        .then((response) => {
            setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event._id === eventId
                ? { ...event, likes: event.likes + 1 }
                : event
            )
          );
          console.log("done", response)
        })
        .catch((error) => {
          console.error("Error liking ", error);
        });
    };
  

    return (
      <>
      <div className="mt-1 flex flex-col">
        <div className="hidden sm:block" >
          <div href="#" className="flex item-center inset-0">
            <img src="../src/assets/hero.jpg" alt="" className='w-full'/> 
          </div>
        </div>

        <div className="mx-10 my-5 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:mx-5 ">
        
        {/*-------------------------- Checking whether there is a event or not-------------------  */}
        {events.length > 0 && events.map((event) => {
          const eventDate = new Date(event.eventDate);
          const currentDate = new Date();
          
          //! Check the event date is passed or not --------------------------------------------------------------------------------------- 
          if (eventDate > currentDate || eventDate.toDateString() === currentDate.toDateString()){
            return (
              <div className="bg-white rounded-lg relative overflow-hidden shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl" key={event._id}>
              <div className='relative h-48 overflow-hidden bg-slate-200'>
              {event.image ? (
                <img
                  src={eventImageUrl(event.image)}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-500">No event image</div>
              )}
                <div className="absolute right-3 top-3 flex gap-4">
                <button onClick={() => handleLike(event._id)}>
                  <BiLike className="w-auto h-12 lg:h-10 sm:h-12 md:h-10 bg-white p-2 rounded-full shadow-md transition-all hover:text-primary" />
                </button>
              
                </div>
              </div>

              <div className="m-2 grid gap-2">
                <div className="flex justify-between items-center">
                  <h1 className="font-bold text-lg mt-2">{event.title.toUpperCase()}</h1>
                  <div className="flex gap-2 items-center mr-4 text-red-600"> <BiLike /> {event.likes}</div>
                </div>
                

                <div className="flex text-sm flex-nowrap justify-between text-primarydark font-bold mr-4">
                  <div>{event.eventDate.split("T")[0]}, {event.eventTime}</div>
                  <div>{event.ticketPrice === 0? 'Free' : 'Rs. '+ event.ticketPrice}</div>
                </div>

                <div className="text-xs flex flex-col flex-wrap truncate-text">{event.description}</div>
                {!!event.Quantity && (
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all"
                      style={{ width: `${Math.min(((event.Count || 0) / event.Quantity) * 100, 100)}%` }}
                    />
                  </div>
                )}
                <div className="flex justify-between items-center my-2 mr-4">
                  <div className="text-sm text-primarydark ">Organized By: <br /><span className="font-bold">{event.organizedBy}</span></div>
                  <div className="text-sm text-primarydark ">Created By: <br/> <span className="font-semibold">{(event.ownerName || event.owner || "").toUpperCase()}</span></div>
                </div>
                <Link to={'/event/'+event._id} className="flex justify-center">
                  <button className="primary flex items-center gap-2">Book Ticket< BsArrowRightShort className="w-6 h-6" /></button>
                </Link>
                
              </div>
            </div>
            )
          }
          return null;
        }   
        )}
        </div>
      </div>
      </>
        
      )
  }
  
