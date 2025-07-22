import React, { useState, useEffect } from 'react';
import Events from '../../components/Events/events';
import AddEvent from '../../components/AddEvent/AddEvent';
import { useAuth } from '../../utils/useAuth';
import styles from './events.module.scss';
import { fetchEvents } from '../../api/events';
import type { IEvent } from '../../types/event.types';

const EventsPage: React.FC = () => {
  const [refresh, setRefresh] = useState(false);
  const [events, setEvents] = useState<IEvent[]>([]);
  const { user } = useAuth();

  const handleEventAdded = () => {
    setRefresh(prev => !prev);
  };

  useEffect(() => {
    fetchEvents().then(setEvents);
  }, [refresh]);

  return (
    <div>
      <div className={styles.eventsContainer}>
        {user && (
          <div className={styles.userInfo}>
            <h3>Информация о пользователе</h3>
            <p>Имя: {user.name}</p>
            <p>Email: {user.email}</p>
          </div>
        )}
        <div className={styles.eventsPage}>
          <div className={styles.content}>
            <div className={styles.eventsList}>
              <Events events={events} key={refresh.toString()} />
            </div>
            <div className={styles.addEventSection}>
              <AddEvent onEventAdded={handleEventAdded} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;