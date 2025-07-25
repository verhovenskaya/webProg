import React, { useState, useEffect } from 'react';
import type { IEvent } from '../../types/event.types';
import LocationPickerMap from '../Events/LocationPickerMap';
import styles from './EditEventModal.module.scss';

interface EditEventModalProps {
  event: IEvent;
  onSave: (updatedEvent: IEvent) => void;
  onClose: () => void;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ event, onSave, onClose }) => {
  const [formData, setFormData] = useState<IEvent>({ ...event });
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    date: '',
    location: ''
  });

  useEffect(() => {
    setFormData({ ...event });
  }, [event]);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'title':
        if (!value.trim()) return 'Название обязательно';
        if (value.length > 100) return 'Не более 100 символов';
        return '';
      case 'description':
        if (value.length > 500) return 'Не более 500 символов';
        return '';
      case 'date':
        if (!value) return 'Дата обязательна';
        if (new Date(value) < new Date()) return 'Дата не может быть в прошлом';
        return '';
      case 'location':
        if (!value.trim()) return 'Локация обязательна';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateForm = () => {
    const newErrors = {
      title: validateField('title', formData.title),
      description: validateField('description', formData.description || ''),
      date: validateField('date', formData.date),
      location: validateField('location', formData.location)
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleLocationChange = (location: string) => {
    setFormData(prev => ({ ...prev, location }));
    setErrors(prev => ({ ...prev, location: validateField('location', location) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSave(formData);
  };

  const getCurrentDatetime = (): string => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
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
              maxLength={100}
              required
            />
            {errors.title && <span className={styles.error}>{errors.title}</span>}
          </div>
          
          <div className={styles.formGroup}>
            <label>Описание:</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              maxLength={500}
              rows={3}
            />
            {errors.description && <span className={styles.error}>{errors.description}</span>}
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
            {errors.date && <span className={styles.error}>{errors.date}</span>}
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
            {errors.location && <span className={styles.error}>{errors.location}</span>}
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
              disabled={Object.values(errors).some(error => error)}
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