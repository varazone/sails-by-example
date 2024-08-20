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
    <div>
      <h2>Events</h2>
      <ul>
        {events.map((event, index) => (
          <li key={index}>Counter incremented to: {event}</li>
        ))}
      </ul>
    </div>
  );
};

export default EventListener;
