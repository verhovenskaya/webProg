import api from './index';

export interface IEvent {
  id: number;
  title: string;
  description: string | null;
  date: string;
  location: string;
  createdby: number;
  creator?: {
    name: string;
    email: string;
  };
}

export const fetchEvents = async (userId?: number): Promise<IEvent[]> => {
  try {
    const params = userId ? { createdby: userId } : {};
    const response = await api.get<IEvent[]>('/events', { params });
    console.log('Events data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const fetchEventById = async (id: number): Promise<IEvent> => {
  const response = await api.get<IEvent>(`/events/${id}`);
  return response.data;
};

export const createEvent = async (eventData: Omit<IEvent, 'id'>): Promise<IEvent> => {
  const response = await api.post<IEvent>('/events', eventData);
  return response.data;
};

export const updateEvent = async (id: number, eventData: Partial<IEvent>): Promise<IEvent> => {
  const response = await api.put<IEvent>(`/events/${id}`, eventData);
  return response.data;
};

export const deleteEvent = async (id: number): Promise<void> => {
  await api.delete(`/events/${id}`);
};