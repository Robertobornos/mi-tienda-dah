import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonGrid, IonRow, IonCol, IonBadge, IonButton, IonIcon, IonItem, IonLabel,
  AlertController, ToastController,
} from '@ionic/angular/standalone';

import { Product } from '../models/product';
import { ProductosService } from '../services/productos.service';

@Component({
  selector: 'app-detalle',
  templateUrl: 'detalle.page.html',
  styleUrls: ['detalle.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonGrid, IonRow, IonCol, IonBadge, IonButton, IonIcon, IonItem, IonLabel,
  ],
})
export class DetallePage implements OnInit {

  product: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productosService: ProductosService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.product = this.productosService.getById(id);
  }

  // Mejora 4: alert de confirmación antes de eliminar
  async confirmarEliminar(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar producto',
      message: `¿Estás seguro de que quieres eliminar "${this.product?.name}"? Esta acción no se puede deshacer.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.eliminar(),
        },
      ],
    });
    await alert.present();
  }

  // Mejora 2: elimina y navega de vuelta
  async eliminar(): Promise<void> {
    if (!this.product) return;
    this.productosService.delete(this.product.id);

    const toast = await this.toastCtrl.create({
      message: `🗑️ "${this.product.name}" eliminado correctamente.`,
      duration: 2500,
      color: 'warning',
      position: 'bottom',
    });
    await toast.present();

    this.router.navigate(['/home']);
  }

  // Volver manualmente (complemento al back button)
  volver(): void {
    this.router.navigate(['/home']);
  }
}