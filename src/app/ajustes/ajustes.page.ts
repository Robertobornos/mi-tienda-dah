import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons,
  IonList, IonItem, IonLabel, IonToggle, IonInput, IonButton, IonIcon,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  ToastController,
} from '@ionic/angular/standalone';

import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-ajustes',
  templateUrl: 'ajustes.page.html',
  styleUrls: ['ajustes.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons,
    IonList, IonItem, IonLabel, IonToggle, IonInput, IonButton, IonIcon,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  ],
})
export class AjustesPage implements OnInit {

  darkMode: boolean = false;
  userName: string = '';

  constructor(
    private settingsService: SettingsService,
    private toastCtrl: ToastController,
  ) {}

  async ngOnInit(): Promise<void> {
    this.darkMode = await this.settingsService.getDarkMode();
    this.userName = await this.settingsService.getNombre();
  }

  // Cambia y guarda el dark mode al instante
  async onDarkModeChange(): Promise<void> {
    await this.settingsService.setDarkMode(this.darkMode);
  }

  // Guarda el nombre (Mejora 1)
  async guardarNombre(): Promise<void> {
    await this.settingsService.setNombre(this.userName);
    const toast = await this.toastCtrl.create({
      message: `✅ Nombre guardado: ${this.userName}`,
      duration: 2000,
      color: 'success',
      position: 'bottom',
    });
    await toast.present();
  }
}