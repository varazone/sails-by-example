import React, { useEffect, useState } from "react";
import { Info } from "lucide-react";

const SailsEventList = ({ sails }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (sails) {
      const unsubscribes = [];

      // Helper function to recursively find all event subscriptions
      const subscribeToEvents = (obj, path = []) => {
        Object.entries(obj).forEach(([key, value]) => {
          if (key === "events" && typeof value === "object") {
            Object.entries(value).forEach(([eventName, eventObj]) => {
              if (eventObj && typeof eventObj.subscribe === "function") {
                const fullPath = [...path, "events", eventName];
                const unsubscribePromise = eventObj.subscribe((data) => {
                  setEvents((
                    prev,
                  ) => [...prev, {
                    path: [fullPath[0], fullPath[2]].join("."),
                    data,
                  }]);
                });
                unsubscribes.push(unsubscribePromise);
              }
            });
          } else if (typeof value === "object" && value !== null) {
            subscribeToEvents(value, [...path, key]);
          }
        });
      };

      subscribeToEvents(sails.services);

      return () => {
        unsubscribes.forEach((unsubscribePromise) =>
          unsubscribePromise.then((unsubscribe) => unsubscribe && unsubscribe())
        );
      };
    }
  }, [sails]);

  if (events.length == 0) {
    return (
      <div className="alert alert-info">
        <Info className="stroke-current shrink-0 w-6 h-6" />
        <span>No events recorded yet.</span>
      </div>
    );
  }

  return (
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
              <td>{event.path}</td>
              <td>{JSON.stringify(event.data)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { SailsEventList };
