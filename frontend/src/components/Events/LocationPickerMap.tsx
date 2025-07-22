import React, { useState, useEffect } from 'react';
import { Map, Placemark } from '@pbe/react-yandex-maps';

interface LocationPickerMapProps {
  value?: string; // "55.684758, 37.738521"
  onChange: (coords: string) => void;
}

const LocationPickerMap: React.FC<LocationPickerMapProps> = ({ value, onChange }) => {
  const initialCoords = value && value.split(',').length === 2
    ? value.split(',').map(Number)
    : [55.75, 37.57];
  const [coords, setCoords] = useState<[number, number]>(initialCoords as [number, number]);

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