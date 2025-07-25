import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { fetchEventsData } from '../../features/events/eventsSlice';
import Events from '../../components/Events/events';
import AddEvent from '../../components/AddEvent/AddEvent';
import EditEventModal from '../../components/EditEventModal/EditEventModal';
import { useAuth } from '../../utils/useAuth';
import styles from './events.module.scss';
import type { IEvent } from '../../types/event.types';
import { deleteEvent } from '../../api';
import { updateEvent } from '../../api';


const EventsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const { events, isLoading } = useAppSelector(state => state.events);
  const [editingEvent, setEditingEvent] = useState<IEvent | null>(null); // Текущее редактируемое мероприятие

  useEffect(() => {
    dispatch(fetchEventsData(user?.id));
  }, [dispatch, user]);

  const handleEventAdded = () => {
    dispatch(fetchEventsData(user?.id));
  };

  const handleEditEvent = (event: IEvent) => {
    setEditingEvent(event); // Открываем модальное окно с выбранным мероприятием
  };

  const handleDeleteEvent = async (id: number) => {
    try {
      await deleteEvent(id);
      dispatch(fetchEventsData(user?.id));
    } catch (error) {
      console.error('Ошибка при удалении мероприятия:', error);
    }
  };

  const handleUpdateEvent = async (updatedEvent: IEvent) => {
    try {
      await updateEvent(updatedEvent.id, updatedEvent);
      dispatch(fetchEventsData(user?.id));
      setEditingEvent(null); // Закрываем модальное окно после успешного обновления
    } catch (error) {
      console.error('Ошибка при обновлении мероприятия:', error);
    }
  };

  return (
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
            <h2>{user ? 'Мои мероприятия' : 'Все мероприятия'}</h2>
            <Events 
              events={events} 
              isLoading={isLoading} 
              isProfilePage={!!user}
              onEdit={handleEditEvent}
              onDelete={handleDeleteEvent}
            />
          </div>
          
          <div className={styles.addEventSection}>
            {user && <AddEvent onEventAdded={handleEventAdded} />}
          </div>
        </div>
      </div>

      {/* Модальное окно редактирования */}
      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onSave={handleUpdateEvent}
          onClose={() => setEditingEvent(null)}
        />
      )}
    </div>
  );
};

export default EventsPage;