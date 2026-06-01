import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons,
  IonList, IonItem, IonLabel, IonToggle, IonInput, IonButton, IonIcon,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg,
  ToastController, LoadingController,
} from '@ionic/angular/standalone';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Share } from '@capacitor/share';

import { SettingsService } from '../services/settings.service';
import { PhotoService } from '../services/photo.service';
import { LocationService, Coordenadas } from '../services/location.service';

@Component({
  selector: 'app-ajustes',
  templateUrl: 'ajustes.page.html',
  styleUrls: ['ajustes.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons,
    IonList, IonItem, IonLabel, IonToggle, IonInput, IonButton, IonIcon,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg,
  ],
})
export class AjustesPage implements OnInit {

  darkMode: boolean = false;
  userName: string = '';

  // Cámara
  fotoUrl: string | undefined;

  // GPS
  coordenadas: Coordenadas | undefined;
  mapsUrl: string = '';

  constructor(
    private settingsService: SettingsService,
    private photoService: PhotoService,
    private locationService: LocationService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
  ) {}

  async ngOnInit(): Promise<void> {
    this.darkMode = await this.settingsService.getDarkMode();
    this.userName = await this.settingsService.getNombre();
  }

  async onDarkModeChange(): Promise<void> {
    await this.settingsService.setDarkMode(this.darkMode);
  }

  async guardarNombre(): Promise<void> {
    await this.settingsService.setNombre(this.userName);

    // PLUGIN EXTRA 1: Haptics – vibración de confirmación al guardar
    await Haptics.impact({ style: ImpactStyle.Medium });

    const toast = await this.toastCtrl.create({
      message: `✅ Nombre guardado: ${this.userName}`,
      duration: 2000, color: 'success', position: 'bottom',
    });
    await toast.present();
  }

  // ── PLUGIN CÁMARA ────────────────────────────────────────────
  async tomarFoto(): Promise<void> {
    try {
      this.fotoUrl = await this.photoService.takePhoto();
      // Haptics: vibración suave al tomar la foto
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: '❌ No se pudo acceder a la cámara.',
        duration: 2500, color: 'danger', position: 'bottom',
      });
      await toast.present();
    }
  }

  // PLUGIN EXTRA 2: Share – compartir la foto tomada
  async compartirFoto(): Promise<void> {
    if (!this.fotoUrl) return;
    try {
      await Share.share({
        title: 'Mi foto en Mi Tienda',
        text: 'Mira esta foto tomada desde Mi Tienda App',
        dialogTitle: 'Compartir foto',
      });
    } catch {
      // El usuario canceló el share, no es un error real
    }
  }

  // ── PLUGIN GPS ───────────────────────────────────────────────
  async obtenerUbicacion(): Promise<void> {
    const loading = await this.loadingCtrl.create({
      message: 'Obteniendo ubicación...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      this.coordenadas = await this.locationService.getCurrentPosition();
      this.mapsUrl = this.locationService.getGoogleMapsUrl(
        this.coordenadas.lat,
        this.coordenadas.lng
      );
      loading.dismiss();

      // Haptics: vibración al obtener ubicación
      await Haptics.notification({ type: 'SUCCESS' as any });

      const toast = await this.toastCtrl.create({
        message: `📍 Ubicación obtenida correctamente`,
        duration: 2000, color: 'success', position: 'bottom',
      });
      await toast.present();
    } catch (error) {
      loading.dismiss();
      const toast = await this.toastCtrl.create({
        message: '❌ No se pudo obtener la ubicación. Verifica los permisos.',
        duration: 3000, color: 'danger', position: 'bottom',
      });
      await toast.present();
    }
  }

  // PLUGIN EXTRA 2: Share – compartir ubicación
  async compartirUbicacion(): Promise<void> {
    if (!this.coordenadas) return;
    try {
      await Share.share({
        title: 'Mi ubicación desde Mi Tienda',
        text: `Estoy en: ${this.mapsUrl}`,
        url: this.mapsUrl,
        dialogTitle: 'Compartir ubicación',
      });
    } catch {
      // El usuario canceló
    }
  }

  abrirMaps(): void {
    window.open(this.mapsUrl, '_blank');
  }
}