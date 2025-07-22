import React, { useState } from 'react';
import Events from '../../components/Events/events';
import AddEvent from '../../components/AddEvent/AddEvent';
import styles from './events.module.scss';

const EventsPage: React.FC = () => {
  const [refresh, setRefresh] = useState(false);

  const handleEventAdded = () => {
    setRefresh(prev => !prev);
  };

  return (
    <div className={styles.eventsPage}>
      <div className={styles.content}>
        <div className={styles.eventsList}>
          <Events key={refresh.toString()} />
        </div>
        <div className={styles.addEventSection}>
          <AddEvent onEventAdded={handleEventAdded} />
        </div>
      </div>
    </div>
  );
};

export default EventsPage;