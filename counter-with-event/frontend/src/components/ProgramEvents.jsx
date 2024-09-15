import React, { useEffect, useState } from "react";
import { Info } from "lucide-react";

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
    <div className="card w-96 bg-base-100 shadow-md">
      <div className="card-body">
        <h2 className="card-title">Program Events</h2>
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
              <Info className="stroke-current shrink-0 w-6 h-6" />
              <span>No events recorded yet.</span>
            </div>
          )}
      </div>
    </div>
  );
};

export default EventListener;
