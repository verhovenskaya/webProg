import React from 'react';
import styles from './events.module.scss';
import type { IEvent } from '../../types/event.types';

interface EventsProps {
  events: IEvent[] | undefined;
  isLoading?: boolean;
  isProfilePage?: boolean;
  onEdit?: (event: IEvent) => void;
  onDelete?: (id: number) => void;
}

const Events: React.FC<EventsProps> = ({ 
  events = [], 
  isLoading, 
  isProfilePage,
  onEdit,
  onDelete
}) => {
  if (isLoading) return <div className={styles.loading}>Загрузка мероприятий...</div>;
  
  if (!events || !Array.isArray(events)) {
    console.error('Events is not an array:', events);
    return <div className={styles.error}>Ошибка загрузки мероприятий</div>;
  }

  if (events.length === 0) return (
    <div className={styles.empty}>
      {isProfilePage ? 'У вас нет мероприятий' : 'Мероприятий не найдено'}
    </div>
  );

  return (
    <div className={styles.eventsGrid}>
      {events.map((event) => (
        <div key={event.id} className={styles.eventCard}>
          <h3 className={styles.eventTitle}>{event.title}</h3>
          <p className={styles.eventDescription}>
            {event.description || 'Нет описания'}
          </p>
          <div className={styles.eventDetails}>
            <span className={styles.eventDate}>
              {new Date(event.date).toLocaleDateString()}
            </span>
            <span className={styles.eventLocation}>
              {event.location}
            </span>
          </div>
          {isProfilePage && (
            <div className={styles.eventActions}>
              <button 
                className={styles.deleteButton}
                onClick={() => onDelete && onDelete(event.id)}
                title="Удалить мероприятие"
              >
                ✕
              </button>
              <button 
                className={styles.editButton}
                onClick={() => onEdit && onEdit(event)}
              >
                Редактировать
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Events;