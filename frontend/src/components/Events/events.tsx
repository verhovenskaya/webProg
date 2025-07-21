import React, { useEffect, useState } from 'react';
import { fetchEvents, type IEvent } from '../../api/events';
import styles from './Events.module.scss';

const Events: React.FC = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        console.log('Loading events...');
        const data = await fetchEvents();
        console.log('Loaded events:', data);
        setEvents(data);
      } catch (err) {
        console.error('Error loading events:', err);
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (loading) return <div className={styles.loading}>Loading events...</div>;
  if (error) return (
    <div className={styles.error}>
      Error: {error}
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );
  
  if (events.length === 0) return (
    <div className={styles.empty}>
      No events found
      <button onClick={() => window.location.reload()}>Refresh</button>
    </div>
  );

  return (
    <div className={styles.eventsContainer}>
      <h1>Events</h1>
      {events.map((event) => (
        <div key={event.id} className={styles.eventCard}>
          <h3 className={styles.eventTitle}>{event.title}</h3>
          <p className={styles.eventDescription}>
            {event.description || 'No description provided'}
          </p>
          <div className={styles.eventDetails}>
            <span className={styles.eventDate}>
              Date: {new Date(event.date).toLocaleDateString()}
            </span>
            <span className={styles.eventLocation}>
              Location: {event.location}
            </span>
          </div>
          {event.creator && (
            <div className={styles.eventCreator}>
              Organizer: {event.creator.name} ({event.creator.email})
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Events;