import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonAvatar,
  IonBadge,
  ToastController,
  AlertController,
} from '@ionic/angular/standalone';

import { Product } from '../models/product';
import { ProductItemComponent } from '../components/product-item/product-item.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    IonAvatar,
    IonBadge,
    ProductItemComponent,
  ],
})
export class HomePage {

  // ── Datos del catálogo ──────────────────────────────────────
  products: Product[] = [
    { id: 1, name: 'Camiseta', price: 19.99, description: 'Camiseta de algodón' },
    { id: 2, name: 'Pantalón', price: 29.99, description: 'Pantalón vaquero' },
    { id: 3, name: 'Zapatillas', price: 49.99, description: 'Zapatillas deportivas' },
    { id: 4, name: 'Gorra', price: 14.99, description: 'Gorra ajustable' },
    { id: 5, name: 'Mochila', price: 39.99, description: 'Mochila urbana' },
    { id: 6, name: 'Chaqueta', price: 59.99, description: 'Chaqueta cortavientos' },
  ];

  // ── Propiedades del formulario (ngModel) ────────────────────
  nuevoProductoNombre: string = '';
  nuevoProductoPrecio: number | null = null;
  nuevoProductoCategoria: string = '';

  categorias: string[] = ['Ropa', 'Calzado', 'Accesorios', 'Deportes'];

  // ── Inyección de controladores ───────────────────────────────
  constructor(
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
  ) {}

  // ── MEJORA 4: Alert de confirmación antes del toast ──────────
  async confirmarGuardado() {
    // Validación básica
    if (!this.nuevoProductoNombre || !this.nuevoProductoPrecio || !this.nuevoProductoCategoria) {
      const errorToast = await this.toastCtrl.create({
        message: 'Por favor, rellena todos los campos.',
        duration: 2000,
        color: 'danger',
        position: 'bottom',
      });
      await errorToast.present();
      return;
    }

    // Mostrar alert de confirmación
    const alert = await this.alertCtrl.create({
      header: 'Confirmar',
      message: `¿Deseas añadir "${this.nuevoProductoNombre}" por ${this.nuevoProductoPrecio}€?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.guardarProducto();
          },
        },
      ],
    });

    await alert.present();
  }

  // ── Guarda el producto y muestra el toast ────────────────────
  async guardarProducto() {
    // Añadir el nuevo producto a la lista
    const nuevoId = this.products.length + 1;
    this.products.push({
      id: nuevoId,
      name: this.nuevoProductoNombre,
      price: this.nuevoProductoPrecio!,
      description: `Categoría: ${this.nuevoProductoCategoria}`,
    });

    // Toast de confirmación (Reto Básico 6)
    const toast = await this.toastCtrl.create({
      message: `✅ "${this.nuevoProductoNombre}" añadido correctamente.`,
      duration: 2500,
      color: 'success',
      position: 'bottom',
    });
    await toast.present();

    // Limpiar formulario
    this.nuevoProductoNombre = '';
    this.nuevoProductoPrecio = null;
    this.nuevoProductoCategoria = '';
  }
}