import { Link } from "react-router-dom";
import {IoMdArrowBack} from 'react-icons/io'
import {RiDeleteBinLine} from 'react-icons/ri'
import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

export default function TicketPage() {
    const {user} = useContext(UserContext);
  
    const [userTickets, setUserTickets] = useState([]);
  
    const fetchTickets = useCallback(async()=>{
      if (!user) {
        setUserTickets([]);
        return;
      }

      axios.get(`/tickets/user/${user._id}`)
          .then(response => {
            setUserTickets(response.data);
          })
          .catch(error => {
            console.error('Error fetching user tickets:', error);
          })
    }, [user])

    useEffect(() => {
      fetchTickets()
    }, [fetchTickets]);
  
    const deleteTicket = async(ticketId) => {
      try {
        await axios.delete(`/tickets/${ticketId}`); 
        
        fetchTickets();
        alert('Ticket Deleted');
      } catch (error) {
        console.error('Error deleting ticket:', error);
      }
    }
  
    return (
      <div className="flex flex-col flex-grow bg-slate-50 dark:bg-slate-950">
      <div className="mb-5 flex justify-between place-items-center">
        <div>
          <Link to='/'>
            <button 
                // onClick={handleBackClick}
                className='
                inline-flex 
                mt-12
                gap-2
                p-3 
                ml-12
                bg-gray-100
                justify-center 
                items-center 
                text-blue-700
                font-bold
                rounded-md'
                >
              <IoMdArrowBack 
              className='
              font-bold
              w-6
              h-6
              gap-2'/> 
              Back
            </button>
          </Link>
        </div>
        <div className=" place-item-center hidden">
          
            <RiDeleteBinLine className="h-6 w-10 text-red-700 "/>
          
        </div>
        
        </div>
        <div className="mx-6 mb-10 grid grid-cols-1 gap-5 md:mx-12 xl:grid-cols-2">
        {userTickets.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            Your wallet is empty. Book an event and your ticket will appear here.
          </div>
        )}
          
        {userTickets.map(ticket => (
          
        <div key={ticket._id} className="overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
            <div className="relative grid gap-5 p-5 md:grid-cols-[160px_1fr]">
              <button onClick={()=>deleteTicket(ticket._id)} className="absolute right-3 top-3 cursor-pointer rounded-full p-2 hover:bg-red-50">
                <RiDeleteBinLine className=" h-6 w-10 text-red-700 "/>
              </button>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                  <img src={ticket.ticketDetails.qr} alt="QRCode" className="aspect-square w-full rounded-md object-contain"/>
                </div>
                <div className="grid gap-3 text-sm md:grid-cols-2 md:text-base">
                  <div className="md:col-span-2">
                    Event Name : <br /><span className=" font-extrabold text-primarydark">{ticket.ticketDetails.eventname.toUpperCase()}</span>
                  </div>
                  
                  <div>
                    Date & Time:<br /> <span className="font-extrabold text-primarydark">{ticket.ticketDetails.eventdate.toUpperCase().split("T")[0]}, {ticket.ticketDetails.eventtime}</span>
                  </div>
                  <div>
                    Name: <span className="font-extrabold text-primarydark">{ticket.ticketDetails.name.toUpperCase()}</span>
                  </div>
                  <div>
                    Quantity: <span className="font-extrabold text-primarydark">{ticket.count || 1}</span>
                  </div>
                  <div>
                    Price: <span className="font-extrabold text-primarydark"> Rs. {ticket.ticketDetails.totalPrice || ticket.ticketDetails.ticketprice}</span>
                  </div>
                  <div>
                    Email: <span className="font-extrabold text-primarydark">{ticket.ticketDetails.email}</span>
                  </div>
                  <div className="md:col-span-2">
                    Ticket ID:<br /><span className="font-mono font-extrabold text-primarydark">{ticket.ticketCode || ticket._id}</span>
                  </div>
                </div>
              </div>
              
            </div>
        
         ))}
         </div>
  
      
      </div>
    )
}
