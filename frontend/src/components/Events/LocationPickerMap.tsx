import React, { useState, useEffect } from 'react';
import { Map, Placemark } from '@pbe/react-yandex-maps';

interface LocationPickerMapProps {
  value?: string;
  onChange: (coords: string) => void;
}

const LocationPickerMap: React.FC<LocationPickerMapProps> = ({ value, onChange }) => {
  const [coords, setCoords] = useState<[number, number]>([55.75, 37.57]);

  useEffect(() => {
    if (value && value.split(',').length === 2) {
      setCoords(value.split(',').map(Number) as [number, number]);
    }
  }, [value]);

  const handleMapClick = (e: any) => {
    const newCoords = e.get('coords');
    setCoords(newCoords);
    onChange(newCoords.join(', '));
  };

  return (
    <Map
      defaultState={{ center: coords, zoom: 10 }}
      state={{ center: coords, zoom: 10 }}
      width="100%"
      height="300px"
      onClick={handleMapClick}
    >
      <Placemark geometry={coords} />
    </Map>
  );
};

export default LocationPickerMap;