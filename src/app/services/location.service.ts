import { Injectable } from '@angular/core';
import { Geolocation, Position } from '@capacitor/geolocation';

export interface Coordenadas {
  lat: number;
  lng: number;
  accuracy: number;
}

@Injectable({
  providedIn: 'root',
})
export class LocationService {

  // Obtiene la posición actual del dispositivo
  async getCurrentPosition(): Promise<Coordenadas> {
    const position: Position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    });
    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
    };
  }

  // Genera el enlace a Google Maps con las coordenadas
  getGoogleMapsUrl(lat: number, lng: number): string {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }
}