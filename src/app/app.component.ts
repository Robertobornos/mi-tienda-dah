import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cartOutline, starOutline, pricetagOutline, cubeOutline,
  searchOutline, personOutline, heartOutline, bagOutline,
  trashOutline, settingsOutline, arrowBackOutline, checkmarkCircleOutline,
} from 'ionicons/icons';
import { SettingsService } from './services/settings.service';
import { provideStorage, Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {

  constructor(private settingsService: SettingsService) {
    addIcons({
      cartOutline, starOutline, pricetagOutline, cubeOutline,
      searchOutline, personOutline, heartOutline, bagOutline,
      trashOutline, settingsOutline, arrowBackOutline, checkmarkCircleOutline,
    });
  }

  async ngOnInit(): Promise<void> {
    // Inicializar storage y aplicar ajustes guardados al arrancar
    await this.settingsService.init();
    const darkMode = await this.settingsService.getDarkMode();
    this.settingsService.applyDarkMode(darkMode);
  }
}