import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
  IonButton, IonIcon, IonAvatar, IonBadge, IonButtons,
  ToastController, AlertController,
} from '@ionic/angular/standalone';

import { Product } from '../models/product';
import { ProductItemComponent } from '../components/product-item/product-item.component';
import { ProductosService } from '../services/productos.service';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonGrid, IonRow, IonCol,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
    IonButton, IonIcon, IonAvatar, IonBadge, IonButtons,
    ProductItemComponent,
  ],
})
export class HomePage implements OnInit {

  // Datos del servicio
  products: Product[] = [];

  // Mejora 1: saludo personalizado
  userName: string = '';

  // Formulario
  nuevoProductoNombre: string = '';
  nuevoProductoPrecio: number | null = null;
  nuevoProductoCategoria: string = '';
  categorias: string[] = ['Ropa', 'Calzado', 'Accesorios', 'Deportes'];

  constructor(
    private productosService: ProductosService,
    private settingsService: SettingsService,
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
  ) {}

  async ngOnInit(): Promise<void> {
    this.products = this.productosService.getAll();
    // Mejora 1: leer nombre guardado
    this.userName = await this.settingsService.getNombre();
  }

  // Navega a la página de detalle
  verDetalle(id: number): void {
    this.router.navigate(['/detalle', id]);
  }

  // Navega a ajustes
  irAjustes(): void {
    this.router.navigate(['/ajustes']);
  }

  // Confirmación antes de guardar
  async confirmarGuardado(): Promise<void> {
    if (!this.nuevoProductoNombre || !this.nuevoProductoPrecio || !this.nuevoProductoCategoria) {
      const toast = await this.toastCtrl.create({
        message: 'Por favor, rellena todos los campos.',
        duration: 2000, color: 'danger', position: 'bottom',
      });
      await toast.present();
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: `¿Añadir "${this.nuevoProductoNombre}" por ${this.nuevoProductoPrecio}€?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Aceptar', handler: () => this.guardarProducto() },
      ],
    });
    await alert.present();
  }

  async guardarProducto(): Promise<void> {
    this.productosService.add({
      name: this.nuevoProductoNombre,
      price: this.nuevoProductoPrecio!,
      description: `Categoría: ${this.nuevoProductoCategoria}`,
    });
    this.products = this.productosService.getAll();

    const toast = await this.toastCtrl.create({
      message: `✅ "${this.nuevoProductoNombre}" añadido correctamente.`,
      duration: 2500, color: 'success', position: 'bottom',
    });
    await toast.present();

    this.nuevoProductoNombre = '';
    this.nuevoProductoPrecio = null;
    this.nuevoProductoCategoria = '';
  }
}