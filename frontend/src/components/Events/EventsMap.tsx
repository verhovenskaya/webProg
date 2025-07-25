import React from 'react';
import { Map, Placemark } from '@pbe/react-yandex-maps';
import type { IEvent } from '../../types/event.types';

interface EventsMapProps {
  events: IEvent[];
}

const EventsMap: React.FC<EventsMapProps> = ({ events }) => {
  const defaultCenter = events.length > 0 && events[0].location
    ? events[0].location.split(',').map(Number)
    : [55.75, 37.57];

  return (
    <Map
      defaultState={{ center: defaultCenter, zoom: 10 }}
      width="100%"
      height="400px"
    >
      {events.map(event => {
        if (!event.location) return null;
        const coords = event.location.split(',').map(Number);
        return (
          <Placemark
            key={event.id}
            geometry={coords}
            properties={{
              balloonContent: event.title,
            }}
          />
        );
      })}
    </Map>
  );
};

export default EventsMap;