import React, { useEffect, useState } from 'react';
import { fetchEvents, type IEvent, deleteEvent, updateEvent } from '../../api/events';
import styles from './Events.module.scss';
import AddEvent from '../AddEvent/AddEvent';

interface EventsProps {
  events?: IEvent[];
}

const Events: React.FC<EventsProps> = ({ events: propsEvents }) => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<IEvent | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = (event: IEvent) => {
    setEditingEvent(event);
    setIsEditModalOpen(true);
  };

  const handleEditSave = async (updated: Partial<IEvent>) => {
    if (!editingEvent) return;
    try {
      const updatedEvent = await updateEvent(editingEvent.id, updated);
      setEvents((prev) => prev.map(ev => ev.id === editingEvent.id ? { ...ev, ...updatedEvent } : ev));
      setIsEditModalOpen(false);
      setEditingEvent(null);
    } catch (err) {
      alert('Ошибка при сохранении изменений');
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setEditingEvent(null);
  };

  useEffect(() => {
    if (propsEvents) {
      setLoading(false);
      setError(null);
      setEvents(propsEvents);
      return;
    }
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, [propsEvents]);

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
      <h1 className={styles.eventsHeader}>Мероприятия</h1>
      {events.map((event) => (
        <div key={event.id} className={styles.eventCard}>
          <button
            className={styles.deleteButton}
            title="Удалить мероприятие"
            onClick={async (e) => {
              e.stopPropagation();
              if (window.confirm('Удалить мероприятие?')) {
                try {
                  await deleteEvent(event.id);
                  setEvents((prev) => prev.filter((ev) => ev.id !== event.id));
                } catch (err) {
                  alert('Ошибка при удалении');
                }
              }
            }}
          >
            ×
          </button>
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
          <button className={styles.editButton} title="Редактировать мероприятие" onClick={() => handleEditClick(event)}>
            Редактировать
          </button>
        </div>
      ))}
      {isEditModalOpen && editingEvent && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Редактировать мероприятие</h2>
            <form
              className={styles.editForm}
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as typeof e.target & {
                  title: { value: string };
                  description: { value: string };
                  date: { value: string };
                  location: { value: string };
                };
                await handleEditSave({
                  title: form.title.value,
                  description: form.description.value,
                  date: new Date(form.date.value).toISOString(),
                  location: form.location.value,
                });
              }}
            >
              <div className={styles.formGroup}>
                <label htmlFor="edit-title">Название:</label>
                <input
                  id="edit-title"
                  name="title"
                  type="text"
                  defaultValue={editingEvent.title}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="edit-description">Описание:</label>
                <textarea
                  id="edit-description"
                  name="description"
                  defaultValue={editingEvent.description || ''}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="edit-date">Дата и время:</label>
                <input
                  id="edit-date"
                  name="date"
                  type="datetime-local"
                  defaultValue={editingEvent.date.slice(0, 16)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="edit-location">Место проведения:</label>
                <input
                  id="edit-location"
                  name="location"
                  type="text"
                  defaultValue={editingEvent.location}
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={handleEditCancel} className={styles.cancelButton}>
                  Отмена
                </button>
                <button type="submit" className={styles.saveButton}>
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;