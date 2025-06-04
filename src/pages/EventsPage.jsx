import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import { AiOutlineCalendar } from "react-icons/ai";

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />
          <div className="w-full min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">All Events</h1>
              
              {allEvents.length !== 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {allEvents.map((event) => (
                    <EventCard key={event._id} active={true} data={event} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <AiOutlineCalendar size={40} className="text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-3">No Events Available</h3>
                  <p className="text-gray-500 text-center max-w-md">
                    There are currently no events to display. Check back later for exciting promotions and offers!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventsPage;
