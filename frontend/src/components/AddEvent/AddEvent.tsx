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
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    date: '',
    location: ''
  });

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
      description: validateField('description', formData.description),
      date: validateField('date', formData.date),
      location: validateField('location', formData.location)
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await createEvent({
        ...formData,
        date: new Date(formData.date).toISOString(),
        createdby: 1 
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

  const getCurrentDatetime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
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
          maxLength={100}
          required
        />
        {errors.title && <span className={styles.error}>{errors.title}</span>}
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="description">Описание:</label>
        <textarea
          id="description"
          name="description"
          placeholder="Краткое описание (необязательно)"
          value={formData.description}
          onChange={handleChange}
          maxLength={500}
        />
        {errors.description && <span className={styles.error}>{errors.description}</span>}
      </div>
      
      <div className={styles.formGroup}>
        <label htmlFor="date">Дата и время:</label>
        <input
          type="datetime-local"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          min={getCurrentDatetime()}
          required
        />
        {errors.date && <span className={styles.error}>{errors.date}</span>}
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
        {errors.location && <span className={styles.error}>{errors.location}</span>}
      </div>
      
      <div className={styles.formGroup}>
        <label>Выберите точку на карте:</label>
        <LocationPickerMap
          value={formData.location}
          onChange={loc => {
            setFormData(prev => ({ ...prev, location: loc }));
            setErrors(prev => ({ ...prev, location: validateField('location', loc) }));
          }}
        />
      </div>
      
      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={Object.values(errors).some(error => error)}
      >
        Создать
      </button>
    </form>
  );
};

export default AddEvent;