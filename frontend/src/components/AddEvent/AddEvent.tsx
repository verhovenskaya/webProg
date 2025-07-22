import React, { useState } from 'react';
import { createEvent } from '../../api/events';
import styles from './AddEvent.module.scss';
import LocationPickerMap from '../Events/LocationPickerMap';

const AddEvent: React.FC<{ onEventAdded: () => void }> = ({ onEventAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEvent({
        ...formData,
        date: new Date(formData.date).toISOString(),
        createdby: 1 // Replace with actual user ID from auth context
      });
      onEventAdded();
      setFormData({
        title: '',
        description: '',
        date: '',
        location: ''
      });
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.addEventForm}>
      <h3 className={styles.formTitle}>Новое мероприятие</h3>
      <div className={styles.formGroup}>
        <label htmlFor="title">Название:</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Введите название"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="description">Описание:</label>
        <textarea
          id="description"
          name="description"
          placeholder="Краткое описание (необязательно)"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="date">Дата и время:</label>
        <input
          type="datetime-local"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="location">Место проведения (координаты):</label>
        <input
          type="text"
          id="location"
          name="location"
          placeholder="Где будет мероприятие?"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>Выберите точку на карте:</label>
        <LocationPickerMap
          value={formData.location}
          onChange={loc => setFormData(prev => ({ ...prev, location: loc }))}
        />
      </div>
      <button type="submit" className={styles.submitButton}>
        Создать
      </button>
    </form>
  );
};

export default AddEvent;