import React, { useState, useEffect } from 'react';
import type {IEvent} from '../../types/event.types';
import LocationPickerMap from '../Events/LocationPickerMap';
import styles from './EditEventModal.module.scss';



interface EditEventModalProps {
  event: IEvent;
  onSave: (updatedEvent: IEvent) => void;
  onClose: () => void;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ event, onSave, onClose }) => {
  const [formData, setFormData] = useState<IEvent>({ ...event });
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    setFormData({ ...event });
  }, [event]);

  const getCurrentDatetime = (): string => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const validateDate = (dateString: string): boolean => {
    const selectedDate = new Date(dateString);
    const now = new Date();
    return selectedDate >= now;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'date') {
      if (!validateDate(value)) {
        setDateError('Дата мероприятия не может быть раньше текущей');
      } else {
        setDateError('');
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (location: string) => {
    setFormData(prev => ({ ...prev, location }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateDate(formData.date)) {
      setDateError('Пожалуйста, выберите корректную дату');
      return;
    }
    
    onSave(formData);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2 className={styles.modalTitle}>Редактировать мероприятие</h2>
        <form onSubmit={handleSubmit} className={styles.editForm}>
          <div className={styles.formGroup}>
            <label>Название:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Описание:</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Дата и время:</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date.slice(0, 16)}
              onChange={handleChange}
              min={getCurrentDatetime()}
              required
            />
            {dateError && <span className={styles.error}>{dateError}</span>}
          </div>
          
          <div className={styles.formGroup}>
            <label>Место проведения:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <div className={styles.mapContainer}>
              <LocationPickerMap
                value={formData.location}
                onChange={handleLocationChange}
              />
            </div>
          </div>
          
         <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.saveButton}
              disabled={!!dateError}
            >
              Сохранить изменения
            </button>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={onClose}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;