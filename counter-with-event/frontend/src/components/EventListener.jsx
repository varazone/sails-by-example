import React, { useEffect, useState } from "react";

const EventListener = ({ program }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (program) {
      const unsubscribePromise = program.counter.subscribeToIncrementedEvent(
        (data) => {
          setEvents((prev) => [...prev, data]);
        },
      );

      return () => {
        unsubscribePromise.then((unsubscribe) => unsubscribe && unsubscribe());
      };
    }
  }, [program]);

  return (
    /*
    <div>
      <h2>Events</h2>
      <ul>
        {events.map((event, index) => (
          <li key={index}>Counter incremented to: {event}</li>
        ))}
      </ul>
    </div>
    */
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Events</h2>
        {events.length > 0
          ? (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, index) => (
                    <tr key={index} className="hover">
                      <td>Counter incremented</td>
                      <td>{event}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
          : (
            <div className="alert alert-info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                >
                </path>
              </svg>
              <span>No events recorded yet.</span>
            </div>
          )}
      </div>
    </div>
  );
};

export default EventListener;
