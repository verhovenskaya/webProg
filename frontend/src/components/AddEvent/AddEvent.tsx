import React, { useState } from 'react';
import { createEvent } from '../../api/events';
import styles from './AddEvent.module.scss';

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
      <h3>Add New Event</h3>
      <div className={styles.formGroup}>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Date:</label>
        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>Location:</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className={styles.submitButton}>
        Add Event
      </button>
    </form>
  );
};

export default AddEvent;