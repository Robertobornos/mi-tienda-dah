import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {

  private _storage: Storage | null = null;

  constructor(private storage: Storage) {}

  // Inicializa el storage (llamar desde app.component.ts)
  async init(): Promise<void> {
    this._storage = await this.storage.create();
  }

  // ── Dark Mode ─────────────────────────────────────────────
  async setDarkMode(value: boolean): Promise<void> {
    await this._storage?.set('darkMode', value);
    this.applyDarkMode(value);
  }

  async getDarkMode(): Promise<boolean> {
    return (await this._storage?.get('darkMode')) ?? false;
  }

  applyDarkMode(enable: boolean): void {
    document.body.classList.toggle('ion-palette-dark', enable);
  }

  // ── Nombre de usuario (Mejora 1) ──────────────────────────
  async setNombre(nombre: string): Promise<void> {
    await this._storage?.set('userName', nombre);
  }

  async getNombre(): Promise<string> {
    return (await this._storage?.get('userName')) ?? '';
  }
}